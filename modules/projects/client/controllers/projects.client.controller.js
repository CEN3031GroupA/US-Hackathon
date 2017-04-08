'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$state', '$stateParams', '$location', 'Projects', 'Authentication', 'Users','$rootScope', '$http',
  function ($scope, $state, $stateParams, $location, Projects, Authentication, Users, $rootScope, $http) {
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;

    if (!$rootScope.activeProject) {
      $rootScope.activeProject = {
        description: {}
      };
    }

    // TODO: We'll need to populate this dynamically later
    $scope.categories = [
      {
        id: 0,
        title: 'Category 1',
        description: 'Hey there, this is the category description...'
      },
      {
        id: 1,
        title: 'Category 2',
        description: 'Hi there, this is the category description...'
      },
      {
        id: 2,
        title: 'Category 3',
        description: 'Hello there, this is the category description...'
      }
    ];

    $scope.activeCategory = $scope.categories[0];

    $scope.saveProjectInfo = function () {
      $rootScope.activeProject.title = this.title;
      $rootScope.activeProject.description.short = this.short;
      $rootScope.activeProject.description.long = this.long;

      $location.path('projects/category');
    };

    $scope.setActiveCategory = function (category) {
      $scope.activeCategory = category;
    };

    $scope.saveProjectCategory = function () {
      $rootScope.activeProject.category = $scope.activeCategory.title;

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

      $scope.project.$update(function () {
        $location.path('projects/' + $scope.project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Projects
    $scope.find = function () {
      $scope.projects = Projects.query(function (projects) {
        $scope.projects = projects;

        shuffle(projects);

        $scope.projects = projects;
      });
    };

    // Find existing Project
    $scope.findOne = function () {
      Projects.get({ projectId: $stateParams.projectId }, function(project) {
        $scope.project = project;
        console.log(project);
      });


      /* Initialize voting button */ //TODO: grab user information after signIn
      for(var i in $scope.user.votedProjects) {
        if ($scope.user.votedProjects[i] === $stateParams.projectId) {
          console.log('project has been voted!'); //TODO delete later
          $scope.hasVoted = true;
        }
      }
    };

    /* Initialize voting field */
    $scope.hasVoted = false;

    $scope.unvote = function (project) {
      for (var i in $scope.user.votedProjects) {
        if ($scope.user.votedProjects[i] === project._id) {
          $scope.user.votedProjects.splice(i, 1);
          project.votes -= 1;
          $scope.hasVoted = false;
        }
      }
      Projects.update({ projectId: $stateParams.projectId },{ votes: project.votes });
      Users.update({ userId: $scope.user._id }, { votedProjects: $scope.user.votedProjects });
    };

    $scope.vote = function (project) {
      $scope.user.votedProjects.push(project._id);
      project.votes += 1;
      $scope.hasVoted = true;

      Projects.update({ projectId: $stateParams.projectId },{ votes: project.votes });
      Users.update({ userId: $scope.user._id }, { votedProjects: $scope.user.votedProjects });
    };

    $scope.addComment = function() {
      var comment = this.comment;

      var req = {
        method: 'POST',
        url: '/api/projects/' + $scope.project._id + '/addComment',
        data: {
          content: comment
        }
      };

      this.comment = '';

      $http(req).then(function(response){
        $scope.project = response.data;
        console.log($scope.project);
      }, function(err){
        console.error(err);
      });
    };

    // Fake data for now
    $scope.teamusers = [
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
