'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  isAdmin: Boolean,
  updated: {
    type: Date
  },
  votedProjects: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

var User = mongoose.model('User', UserSchema, 'user');
module.exports = User;


function seedUsers() {
  var users = [
    {
      firstName: 'Clinton',
      lastName: 'Andrews',
      email: 'candrews800@gmail.com',
      password: '1234',
      isAdmin: false,
      votedProjects: []
    },
    {
      firstName: 'Clinton',
      lastName: 'Andrews',
      email: 'candrews800+admin@gmail.com',
      password: '1234',
      isAdmin: true,
      votedProjects: []
    },
    {
      firstName: 'George',
      lastName: '',
      email: 'george@gmail.com',
      password: '1234',
      isAdmin: false,
      votedProjects: []
    },
    {
      firstName: 'George',
      lastName: '',
      email: 'george+admin@gmail.com',
      password: '1234',
      isAdmin: true,
      votedProjects: []
    },
    {
      firstName: 'Amy',
      lastName: '',
      email: 'amy@gmail.com',
      password: '1234',
      isAdmin: false,
      votedProjects: []
    },
    {
      firstName: 'Amy',
      lastName: 'Ly',
      email: 'amy+admin@gmail.com',
      password: '1234',
      isAdmin: true,
      votedProjects: []
    },
    {
      firstName: 'Travis',
      lastName: '',
      email: 'travis@gmail.com',
      password: '1234',
      isAdmin: false,
      votedProjects: []
    },
    {
      firstName: 'Travis',
      lastName: '',
      email: 'travis+admin@gmail.com',
      password: '1234',
      isAdmin: true,
      votedProjects: []
    },
    {
      firstName: 'Jason',
      lastName: '',
      email: 'jason@gmail.com',
      password: '1234',
      isAdmin: false,
      votedProjects: []
    },
    {
      firstName: 'Jason',
      lastName: '',
      email: 'jason+admin@gmail.com',
      password: '1234',
      isAdmin: true,
      votedProjects: []
    }
  ];

  for (var i = 0; i < users.length; i++) {
    users[i] = new User(users[i]);
    seedUser(users[i]);
  }
}


function seedUser(user) {
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('seeded: ' + user.email);
    }
  });
}

User.remove({}, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Removed all users...');
    seedUsers();
  }
});


