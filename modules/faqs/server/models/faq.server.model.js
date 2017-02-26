'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Project Schema
 */
var FAQSchema = new Schema({
  created_at: Date,
  updated_at: Date,
  question: {
    type: String,
    default: '',
    required: 'Title cannot be blank'
  },
  project: {
    type: String
  },
  event: {
    type: String
  },
  answers: [
    {type: String, ref: 'FAQ'}
  ],
  solved: {
    type: Boolean
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
FAQSchema.pre('save', function(next) {
    var currentDate = new Date();

    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var FAQ = mongoose.model('FAQ', FAQSchema);
module.exports = FAQ;

