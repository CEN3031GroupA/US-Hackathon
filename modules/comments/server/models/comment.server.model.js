'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 * This version of a comment is temporary in case imbedding comments is not desired
 * This code can be deleted if the other comment soultion in project and ideas
 * is valid.
 */
var CommentSchema = new Schema({
  posted:    {
    type: Date, default: Date.now
  },
  content:   {
    type: String, default: '', trim: true
  },
  user:      {
    type: Schema.ObjectId, ref: 'User'
  }
});

mongoose.model('Comment', CommentSchema);
