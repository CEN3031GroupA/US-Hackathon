'use strict';

// Projects controller
angular.module('events').controller('EventsController', ['$scope', '$state', '$stateParams', '$location', 'Event',
  function ($scope, $state, $stateParams, $location, Event) {
    $scope.create = function() {
      var event = new Event({
        title: this.title
      });

      // Redirect after save
      event.$save(function (response) {
        $location.path('admin/events');

        // Clear form fields
        $scope.title = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var event = $scope.event;

      event.$update(function () {
        $location.path('admin/events');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.events = Event.query();
    };

    $scope.findOne = function () {
      Event.get({
        eventId: $stateParams.eventId
      }, function(event) {
        $scope.event = event;
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
