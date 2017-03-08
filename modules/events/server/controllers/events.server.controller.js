'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Event = require('mongoose').model('Event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var event = new Event(req.body);
  event.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(event);
    }
  });
};

exports.list = function(req, res) {
  Event.find({}, function(err, data) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(data);
    }
  });
};

exports.delete = function(req, res, next) {
  req.event.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(req.event);
    }
  });
};

exports.eventById = function(req, res, next, id) {
  Event.findOne({
    _id: id
  },
    function(err, event) {
      if (err) {
        return next(err);
      }
      else {
        req.event = event;
        next();
      }
    }
  );
};

exports.update = function (req, res) {
  var event = req.event;

  event.title = req.body.title;

  event.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(event);
    }
  });
};

exports.read = function (req, res) {
  res.json(req.event);
};