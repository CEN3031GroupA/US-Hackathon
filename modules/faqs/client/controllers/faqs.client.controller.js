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
        question: this.question
      });
    //th
    };

        // // Remove existing Project
        // $scope.remove = function (project) {
        //     if (project) {
        //         project.$remove();
        //
        //         for (var i in $scope.projects) {
        //             if ($scope.projects[i] === project) {
        //                 $scope.projects.splice(i, 1);
        //             }
        //         }
        //     } else {
        //         $scope.project.$remove(function () {
        //             $location.path('projects');
        //         });
        //     }
        // };

        // // Update existing Project
        // $scope.update = function (isValid) {
        //     $scope.error = null;
        //
        //     if (!isValid) {
        //         $scope.$broadcast('show-errors-check-validity', 'projectForm');
        //
        //         return false;
        //     }
        //
        //     $scope.project.$update(function () {
        //         $location.path('projects/' + $scope.project._id);
        //     }, function (errorResponse) {
        //         $scope.error = errorResponse.data.message;
        //     });
        // };
        //
        // // Find a list of Projects
        // $scope.find = function () {
        //     $scope.projects = Projects.query(function(projects) {
        //         shuffle(projects);
        //
        //         $scope.projects = projects;
        //     });
        //
        // };
  }]);
