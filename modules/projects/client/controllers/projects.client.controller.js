'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$state', '$stateParams', '$location', 'Projects',
  function ($scope, $state, $stateParams, $location, Projects) {
      //TODO $scope.findTeamMembers
      //   $scope.find = function() {
      //   /* set loader*/
      //   $scope.loading = true;
      //
      //   /* Get all the Users, then bind it to the scope */
      //   Users.getAll().then(function(response) {
      //       $scope.loading = false; //remove loader
      //       // TODO is projects working?
      //       $scope.projects = response.data;
      //   }, function(error) {
      //       $scope.loading = false;
      //       $scope.error = 'Unable to retrieve listings!\n' + error;
      //   });
      // };
    $scope.create = function (isValid) {
      $scope.error = null;

          /*
           Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
           */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }

          /* Create the listing object */
      var project = {
        title: $scope.title,
        details: $scope.details,
        category: null
      };

          /* Save the project using the Projects factory  */
      Projects.create(project)
          .then(function (response) {
                  //if the object is successfully saved redirect back to the list page
            $state.go('projects.category', { successMessage: 'Project succesfully created!' });
          }, function (error) {
                  //otherwise display the error
            $scope.error = 'Unable to create project!\n' + error;
          });

    };
    $scope.category = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }
      Projects.category($scope.project.title, $scope.project)
        .then(function (response) {
          $state.go('projects.team', { successMessage: 'Project category set' });
        }, function (error) {
          $scope.error = 'Unable to add category\n' + error;
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

    // Fake data for now
    $scope.users = [
      {
        name: "Jim"
      },
      {
        name: "Jimbo"
      },
      {
        name: "Dabo"
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
