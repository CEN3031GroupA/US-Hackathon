'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * EventSchema Schema
 */
var EventSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: String,
  locations: String,
  categories: [{
    type: Schema.ObjectId,
    ref: 'EventCategory'
  }]
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;

