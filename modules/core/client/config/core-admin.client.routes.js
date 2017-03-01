'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
      })
      .state('admin.index', {
        url: '',
        templateUrl: 'modules/core/client/views/admin/index.client.view.html'
      });
  }
]);
