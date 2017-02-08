'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
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

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.closeMenu();
    });

    $scope.closeMenu = function() {
      $scope.toggleCollapsibleMenu(true);
    };
  }
]);
