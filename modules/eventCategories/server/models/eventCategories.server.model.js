'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * EventCategory Schema
 */
var EventCategorySchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: String,
  questions: [String]
});

var EventCategory = mongoose.model('EventCategory', EventCategorySchema);
module.exports = EventCategory;

