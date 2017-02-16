'use strict';

angular.module('projects').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('/api/projects/:projectId', { projectId: '@_id'},
    {
      query: { method: 'GET', isArray: true },
      create: { method: 'POST'},
      get: { method: 'GET'},
      remove: { method: 'DELETE'},
      update: { method: 'PUT'}
  });
}]);

