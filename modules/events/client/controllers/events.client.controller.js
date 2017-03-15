'use strict';

// Projects controller
angular.module('events').controller('EventsController',
  ['$scope', '$state', '$stateParams', '$location', 'HackathonEvent', 'EventCategory',
  function ($scope, $state, $stateParams, $location, HackathonEvent, EventCategory) {
    EventCategory.query(function(eventCategories) {
      $scope.eventCategories = eventCategories;
      $scope.eventCategoriesMap = {};

      for (var i = 0; i < $scope.eventCategories.length; i++) {
        $scope.eventCategoriesMap[i] = $scope.eventCategories[i];
      }

      $scope.resetSelectedCategories();
    });

    $scope.resetSelectedCategories = function() {
      $scope.selectedCategories = {};

      for (var i = 0; i < $scope.eventCategories.length; i++) {
        $scope.selectedCategories[i] = false;
      }
    };

    $scope.create = function() {
      var categories = [];

      for (var key in $scope.selectedCategories) {
        if (!$scope.selectedCategories.hasOwnProperty(key)) continue;
        if ($scope.selectedCategories[key] === false) continue;

        categories.push($scope.eventCategoriesMap[key]._id);
      }

      var event = new HackathonEvent({
        title: this.title,
        description: this.description,
        locations: this.locations,
        categories: categories,
        start: this.start,
        end: this.end
      });

      // Redirect after save
      event.$save(function (response) {
        $location.path('admin/events');

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.locations = '';
        $scope.categories = [];
        $scope.categories = null;
        $scope.categories = null;
        $scope.resetSelectedCategories();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var event = $scope.event;

      var categories = [];

      for (var key in $scope.selectedCategories) {
        if (!$scope.selectedCategories.hasOwnProperty(key)) continue;
        if ($scope.selectedCategories[key] === false) continue;

        categories.push($scope.eventCategoriesMap[key]._id);
      }

      event.categories = categories;

      $scope.resetSelectedCategories();
      event.$update(function () {
        $location.path('admin/events');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.events = HackathonEvent.query({

      });
    };

    $scope.findOne = function () {
      HackathonEvent.get({
        eventId: $stateParams.eventId
      }, function(event) {
        $scope.event = event;

        for (var i = 0; i < $scope.eventCategories.length; i++) {
          $scope.selectedCategories[i] = false;
          for (var j = 0; j < $scope.event.categories.length; j++) {
            if ($scope.eventCategories[i]._id === $scope.event.categories[j]._id) {
              $scope.selectedCategories[i] = true;
            }
          }
        }
      });
    };

    $scope.remove = function (event) {
      if (event) {
        event.$remove();

        $location.path('admin/events');
      } else {
        $scope.event.$remove(function () {
          $location.path('admin/events');
        });
      }
    };

  }]);
