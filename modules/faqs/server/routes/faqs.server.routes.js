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
        .post(faqs.create)
        .get(faqs.list);

    app.route('/api/faqs/:projectId')
        .get(faqs.read)
        .put(faqs.update)
        .delete(faqs.delete);

    app.param('faqId', faqs.faqsById);
};

