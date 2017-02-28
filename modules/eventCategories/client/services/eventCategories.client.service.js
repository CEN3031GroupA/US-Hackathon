'use strict';

angular.module('eventCategories').factory('EventCategory', ['$resource',
  function ($resource) {
    return $resource('api/admin/eventCategories/:eventCategoryId', {
      eventCategoryId: '@_id'
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
