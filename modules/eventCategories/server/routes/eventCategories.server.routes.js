'use strict';

/**
 * Module dependencies.
 */
var eventCategories = require('../controllers/eventCategories.server.controller');

module.exports = function(app) {

  app.route('/api/admin/eventCategories')
    .post(eventCategories.create)
    .get(eventCategories.list);

  app.route('/api/admin/eventCategories/:eventCategoryId')
    .get(eventCategories.read)
    .put(eventCategories.update)
    .delete(eventCategories.delete);

  app.param('eventCategoryId', eventCategories.eventCategoryById);
};
