'use strict';

// Projects controller
angular.module('subevents').controller('SubEventsController',
  ['$scope', '$state', '$stateParams', '$location', 'SubEvent', 'HackathonEvent',
  function ($scope, $state, $stateParams, $location, SubEvent, HackathonEvent) {
    $scope.event = HackathonEvent.get({ eventId: $stateParams.eventId });

    $scope.create = function() {
      var subevent = new SubEvent({
        title: this.title,
        description: this.description,
        location: this.location,
        datetime: this.datetime,
        event: $scope.event
      });

      // Redirect after save
      subevent.$save({ eventId: $scope.event._id }, function (response) {
        $location.path('admin/events/' + $scope.event._id + '/subevents');

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.location = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function () {
      $scope.subevents = SubEvent.query({ eventId: $stateParams.eventId });
    };

    $scope.findOne = function () {
      $scope.subevent = SubEvent.get({
        eventId: $stateParams.eventId,
        subeventId: $stateParams.subeventId
      });
    };

    $scope.update = function () {
      $scope.subevent.$update(function () {
        $location.path('admin/events/' + $scope.event._id + '/subevents');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function (subevent) {
      if (subevent) {
        subevent.$remove();

        $location.path('admin/events/' + $scope.event._id + '/subevents');
      } else {
        $scope.subevent.$remove(function () {
          $location.path('admin/events/' + $scope.event._id + '/subevents');
        });
      }
    };

  }]);
