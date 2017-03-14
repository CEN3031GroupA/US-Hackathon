'use strict';

// Setting up route
angular.module('eventCategories').config(['$stateProvider',
  function ($stateProvider) {
    // Event Categories state routing
    $stateProvider
      .state('eventCategories', {
        abstract: true,
        url: '/admin/eventCategories',
        template: '<ui-view/>'
      })
      .state('eventCategories.index', {
        url: '',
        templateUrl: 'modules/eventCategories/client/views/list.client.view.html'
      })
      .state('eventCategories.create', {
        url: '/create',
        templateUrl: 'modules/eventCategories/client/views/create.client.view.html'
      })
      .state('eventCategories.edit', {
        url: '/:eventCategoryId/edit',
        templateUrl: 'modules/eventCategories/client/views/edit.client.view.html',
      });
  }
]);
