'use strict';

// Projects controller
angular.module('projects')
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',                    // trust all resources from the same origin
      '*://www.youtube.com/**'   // trust all resources from `www.youtube.com`
    ]);
  })

  .controller('ProjectsController', ['$scope', '$state', '$stateParams', '$location', 'Projects', 'Authentication', 'Users','$rootScope', 'ActiveEvent', '$http',
  function ($scope, $state, $stateParams, $location, Projects, Authentication, Users, $rootScope, ActiveEvent, $http) {
    $scope.authentication = Authentication;
    $scope.user = $scope.owner = $scope.authentication.user;

    if (!$rootScope.activeProject) {
      $rootScope.activeProject = {
        description: {},
        owner: $scope.user,
        team: []
      };
    }

    ActiveEvent.get().then(function(activeEvent) {
      $scope.activeEvent = activeEvent;
      $scope.activeCategory = $scope.activeEvent.categories[0];
    });

    $scope.team = $rootScope.activeProject.team;

    $scope.saveProjectInfo = function () {
      $rootScope.activeProject.title = this.title;
      $rootScope.activeProject.youtube = this.youtube;
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

      $rootScope.activeProject.event = $scope.activeEvent;

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
      $scope.project = Projects.get({ projectId: $stateParams.projectId },function(project) {
        $scope.hasVoted = $scope.user.votedProjects.indexOf(project._id) !== -1;
      });
    };

    /* Initialize voting field */
    $scope.hasVoted = false;

    $scope.unvote = function (project) {
      $http.delete('/api/projects/' + project._id + '/vote')
        .success(function() {
          $scope.hasVoted = false;
        })
        .error(function () {
          console.log('data error');
        });
    };

    $scope.vote = function (project) {
      $http.put('/api/projects/' + project._id + '/vote')
        .success(function() {
          $scope.hasVoted = true;
        })
        .error(function () {
          console.log('data error');
        });
    };

    $scope.loadUsers = function() {
      $scope.users = Users.query(function (users) {
        $scope.users = users;

        // Remove owner from being able to be added
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.owner._id === $scope.users[i]._id) {
            $scope.users.splice(i, 1);
          }
        }
      });
    };

    $scope.addMember = function(user) {
      $rootScope.activeProject.team.push(user);

      for (var i = 0; i < $scope.users.length; i++) {
        if (user._id === $scope.users[i]._id) {
          $scope.users.splice(i, 1);
        }
      }
    };

    $scope.removeMember = function(user) {
      $scope.users.push(user);

      for (var i = 0; i < $rootScope.activeProject.team.length; i++) {
        if (user._id === $rootScope.activeProject.team[i]._id) {
          $rootScope.activeProject.team.splice(i, 1);
        }
      }
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
      }, function(err){
        console.error(err);
      });
    };

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
