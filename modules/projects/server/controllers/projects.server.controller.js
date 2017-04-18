'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  User = mongoose.model('User'),
  eventCtrl = require(path.resolve('./modules/events/server/controllers/events.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var project = new Project(req.body);
  project.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(project);
    }
  });
};

exports.list = function(req, res) {
  var onError = function(err) {
    res.status(400).send(err);
  };
  var findProjects = function(event) {
    Project.find({
      event: event._id
    }).populate(['owner', 'team', 'event']).exec({}, function(err, data) {
      if (err) {
        onError(err);
      }
      else {
        res.json(data);
      }
    });
  };

  eventCtrl.getActiveEvent(findProjects, onError);
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

exports.read = function(req, res) {
  res.json(req.project);
};

exports.projectById = function(req, res, next, id) {
  Project.findOne({
    _id: id
  }).populate(['owner', 'team', 'comments.user']).exec(
  function(err, project) {
    if (err) {
      return next(err);
    }
    else {
      req.project = project;
      next();
    }
  });
};

exports.vote = function (req, res) {
  var project = req.project;
  var user = req.session.user;

  User.findOne({
    _id: user._id
  },function(err, user) {
    user.votedProjects.push(project._id);
    project.votes++;

    project.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        user.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.session.user = user;
            res.json(project);
          }
        });
      }
    });
  });
};

exports.unvote = function (req, res) {
  var project = req.project;
  var user = req.session.user;

  for (var i in user.votedProjects) {
    if (user.votedProjects[i] == project._id) {
      user.votedProjects.splice(i, 1);
    }
  }

  User.findOne({
    _id: user._id
  },function(err, data) {
    data.votedProjects = user.votedProjects;
    project.votes--;

    project.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        data.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.session.user = user;
            res.json(project);
          }
        });
      }
    });
  });
};

exports.update = function (req, res) {
  var project = req.project;

  project.title = req.body.title;
  project.youtube = req.body.youtube;
  project.description.short = req.body.description.short;
  project.description.long = req.body.description.long;

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

exports.addComment = function(req, res) {
  var project = req.project;

  project.comments.push({
    user: req.session.user,
    posted: new Date(),
    content: req.body.content
  });

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json(project);
    }
  });
};

