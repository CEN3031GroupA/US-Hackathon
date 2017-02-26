<<<<<<< HEAD
'use strict';

var ideas = require('../controllers/ideas.server.controller');

module.exports = function(app) {

  app.route('/api/ideas')
    .post(ideas.create)
    .get(ideas.list);

  app.route('/api/ideas/:ideaId')
    .get(ideas.read)
    .put(ideas.update)
    .delete(ideas.delete);

  app.param('ideaId', ideas.ideaById);
};
=======
'use strict';

var ideas = require('../controllers/ideas.server.controller');

module.exports = function(app) {

  app.route('/api/ideas')
    .post(ideas.create)
    .get(ideas.list);

  app.route('/api/ideas/:ideaId')
    .get(ideas.read)
    .put(ideas.update)
    .delete(ideas.delete);

  app.param('ideaId', ideas.ideaById);
};
>>>>>>> 55dd456882f5558d2e99b5c5df4d1bdeb5862474
