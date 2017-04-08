/**
 * Created by George on 2/26/2017.
 */
'use strict';

/**
 * Module dependencies.
 */
var faqs = require('../controllers/faqs.server.controller');

module.exports = function(app) {
  app.route('/api/faqs')
     .get(faqs.list)
     .post(faqs.create);

  app.route('/api/faqs/:faqId')
    .get(faqs.read)
    .put(faqs.update)
    .delete(faqs.delete);

  app.route('/api/faqs/:faqId/addAnswer')
    .post(faqs.addAnswer);

  app.param('faqId', faqs.faqById);
};

