'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/signin.client.view.html',
        data: {
          allowAnon: true,
        }
      });
  }
]);
