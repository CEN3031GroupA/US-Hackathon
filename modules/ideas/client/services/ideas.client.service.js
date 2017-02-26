<<<<<<< HEAD
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
=======
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
>>>>>>> 55dd456882f5558d2e99b5c5df4d1bdeb5862474
