/**
 * Created by George on 2/26/2017.
 */

'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  FAQ = require('mongoose').model('FAQ'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
exports.create = function(req, res, next) {
  var faq = new FAQ(req.body);
  faq.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(faq);
    }
  });
};

exports.list = function(req, res) {
  FAQ.find({}, function(err, data) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.json(data);
    }
  });
};

exports.addAnswer = function(req,res,next){
  var faq = req.faq;

  console.log(req.session.user);
  faq.answers.push({
    date: new Date(),
    user: req.session.user,
    answer: req.body.answer,
    isSolution: false
  });

  faq.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(faq);
    }
  });
};

exports.deleteFaq = function(req, res, next) {
  req.faq.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(req.faq);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.faq);
};

exports.faqById = function(req, res, next, id) {
  FAQ.findOne({
    _id: id
  }).populate(['answers.user','user']).exec(
  function(err, faq) {
    if (err) {
      return next(err);
    }
    else {
      req.faq = faq;
      next();
    }
  });
};

exports.markBestSolution = function (req, res) {
  var faq = req.faq;
  var oldIndex = faq.oldIndex;
  console.log(req.session.user);
  faq.answers[index].isSolution = true;
  faq.answers[oldIndex].isSolution = false;

  faq.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json(faq);
    }
  });
};
