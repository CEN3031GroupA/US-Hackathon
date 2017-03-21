'use strict';

// Setting up route
angular.module('events').config(['$stateProvider',
  function ($stateProvider) {
    // Events state routing
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/admin/events',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('events.index', {
        url: '',
        templateUrl: 'modules/events/client/views/list.client.view.html'
      })
      .state('events.create', {
        url: '/create',
        templateUrl: 'modules/events/client/views/create.client.view.html'
      })
      .state('events.edit', {
        url: '/:eventId/edit',
        templateUrl: 'modules/events/client/views/edit.client.view.html'
      });
  }
]);
