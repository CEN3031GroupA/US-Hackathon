'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$state', '$stateParams', '$location', 'Projects', '$rootScope',
  function ($scope, $state, $stateParams, $location, Projects, $rootScope) {
    if (!$rootScope.activeProject) {
      $rootScope.activeProject = {
        description: {}
      };
    }

    $scope.saveProjectInfo = function () {
      $rootScope.activeProject.title = this.title;
      $rootScope.activeProject.description.short = this.short;
      $rootScope.activeProject.description.long = this.long;

      $location.path('projects/category');
    };

    $scope.saveProjectCategory = function() {
      $rootScope.activeProject.category = "Selected Category"; // TODO: Give ability to select

      $location.path('projects/team');
    };

    $scope.create = function (isValid) {
      $scope.error = null;

      // Create new Project object
      var project = new Projects($rootScope.activeProject);

      // Redirect after save
      project.$save(function (response) {
        $location.path('projects/' + response._id);

        // Clear form fields
        $rootScope.activeProject = null;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          $location.path('projects');
        });
      }
    };

    // Update existing Project
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');

        return false;
      }

      var project = $scope.project;

      project.$update(function () {
        $location.path('projects/' + project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Projects
    $scope.find = function () {
      $scope.projects = Projects.query(function(projects) {
        shuffle(projects);

        $scope.projects = projects;
      });

    };

    // Find existing Project
    $scope.findOne = function () {
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      });
    };

    $scope.vote = function (project) {
      project.votes += 1;
      document.getElementById("voteButton").style.backgroundColor = '#63666A';
      document.getElementById("voteButton").innerHTML = "Voted!";
      document.getElementById("voteButton").style.color = '#FFFFFF';
      Projects.update({projectId: $stateParams.projectId},{votes: project.votes});
    };

    // Fake data for now
    $scope.users = [
      {
        name: 'Jim'
      },
      {
        name: 'Jimbo'
      },
      {
        name: 'Dabo'
      }
    ];

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

  }]);
