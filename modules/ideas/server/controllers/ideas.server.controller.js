<<<<<<< HEAD
'use strict';

var path = require('path'),
mongoose = require('mongoose'),
Idea = require('mongoose').model('Idea'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var idea = new Idea(req.body);
  idea.save(function (err) {
    console.log(req.body);
    console.log(err);
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
  },
  function(err, idea) {
    if (err) {
      return next(err);
    }
    else {
      req.idea = idea;
      next();
    }
  }
);
};

exports.update = function (req, res) {
  req.idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(req.idea);
    }
  });
};
=======
'use strict';

var path = require('path'),
mongoose = require('mongoose'),
Idea = require('mongoose').model('Idea'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res, next) {
  var idea = new Idea(req.body);
  idea.save(function (err) {
    console.log(req.body);
    console.log(err);
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
  },
  function(err, idea) {
    if (err) {
      return next(err);
    }
    else {
      req.idea = idea;
      next();
    }
  }
);
};

exports.update = function (req, res) {
  req.idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(req.idea);
    }
  });
};
>>>>>>> 55dd456882f5558d2e99b5c5df4d1bdeb5862474
