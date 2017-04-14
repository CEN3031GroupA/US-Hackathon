'use strict';

// Ideas controller
angular.module('ideas')
  .service('sharedInputFields', [ '$rootScope', function($rootScope) {
    return {
      formData: [],
      add: function(item) {
        this.formData.push(item);
      },
      set: function() {
        return this.formData;
      },
      clear: function() {
        this.formData = [];
      }
    };

  }])
  .controller('IdeasController', ['sharedInputFields', '$scope', '$state', '$stateParams', '$location', 'Ideas', 'Authentication', 'Users', '$rootScope', 'ActiveEvent', '$http',
  function (sharedInputFields, $scope, $state, $stateParams, $location, Ideas, Authentication, Users, $rootScope, ActiveEvent, $http) {
    $scope.authentication = Authentication;
    $scope.user = $scope.owner = $scope.authentication.user;

    if (!$rootScope.activeIdea) {
      $rootScope.activeIdea = {
        description: {},
        owner: $scope.user,
        team: []
      };
    }

    ActiveEvent.get().then(function(activeEvent) {
      $scope.activeEvent = activeEvent;
      $scope.activeCategory = $scope.activeEvent.categories[0];
    });

    $scope.team = $rootScope.activeIdea.team;

    $scope.create = function (isValid) {
      $scope.error = null;

      $rootScope.activeIdea.event = $scope.activeEvent;
      // Create new Idea object
      $rootScope.activeIdea.title = this.title;
      $rootScope.activeIdea.youtube = this.youtube;
      $rootScope.activeIdea.description.short = this.short;
      $rootScope.activeIdea.description.long = this.long;

      var idea = new Ideas($rootScope.activeIdea);



      // Redirect after save
      idea.$save(function () {
        $location.path('ideas/success');

        // Clear form fields
        $rootScope.activeIdea = null;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.ideaToProject = function() {
      sharedInputFields.add($scope.idea.title);
      sharedInputFields.add($scope.idea.short);
      sharedInputFields.add($scope.idea.long);
      $scope.remove($scope.idea);


      $location.path('projects/category');
    };

    $scope.remove = function (idea) {
      if (idea) {
        idea.$remove();

        for (var i in $scope.ideas) {
          if ($scope.ideas[i] === idea) {
            $scope.ideas.splice(i,1);
          }
        }
      } else {
        $scope.idea.$remove(function () {
          $location.path('ideas');
        });
      }
    };

    // Update existing Idea

    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ideaForm');

        return false;
      }

      $scope.idea.$update(function () {
        $location.path('ideas/' + $scope.idea._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    // Find a list of Ideas

    $scope.find = function () {
      $scope.ideas = Ideas.query(function (ideas) {
        $scope.ideas = ideas;

        shuffle(ideas);

        $scope.ideas = ideas;
      });
    };

    $scope.findOne = function () {
      $scope.idea = Ideas.get({
        ideaId: $stateParams.ideaId
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
      $rootScope.activeIdea.team.push(user);

      for (var i = 0; i < $scope.users.length; i++) {
        if (user._id === $scope.users[i]._id) {
          $scope.users.splice(i, 1);
        }
      }
    };

    $scope.removeMember = function(user) {
      $scope.users.push(user);

      for (var i = 0; i < $rootScope.activeIdea.team.length; i++) {
        if (user._id === $rootScope.activeIdea.team[i]._id) {
          $rootScope.activeIdea.team.splice(i, 1);
        }
      }
    };

    $scope.addComment = function() {
      var comment = this.comment;

      var req = {
        method: 'POST',
        url: '/api/ideas/' + $scope.idea._id + '/addComment',
        data: {
          content: comment
        }
      };

      this.comment = '';

      $http(req).then(function (response) {
        $scope.idea = response.data;
      }, function (err) {
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
