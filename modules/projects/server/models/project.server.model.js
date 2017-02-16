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
  created: {
    type: Date,
    default: Date.now
  },
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
  }
});

var Project = mongoose.model('Project', ProjectSchema);