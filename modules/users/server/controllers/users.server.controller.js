'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  User.findOne({
    email: req.body.email
  }).exec(
    function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        res.status(400).send({
          message: 'Email not found'
        });
      } else if (!user.authenticate(req.body.password)) {
        res.status(400).send({
          message: 'Bad password'
        });
      } else {
        req.session.user = user;
        res.json(user);
      }
    }
  );
};

/**
 * Signout
 */
exports.signout = function (req, res, next) {
  req.session.user = '';
  res.end();
};

exports.read = function(req, res) {
  res.json(req.user);
};

exports.update = function (req, res) {
  var user = req.user;

  user.votedProjects = req.body.votedProjects;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(user);
    }
  });
};

exports.userById = function(req, res, next, id) {
  User.findOne({
      _id: id
    },
    function(err, user) {
      if (err) {
        return next(err);
      }
      else {
        req.user = user;
        next();
      }
    }
  );
};




