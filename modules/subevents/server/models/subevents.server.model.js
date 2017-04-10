'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * SubEventSchema Schema
 */
var SubEventSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: String,
  location: String,
  event: {
    type: Schema.ObjectId,
    ref: 'HackathonEvent'
  },
  datetime: Date
});

var SubEvent = mongoose.model('SubEvent', SubEventSchema);
module.exports = SubEvent;

