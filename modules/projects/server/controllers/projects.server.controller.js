'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


// Reference modules/articles/server for examples on what can go here
exports.create = function(req, res) {
  var project = new Project(req.body);


    exports.create = function (req, res) {
        var project = new Project(req.body);
        project.user = req.user;

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
};
