'use strict';

angular.module('events').factory('HackathonEvent', ['$resource',
  function ($resource) {
    return $resource('api/admin/events/:eventId', {
      eventId: '@_id'
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
