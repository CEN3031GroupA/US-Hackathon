'use strict';

/**
 * Module dependencies.
 */
var events = require('../controllers/events.server.controller');

module.exports = function(app) {

  app.route('/api/admin/events')
    .post(events.create)
    .get(events.list);

  app.route('/api/admin/events/:eventId')
    .get(events.read)
    .put(events.update)
    .delete(events.delete);

  app.param('eventId', events.eventById);
};
