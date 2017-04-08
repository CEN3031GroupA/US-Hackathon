'use strict';

angular.module('events')
  .factory('HackathonEvent', ['$resource',
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
      }, {
        latest: {
          method: 'POST'
        }
      });
    }
  ])
  .service('ActiveEvent', ['$http',
    function ($http) {
      this.get = function () {
        return $http.get('/api/events/latest').then(function(response) {
          return response.data;
        });
      };
    }
  ]);
