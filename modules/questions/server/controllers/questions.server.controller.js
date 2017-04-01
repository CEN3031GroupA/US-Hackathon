'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Question
 */
exports.create = function(req, res) {
  var question = new Question(req.body);
  question.user = req.user;

  question.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * Show the current Question
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var question = req.question ? req.question.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  question.isCurrentUserOwner = req.user && question.user && question.user._id.toString() === req.user._id.toString();

  res.jsonp(question);
};

/**
 * Update a Question
 */
exports.update = function(req, res) {
  var question = req.question;

  question = _.extend(question, req.body);

  question.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * Delete an Question
 */
exports.delete = function(req, res) {
  var question = req.question;

  question.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * List of Questions
 */
exports.list = function(req, res) {
  Question.find().sort('-created').populate('user', 'displayName').exec(function(err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questions);
    }
  });
};

/**
 * Question middleware
 */
exports.questionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Question is invalid'
    });
  }

  Question.findById(id).populate('user', 'displayName').exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No Question with that identifier has been found'
      });
    }
    req.question = question;
    next();
  });
};
