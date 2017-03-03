/**
 * Created by George on 2/26/2017.
 */
'use strict';

// Projects controller
angular.module('faqs').controller('FAQsController', ['$scope', '$state', '$stateParams', '$location', 'FAQs',
  function ($scope, $state, $stateParams, $location, FAQs) {

    $scope.create = function (isValid) {
      $scope.error = null;

    // Create new FAQ object
      var faq = new FAQs({
        question: this.question,
        // project: this.project,
        // event: this.event,
        // answers: null,
        // solution: this.solution,
        // solved: false,
        // user: this.user
      });

    };
    // Find a list of Projects
    $scope.find = function () {
      $scope.faqs = FAQs.query();
    };
  }]);
