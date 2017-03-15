'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  HackathonEvent = require('mongoose').model('HackathonEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var event = new HackathonEvent(req.body);
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
  HackathonEvent.find().populate('categories').exec({}, function(err, data) {
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
  }).populate('categories').exec(
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
  event.description = req.body.description;
  event.locations = req.body.locations;
  event.categories = req.body.categories;
  event.start = req.body.start;
  event.end = req.body.end;

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