'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  created_at: Date,
  updated_at: Date,
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  category: {
    type: String
  },
  description: {
    short: String,
    long: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  comments: [{
    posted: {type: Date, default: Date.now},
    user:    {type: Schema.ObjectId, ref: 'User'},
    content: {type: String, default: ''},
    replies: [{
      posted: {type: Date, default: Date.now},
      user:    {type: Schema.ObjectId, ref: 'User'},
      content: {type: String,default: ''}
    }]
  }]
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
ProjectSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;

