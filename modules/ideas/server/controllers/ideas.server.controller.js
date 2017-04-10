'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Idea = mongoose.model('Idea'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var idea = new Idea(req.body);
  idea.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(idea);
    }
  });
};

exports.list = function(req, res) {
  Idea.find({}, function(err, data) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(data);
    }
  });
};

exports.delete = function(req, res, next) {
  req.idea.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(req.idea);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.idea);
};

exports.ideaById = function(req, res, next, id) {
  Idea.findOne({
    _id: id
  }).populate(['owner', 'team', 'comments.user']).exec(
  function(err, idea) {
    if (err) {
      return next(err);
    }
    else {
      req.idea = idea;
      next();
    }
  });
};

exports.update = function (req, res) {
  var idea = req.idea;

  idea.title = req.body.title;
  idea.youtube = req.body.youtube;
  idea.description.short = req.body.description.short;
  idea.description.long = req.body.description.long;

  idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(idea);
    }
  });
};

exports.addComment = function(req, res) {
  var idea = req.idea;

  idea.comments.push({
    user: req.session.user,
    posted: new Date(),
    content: req.body.content
  });

  idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json(idea);
    }
  });
};