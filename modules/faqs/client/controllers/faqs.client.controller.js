/**
 * Created by George on 2/26/2017.
 */
'use strict';

// Projects controller
angular.module('faqs').controller('FAQsController', ['$scope', '$state', '$stateParams', '$location', 'FAQs',
  function ($scope, $state, $stateParams, $location, FAQs, $window) {

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
        $scope.faqs.push(response);
        $scope.askme=false;

      }, function (errorResponse){
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of faqs
    $scope.find = function () {
      $scope.faqs = FAQs.query();
    };
    // Find a faq
    $scope.findOne = function () {
      $scope.faq = FAQs.get({
        faqId: $stateParams.faqId
      });
    };
      // Remove existing Project
    $scope.remove = function (faq) {
      if (faq) {
        faq.$remove();

        for (var i in $scope.faqs) {
          if ($scope.faqs[i] === faq) {
            $scope.faqs.splice(i, 1);
          }
        }
      } else {
        $scope.faq.$remove(function () {
          $location.path('faqs');
        });
      }
    };

    // Update existing faq
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'faqForm');

        return false;
      }

      $scope.faq.$update(function () {
        $location.path('faqs/');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }]);
