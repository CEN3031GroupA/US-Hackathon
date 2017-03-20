'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  app.route('/api/auth/signin').post(users.signin);
  app.route('/logout').post(users.signout);

  app.route('/api/auth/').put(users.update);

  app.param('userId', users.userById);
};
