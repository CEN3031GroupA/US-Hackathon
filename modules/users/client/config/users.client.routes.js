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
      .state('user.view', {
        url: '/:userId',
        templateUrl: 'modules/users/client/views/view-user.client.view.html'
      })
      .state('user.splash', {
        url: '/welcome',
        templateUrl: 'modules/users/client/views/welcomescreens/splash.client.view.html'
      })
      .state('user.welcome', {
        url: '/welcome',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome.client.view.html'
      })
      .state('user.welcome1', {
        url: '/welcome1',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome1.client.view.html'
      })
      .state('user.welcome2', {
        url: '/welcome',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome2.client.view.html'
      });
  }
]);
