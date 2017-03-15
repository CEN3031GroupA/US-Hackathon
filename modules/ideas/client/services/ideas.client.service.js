'use strict';

angular.module('ideas').factory('Ideas', ['$resource',
  function ($resource) {
    return $resource('api/ideas/:ideaId', {
      ideaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);
