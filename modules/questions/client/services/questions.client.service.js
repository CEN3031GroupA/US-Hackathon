// Questions service used to communicate Questions REST endpoints
(function () {
  'use strict';

  angular
    .module('questions')
    .factory('QuestionsService', QuestionsService);

  QuestionsService.$inject = ['$resource'];

  function QuestionsService($resource) {
    return $resource('api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
