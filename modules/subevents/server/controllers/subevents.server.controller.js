'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  SubEvent = require('mongoose').model('SubEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var subevent = new SubEvent(req.body);
  subevent.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(subevent);
    }
  });
};

exports.list = function(req, res) {
  SubEvent.find().sort('datetime').exec({}, function(err, data) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(data);
    }
  });
};

exports.delete = function(req, res, next) {
  req.subevent.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(req.subevent);
    }
  });
};

exports.subeventById = function(req, res, next, id) {
  SubEvent.findOne({
    _id: id
  }).populate('event').exec(
    function(err, subevent) {
      if (err) {
        return next(err);
      }
      else {
        req.subevent = subevent;
        next();
      }
    }
  );
};

exports.update = function (req, res) {
  var subevent = req.subevent;

  subevent.title = req.body.title;
  subevent.description = req.body.description;
  subevent.location = req.body.location;
  subevent.datetime = req.body.datetime;

  subevent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subevent);
    }
  });
};

exports.read = function (req, res) {
  res.json(req.subevent);
};