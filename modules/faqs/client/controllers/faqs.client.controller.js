/**
 * Created by George on 2/26/2017.
 */
'use strict';

// Projects controller
angular.module('faqs').controller('FAQsController', ['$scope', '$state', '$stateParams', '$location', 'FAQs',
  function ($scope, $state, $stateParams, $location, FAQs) {

    $scope.post = function (isValid) {
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
      // Redirect
      faq.$save(function (response) {
        $location.path('faqs');

      }, function (errorResponse){
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Projects
    $scope.find = function () {
      $scope.faqs = FAQs.query();
    };
    // Find a faq
    $scope.findOne = function () {
      $scope.faq = FAQs.get({
        faqId: $stateParams.faqId
      });
    };
  }]);
