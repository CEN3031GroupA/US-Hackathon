'use strict';

// Projects controller
angular.module('subevents').controller('SubEventsController',
  ['$scope', '$state', '$stateParams', '$location', 'SubEvent', 'HackathonEvent', 'ActiveEvent',
  function ($scope, $state, $stateParams, $location, SubEvent, HackathonEvent, ActiveEvent) {
    $scope.loadEvent = function(cb) {
      if ($stateParams.eventId) {
        HackathonEvent.get({ eventId: $stateParams.eventId }, function(event) {
          $scope.event = event;

          if (cb) {
            cb(event);
          }
        });
      } else {
        $scope.event = ActiveEvent.get().then(function(event) {
          $scope.event = event;

          if (cb) {
            cb(event);
          }
        });
      }
    };

    $scope.loadEvent();


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
        $location.path('admin/events');

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.location = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function () {
      var querySubevents = function (event) {
        $scope.subevents = SubEvent.query({ eventId: event._id });
      };

      $scope.loadEvent(querySubevents);
    };

    $scope.findOne = function () {
      var querySubevent = function (event) {
        $scope.subevent = SubEvent.get({
          eventId: event._id,
          subeventId: $stateParams.subeventId
        });
      };

      $scope.loadEvent(querySubevent);
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
