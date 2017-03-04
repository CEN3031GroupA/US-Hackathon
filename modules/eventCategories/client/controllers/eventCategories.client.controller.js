'use strict';

// Projects controller
angular.module('eventCategories').controller('EventCategoriesController', ['$scope', '$state', '$stateParams', '$location', 'EventCategory',
  function ($scope, $state, $stateParams, $location, EventCategory) {
    $scope.create = function() {
      var i;
      var questions = [];
      for (i = 0; i < $scope.questions.length; i++) {
        questions.push($scope.questions[i].content);
      }

      var eventCategory = new EventCategory({
        title: this.title,
        description: this.description,
        questions: questions
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

      var questions = [];
      var i;
      for (i = 0; i < $scope.questions.length; i++) {
        questions.push($scope.questions[i].content);
      }

      eventCategory.questions = questions;

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
      EventCategory.get({
        eventCategoryId: $stateParams.eventCategoryId
      }, function(eventCategory) {
        $scope.eventCategory = eventCategory;

        var i;
        $scope.questions = [];
        for (i = 0; i < $scope.eventCategory.questions.length; i++) {
          $scope.questions.push({
            num: i + 1,
            content: $scope.eventCategory.questions[i]
          });
        }
      });
    };

    $scope.remove = function (eventCategory) {
      if (eventCategory) {
        eventCategory.$remove();

        for (var i in $scope.articles) {
          if ($scope.eventCategories[i] === eventCategory) {
            $scope.eventCategories.splice(i, 1);
          }
        }

        $location.path('admin/eventCategories');
      } else {
        $scope.eventCategory.$remove(function () {
          $location.path('admin/eventCategories');
        });
      }
    };

    $scope.deleteQuestion = function (questionIndex) {
      // TODO UPDATE QUESTION.NUM
      var questions = [];
      var i;
      for (i = 0; i < $scope.questions.length; i++) {
        if (i !== questionIndex - 1) {
          questions.push($scope.questions[i]);
        }
      }

      $scope.questions = questions;
    };

    $scope.initCreate = function() {
      $scope.questions = [
        {
          num: 1,
          content: ''
        }
      ];
    };

    $scope.addQuestion = function () {
      $scope.questions.push({
        num: $scope.questions.length + 1,
        content: ''
      });
    };

  }]);
