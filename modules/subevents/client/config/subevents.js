'use strict';

// Setting up route
angular.module('subevents').config(['$stateProvider',
  function ($stateProvider) {
    // SubEvents state routing
    $stateProvider
      .state('subevents', {
        abstract: true,
        url: '/admin/events/:eventId/subevents',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('subevents.index', {
        url: '',
        templateUrl: 'modules/subevents/client/views/list.client.view.html'
      })
      .state('subevents.create', {
        url: '/create',
        templateUrl: 'modules/subevents/client/views/create.client.view.html'
      })
      .state('subevents.edit', {
        url: '/:subeventId/edit',
        templateUrl: 'modules/subevents/client/views/edit.client.view.html'
      });
  }
]).config(['$stateProvider',
  function ($stateProvider) {
    // SubEvents state routing
    $stateProvider
      .state('schedule', {
        abstract: true,
        url: '/schedule',
        template: '<ui-view/>',
      })
      .state('schedule.index', {
        url: '',
        templateUrl: 'modules/subevents/client/views/schedule.client.view.html'
      })
      .state('schedule.view', {
        url: '/:subeventId/view',
        templateUrl: 'modules/subevents/client/views/view.client.view.html'
      });
  }
]);
