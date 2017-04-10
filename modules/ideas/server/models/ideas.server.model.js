'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Idea Schema
 */
var IdeaSchema = new Schema({
  created_at: Date,
  updated_at: Date,
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Needs a title'
  },
  event:{
    type: Schema.ObjectId,
    ref: 'HackathonEvent'
  },
  category: {
    type: String
  },
  youtube: {
    type: String,
    default: null
  },
  description: {
    short: String,
    long: String
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  team: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  votes: {
    type: Number,
    default: 0
  },
  liked: {
    type: Boolean,
    default: false
  },
  comments: [{
    posted: {
      type: Date, default: Date.now
    },
    user:    {
      type: Schema.ObjectId, ref: 'User'
    },
    content: {
      type: String, default: ''
    }
  }]
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
IdeaSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if(!this.created_at)
    this.created_at = currentDate;

  next();
});

var Idea = mongoose.model('Idea', IdeaSchema);
module.exports = Idea;

  /*
  seeding database to test out the listing view

  var ideas = require('../idealistings.json').ideas;
  for (var i=0; i < ideas.length; i++) {
    var item = Idea(ideas[i]);
    item.save(function(err) {
      if(err) throw err;
      console.log("Listing saved!");
    });
  }
*/
