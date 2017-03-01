'use strict';

// Projects controller
angular.module('eventCategories').controller('EventCategoriesController', ['$scope', '$state', '$stateParams', '$location', 'EventCategory',
  function ($scope, $state, $stateParams, $location, EventCategory) {
    $scope.create = function() {
      var eventCategory = new EventCategory({
        title: this.title,
        description: this.description
      });

      // Redirect after save
      eventCategory.$save(function (response) {
        $location.path('admin/eventCategories');

        // Clear form fields
        $scope.title = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var eventCategory = $scope.eventCategory;

      eventCategory.$update(function () {
        $location.path('admin/eventCategories');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.eventCategories = EventCategory.query();
    };

    $scope.findOne = function () {
      $scope.eventCategory = EventCategory.get({
        eventCategoryId: $stateParams.eventCategoryId
      });
    };
  }]);
