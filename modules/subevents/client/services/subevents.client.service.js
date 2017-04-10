'use strict';

angular.module('events')
  .factory('SubEvent', ['$resource',
    function ($resource) {
      return $resource('api/admin/events/:eventId/subevents/:subeventId', {
        eventId: '@_id',
        subeventId: '@_id'
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
