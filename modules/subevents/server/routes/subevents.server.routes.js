'use strict';

/**
 * Module dependencies.
 */
var subevents = require('../controllers/subevents.server.controller');
var events = require('../../../events/server/controllers/events.server.controller');

module.exports = function(app) {

  app.route('/api/admin/events/:eventId/subevents')
    .post(subevents.create)
    .get(subevents.list);

  app.route('/api/admin/events/:eventId/subevents/:subeventId')
    .get(subevents.read)
    .put(subevents.update)
    .delete(subevents.delete);

  app.param('eventId', events.eventById);
  app.param('subeventId', subevents.subeventById);
};
