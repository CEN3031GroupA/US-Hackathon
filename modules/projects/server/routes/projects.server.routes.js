'use strict';

/**
 * Module dependencies.
 */
var projects = require('../controllers/projects.server.controller');

module.exports = function(app) {

  app.route('/api/projects')
    .post(projects.create)
    .get(projects.list);

  app.route('/api/projects/:projectId')
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  app.route('/api/projects/:projectId/addComment')
    .post(projects.addComment);

  app.route('/api/projects/:projectId/vote')
    .put(projects.vote)
    .delete(projects.unvote);

  app.param('projectId', projects.projectById);
};
