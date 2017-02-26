'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var IdeaSchema = new Schema({
  created_at: Date,
  updated_at: Date,
    title: {
      type: String,
      default: '',
      trim: true,
      required: 'Needs a title'
    },
    category: {
      type: String
    },
    description: {
      short: String,
      long: String
    },
    user: {
      /**
      * Need to make this an array of user's
      */
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

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
