'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', '$location',
  function ($scope, $state, Authentication, $location) {
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

    $scope.$on('$stateChangeSuccess', function () {
      // Collapsing the menu after navigation
      $scope.closeMenu();

      // Populate menu items based on location
      var path = $location.path();

      var defaultMenu = [
        {
          title: 'Home',
          'ui-sref': 'global()'
        },
        {
          title: 'Projects',
          'ui-sref': 'projects.list()'
        }
      ];

      var adminMenu = [
        {
          title: 'Home',
          'ui-sref': 'global()'
        },
        {
          title: 'Admin Home',
          'ui-sref': 'admin.index()'
        }
      ];

      // TODO: Replace this with role/Check if user is admin
      if (path.indexOf('admin') !== -1) {
        $scope.activeMenu = adminMenu;
      } else {
        $scope.activeMenu = defaultMenu;
      }
    });

    $scope.closeMenu = function() {
      $scope.toggleCollapsibleMenu(true);
    };
  }
]);
