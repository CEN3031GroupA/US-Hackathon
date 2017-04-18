'use strict';

// Projects controller
angular.module('subevents').controller('SubEventsController',
  ['$scope', '$state', '$stateParams', '$location', 'SubEvent', 'HackathonEvent', 'ActiveEvent', '$interval',
  function ($scope, $state, $stateParams, $location, SubEvent, HackathonEvent, ActiveEvent, $interval) {
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
        $scope.activeEvent = event;

        $scope.calcEventTime();
        $interval($scope.calcEventTime, 1000);
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

    $scope.calcEventTime = function() {
      var now = new Date();
      var timeLeft, timeTill;
      var days, hours, minutes, seconds;
      var startDate = new Date($scope.activeEvent.start);
      var endDate = new Date($scope.activeEvent.end);

      if (startDate < now) {
        $scope.activeEvent.inProgress = true;
        timeLeft = parseInt((endDate - now) / 1000); // Time left in seconds
        hours = parseInt(timeLeft / (60*60));
        minutes = parseInt((timeLeft - hours * 60 * 60) / 60);
        seconds = timeLeft - hours * 60 * 60 - minutes * 60;
        $scope.activeEvent.timer = hours + ':' + minutes + ':' + seconds;
      } else {
        $scope.activeEvent.inProgress = false;
        timeTill = parseInt((startDate - now) / 1000); // Time till in seconds
        days = parseInt(timeTill / (24 * 60 * 60));
        hours = parseInt((timeTill - days * 24 * 60 * 60) / 60 / 60);
        minutes = parseInt((timeTill - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
        $scope.activeEvent.timer = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes';
      }
    };

  }]);
