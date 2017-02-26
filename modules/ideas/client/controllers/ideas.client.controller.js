'use strict';


angular.module('ideas').controller('IdeasController', ['$scope', '$state', '$stateParams', '$location', 'Ideas', '$rootScope',
  function ($scope, $state, $stateParams, $location, Ideas, $rootScope) {
    if (!$rootScope.activeIdea) {
      $rootScope.activeIdea = {
        description: {}
      };
    }

    $scope.saveIdeaInfo = function () {
      $rootScope.activeIdea.title = this.title;
      $rootScope.activeIdea.description.long = this.details;

      $location.path('ideas/success');
    };

    $scope.create = function (isValid) {
      $scope.error = null;

      var idea = new Ideas($rootScope.activeIdea);


      idea.$save(function (response) {
        $location.path('ideas/' + response._id);


        $rootScope.activeIdea = null;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
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

    $scope.find = function () {
      $scope.ideas = Ideas.query(function(ideas) {
        shuffle(ideas);

        $scope.ideas = ideas;
      });
    };

    $scope.findOne = function () {
      $scope.idea = Ideas.get({
        ideaId: $stateParams.ideaId
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
