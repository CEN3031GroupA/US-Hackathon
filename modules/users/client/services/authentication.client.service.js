'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };
    return auth;
  }
]);


angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/user/:userId', { userId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);


