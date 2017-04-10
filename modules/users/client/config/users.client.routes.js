'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('user', {
        abstract: true,
        url: '/user',
        template: '<ui-view/>'
      })
      .state('signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/signin.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome', {
        url: '/welcome',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome1', {
        url: '/welcome2',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome1.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome2', {
        url: '/welcome3',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome2.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.view', {
        url: '/:userId',
        templateUrl: 'modules/users/client/views/view-user.client.view.html'
      });
  }
]);
