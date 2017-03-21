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
