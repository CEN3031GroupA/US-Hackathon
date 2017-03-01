'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  EventCategory = require('mongoose').model('EventCategory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var eventCategory = new EventCategory(req.body);
  eventCategory.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(eventCategory);
    }
  });
};

exports.list = function(req, res) {
  EventCategory.find({}, function(err, data) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(data);
    }
  });
};

exports.delete = function(req, res, next) {
  req.project.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(req.project);
    }
  });
};

exports.eventCategoryById = function(req, res, next, id) {
  EventCategory.findOne({
      _id: id
    },
    function(err, eventCategory) {
      if (err) {
        return next(err);
      }
      else {
        req.eventCategory = eventCategory;
        next();
      }
    }
  );
};

exports.update = function (req, res) {
  var eventCategory = req.eventCategory;

  eventCategory.title = req.body.title;
  eventCategory.description = req.body.description;

  eventCategory.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventCategory);
    }
  });
};

exports.read = function (req, res) {
  res.json(req.eventCategory);
};