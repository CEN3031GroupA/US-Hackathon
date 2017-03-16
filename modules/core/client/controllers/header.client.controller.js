'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', '$location', '$http',
  function ($scope, $state, Authentication, $location, $http) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = document.getElementById('side-menu');

    // Toggle the menu items
    $scope.isCollapsed = true;
    $scope.toggleCollapsibleMenu = function (forceClose) {
      $scope.isCollapsed = forceClose || !$scope.isCollapsed;

      if (!$scope.isCollapsed) {
        $scope.menu.style.left = '0px';
      } else {
        $scope.menu.style.left = '-200px';
      }
    };

    $scope.logout = function () {
      $http.post('/logout').success(function () {
        delete $scope.authentication.user;

        $state.go('signin', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.$on('$stateChangeSuccess', function () {
      $scope.loggedIn = Authentication.user !== undefined && typeof Authentication.user === 'object';

      // Collapsing the menu after navigation
      $scope.closeMenu();

      $scope.activeMenu = [
        {
          title: 'Home',
          'ui-sref': 'home()'
        },
        {
          title: 'Projects',
          'ui-sref': 'projects.list()'
        },
        {
          title: 'Ideas',
          'ui-sref': 'ideas.list()'
        },
        {
          title: 'FAQs',
          'ui-sref': 'faqs.list()'
        }
      ];

      if ($scope.loggedIn && $scope.authentication.user.isAdmin) {
        $scope.activeMenu.push({
          title: 'Admin Home',
          'ui-sref': 'admin.index()'
        });
      }
    });

    $scope.closeMenu = function() {
      $scope.toggleCollapsibleMenu(true);
    };
  }
]);
