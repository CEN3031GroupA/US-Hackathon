(function () {
  'use strict';

  angular
    .module('questions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Questions',
      state: 'questions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'questions', {
      title: 'List Questions',
      state: 'questions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'questions', {
      title: 'Create Question',
      state: 'questions.create',
      roles: ['user']
    });
  }
}());
