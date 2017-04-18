'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (!(toState.data && toState.data.allowAnon)) {
      if (toState.data && toState.data.adminOnly && !Authentication.user.isAdmin) {
        event.preventDefault();
        $state.go('forbidden');
        return;
      }

      if (!(Authentication.user !== undefined && typeof Authentication.user === 'object')) {
        event.preventDefault();
        $state.go('signin');
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('eventCategories');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('events', ['ui.bootstrap.datetimepicker']);

/**
 * Created by George on 3/2/2017.
 */
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('faqs');

'use strict';

ApplicationConfiguration.registerModule('ideas');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects', ['ja.qr', 'textAngular']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('subevents', ['ui.bootstrap.datetimepicker', 'textAngular']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';


angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {

    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
      });
  }
]);

'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
  }
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('admin.index', {
        url: '',
        templateUrl: 'modules/core/client/views/admin/index.client.view.html'
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

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
          title: 'Schedule',
          'ui-sref': 'schedule.index()'
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

'use strict';

angular.module('core').controller('HomeController', ['$scope', '$interval', 'Authentication', 'ActiveEvent',
  function ($scope, $interval, Authentication, ActiveEvent) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.init = function() {
      ActiveEvent.get().then(function(activeEvent) {
        $scope.activeEvent = activeEvent;
        $scope.calcEventTime();
        $interval($scope.calcEventTime, 1000);
      });
    };

    $scope.calcEventTime = function() {
      var now = new Date();
      var timeLeft, timeTill;
      var days, hours, minutes, seconds;
      var startDate = new Date($scope.activeEvent.start);
      var endDate = new Date($scope.activeEvent.end);

      if (startDate < now) {
        $scope.activeEvent.inProgress = true;
        timeLeft = parseInt((endDate - now) / 1000); // Time left in seconds
        hours = parseInt(timeLeft / (60*60));
        minutes = parseInt((timeLeft - hours * 60 * 60) / 60);
        seconds = timeLeft - hours * 60 * 60 - minutes * 60;
        $scope.activeEvent.timer = hours + ':' + minutes + ':' + seconds;
      } else {
        $scope.activeEvent.inProgress = false;
        timeTill = parseInt((startDate - now) / 1000); // Time till in seconds
        days = parseInt(timeTill / (24 * 60 * 60));
        hours = parseInt((timeTill - days * 24 * 60 * 60) / 60 / 60);
        minutes = parseInt((timeTill - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
        $scope.activeEvent.timer = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes';
      }
    };
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Setting up route
angular.module('eventCategories').config(['$stateProvider',
  function ($stateProvider) {
    // Event Categories state routing
    $stateProvider
      .state('eventCategories', {
        abstract: true,
        url: '/admin/eventCategories',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('eventCategories.index', {
        url: '',
        templateUrl: 'modules/eventCategories/client/views/list.client.view.html'
      })
      .state('eventCategories.create', {
        url: '/create',
        templateUrl: 'modules/eventCategories/client/views/create.client.view.html'
      })
      .state('eventCategories.edit', {
        url: '/:eventCategoryId/edit',
        templateUrl: 'modules/eventCategories/client/views/edit.client.view.html',
      });
  }
]);

'use strict';

// Projects controller
angular.module('eventCategories').controller('EventCategoriesController', ['$scope', '$state', '$stateParams', '$location', 'EventCategory',
  function ($scope, $state, $stateParams, $location, EventCategory) {
    $scope.create = function() {
      var i;
      var questions = [];
      for (i = 0; i < $scope.questions.length; i++) {
        questions.push($scope.questions[i].content);
      }

      var eventCategory = new EventCategory({
        title: this.title,
        description: this.description,
        questions: questions
      });

      // Redirect after save
      eventCategory.$save(function (response) {
        $location.path('admin/eventCategories');

        // Clear form fields
        $scope.title = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var eventCategory = $scope.eventCategory;

      var questions = [];
      var i;
      for (i = 0; i < $scope.questions.length; i++) {
        questions.push($scope.questions[i].content);
      }

      eventCategory.questions = questions;

      eventCategory.$update(function () {
        $location.path('admin/eventCategories');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.eventCategories = EventCategory.query();
    };

    $scope.findOne = function () {
      EventCategory.get({
        eventCategoryId: $stateParams.eventCategoryId
      }, function(eventCategory) {
        $scope.eventCategory = eventCategory;

        var i;
        $scope.questions = [];
        for (i = 0; i < $scope.eventCategory.questions.length; i++) {
          $scope.questions.push({
            num: i + 1,
            content: $scope.eventCategory.questions[i]
          });
        }
      });
    };

    $scope.remove = function (eventCategory) {
      if (eventCategory) {
        eventCategory.$remove();

        for (var i in $scope.eventCategories) {
          if ($scope.eventCategories[i] === eventCategory) {
            $scope.eventCategories.splice(i, 1);
          }
        }

        $location.path('admin/eventCategories');
      } else {
        $scope.eventCategory.$remove(function () {
          $location.path('admin/eventCategories');
        });
      }
    };

    $scope.deleteQuestion = function (questionIndex) {
      // TODO UPDATE QUESTION.NUM
      var questions = [];
      var i;
      for (i = 0; i < $scope.questions.length; i++) {
        if (i !== questionIndex - 1) {
          questions.push($scope.questions[i]);
        }
      }

      $scope.questions = questions;
    };

    $scope.initCreate = function() {
      $scope.questions = [
        {
          num: 1,
          content: ''
        }
      ];
    };

    $scope.addQuestion = function () {
      $scope.questions.push({
        num: $scope.questions.length + 1,
        content: ''
      });
    };

  }]);

'use strict';

angular.module('eventCategories').factory('EventCategory', ['$resource',
  function ($resource) {
    return $resource('api/admin/eventCategories/:eventCategoryId', {
      eventCategoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('events').config(['$stateProvider',
  function ($stateProvider) {
    // Events state routing
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/admin/events',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('events.index', {
        url: '',
        templateUrl: 'modules/events/client/views/list.client.view.html'
      })
      .state('events.create', {
        url: '/create',
        templateUrl: 'modules/events/client/views/create.client.view.html'
      })
      .state('events.manage', {
        url: '/:eventId',
        templateUrl: 'modules/events/client/views/manage.client.view.html'
      })
      .state('events.edit', {
        url: '/:eventId/edit',
        templateUrl: 'modules/events/client/views/edit.client.view.html'
      });
  }
]);

'use strict';

// Projects controller
angular.module('events').controller('EventsController',
  ['$scope', '$state', '$stateParams', '$location', 'HackathonEvent', 'EventCategory',
  function ($scope, $state, $stateParams, $location, HackathonEvent, EventCategory) {
    EventCategory.query(function(eventCategories) {
      $scope.eventCategories = eventCategories;
      $scope.eventCategoriesMap = {};

      for (var i = 0; i < $scope.eventCategories.length; i++) {
        $scope.eventCategoriesMap[i] = $scope.eventCategories[i];
      }

      $scope.resetSelectedCategories();
    });

    $scope.resetSelectedCategories = function() {
      $scope.selectedCategories = {};

      for (var i = 0; i < $scope.eventCategories.length; i++) {
        $scope.selectedCategories[i] = false;
      }
    };

    $scope.create = function() {
      var categories = [];

      for (var key in $scope.selectedCategories) {
        if (!$scope.selectedCategories.hasOwnProperty(key)) continue;
        if ($scope.selectedCategories[key] === false) continue;

        categories.push($scope.eventCategoriesMap[key]._id);
      }

      var event = new HackathonEvent({
        title: this.title,
        description: this.description,
        locations: this.locations,
        categories: categories,
        start: this.start,
        end: this.end
      });

      // Redirect after save
      event.$save(function (response) {
        $location.path('admin/events');

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.locations = '';
        $scope.categories = [];
        $scope.resetSelectedCategories();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var event = $scope.event;

      var categories = [];

      for (var key in $scope.selectedCategories) {
        if (!$scope.selectedCategories.hasOwnProperty(key)) continue;
        if ($scope.selectedCategories[key] === false) continue;

        categories.push($scope.eventCategoriesMap[key]._id);
      }

      event.categories = categories;

      $scope.resetSelectedCategories();
      event.$update(function () {
        $location.path('admin/events');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.events = HackathonEvent.query({

      });
    };

    $scope.findOne = function () {
      HackathonEvent.get({
        eventId: $stateParams.eventId
      }, function(event) {
        $scope.event = event;

        for (var i = 0; i < $scope.eventCategories.length; i++) {
          $scope.selectedCategories[i] = false;
          for (var j = 0; j < $scope.event.categories.length; j++) {
            if ($scope.eventCategories[i]._id === $scope.event.categories[j]._id) {
              $scope.selectedCategories[i] = true;
            }
          }
        }
      });
    };

    $scope.remove = function (event) {
      if (event) {
        event.$remove();

        $location.path('admin/events');
      } else {
        $scope.event.$remove(function () {
          $location.path('admin/events');
        });
      }
    };

  }]);

'use strict';

angular.module('events')
  .factory('HackathonEvent', ['$resource',
    function ($resource) {
      return $resource('api/admin/events/:eventId', {
        eventId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        latest: {
          method: 'POST'
        }
      });
    }
  ])
  .service('ActiveEvent', ['$http',
    function ($http) {
      this.get = function () {
        return $http.get('/api/events/latest').then(function(response) {
          return response.data;
        });
      };
    }
  ]);

/**
 * Created by George on 2/26/2017.
 */
'use strict';

// Setting up route
angular.module('faqs').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('faqs', {
        abstract: true,
        url: '/faqs',
        template: '<ui-view/>'
      })
      .state('faqs.list', {
        url: '',
        templateUrl: 'modules/faqs/client/views/list-faqs.client.view.html'
      })
      .state('faqs.respond', {
        url: '/:faqId',
        templateUrl: 'modules/faqs/client/views/respond-faq.client.view.html',
      });
  }
]);

/**
 * Created by George on 2/26/2017.
 */
'use strict';
var faqsApp = angular.module('faqs');

faqsApp.controller('FAQsController', ['$scope', '$state', '$stateParams', '$location', 'FAQs','$rootScope', '$http',
  function ($scope, $state, $stateParams, $location, FAQs, $rootScope, $http) {

    $scope.find = function(){
      $scope.faqs = FAQs.query();
    };

    $scope.findOne = function () {
      $scope.faq = FAQs.get({
        faqId: $stateParams.faqId
      });
      console.log($scope.faq);
    };

    $scope.addAnswer = function(){
      var answer = this.answer;

      if (answer.trim() === ''){
        return;
      }

      var req = {
        method: 'POST',
        url: '/api/faqs/' + $scope.faq._id + '/addAnswer',
        data: {
          answer: answer,
          solution: false
        }
      };
      this.answer = '';
      $http(req).then(function(response){
        $scope.faq = response.data;
      }, function(err){
        console.error(err);
      });
    };

    $scope.post = function (isValid) {
      $scope.error = null;

      var faq = new FAQs({
        question: this.question,
        date: Date,
        user: this.user
      });

      // Redirect
      faq.$save(function (response) {
        $scope.faqs.push(response);
        $scope.askme=false;
      }, function (errorResponse){
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function (faq) {
      if (faq) {
        faq.$remove();

        for (var i in $scope.faqs) {
          if ($scope.faqs[i] === faq) {
            $scope.faqs.splice(i, 1);
          }
        }
      } else {
        $scope.faq.$remove(function () {
          $location.path('faqs');
        });
      }
    };

    $scope.markBestSolution = function (answer) {
      for(var i in $scope.faq.answers) {
        if($scope.faq.answers[i].isSolution === true) {
          $scope.faq.answers[i].isSolution = false;
        }
      }

      var index = $scope.faq.answers.indexOf(answer);
      $scope.faq.answers[index].isSolution = true;

      FAQs.update({ faqId: $scope.faq._id }, { answers: $scope.faq.answers });
    };
  }
]);

/**
 * Created by George on 3/1/2017.
 */
'use strict';

//Projects service used for communicating with the faqs REST endpoints
angular.module('faqs').factory('FAQs', ['$resource',
  function ($resource) {
    return $resource('api/faqs/:faqId', {
      faqId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);

'use strict';

angular.module('ideas').config(['$stateProvider',
  function ($stateProvider) {

    $stateProvider
      .state('ideas', {
        abstract: true,
        url: '/ideas',
        template: '<ui-view/>'
      })
      .state('ideas.list', {
        url:'',
        templateUrl: 'modules/ideas/client/views/list-ideas.client.view.html'
      })
      .state('ideas.create', {
        url:'/create',
        templateUrl: 'modules/ideas/client/views/create-idea.client.view.html',
      })
      .state('ideas.success', {
        url:'/success',
        templateUrl: 'modules/ideas/client/views/success.client.view.html',
      })
      .state('ideas.edit', {
        url:'/:ideaId/edit',
        templateUrl: 'modules/ideas/client/views/edit-idea.client.view.html',
      })
      .state('ideas.view', {
        url:'/:ideaId',
        templateUrl: 'modules/ideas/client/views/view-idea.client.view.html',
      });
  }
]);

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

      if (comment.trim() === ''){
        return;
      }

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

'use strict';

angular.module('ideas').factory('Ideas', ['$resource',
  function ($resource) {
    return $resource('api/ideas/:ideaId', {
      ideaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/create-project.client.view.html',
      })
      .state('projects.category', {
        url: '/category',
        templateUrl: 'modules/projects/client/views/create-project-pick-category.client.view.html',
      })
      .state('projects.team', {
        url: '/team',
        templateUrl: 'modules/projects/client/views/create-project-pick-team.client.view.html',
      })
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/view-project.client.view.html'
      })
      .state('projects.edit', {
        url: '/:projectId/edit',
        templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
      })
      .state('projects.votes', {
        url: '/admin/projectsVotes',
        templateUrl: 'modules/projects/client/views/list-projects-votes.client.view.html',
      });
  }
]);

'use strict';

// Projects controller
angular.module('projects')
  .config(["$sceDelegateProvider", function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',                    // trust all resources from the same origin
      '*://www.youtube.com/**'   // trust all resources from `www.youtube.com`
    ]);
  }])

  .controller('ProjectsController', ['sharedInputFields', '$scope', '$state', '$stateParams', '$location', 'Projects', 'Authentication', 'Users','$rootScope', 'ActiveEvent', '$http',
  function (sharedInputFields, $scope, $state, $stateParams, $location, Projects, Authentication, Users, $rootScope, ActiveEvent, $http) {
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
      var inputFields = sharedInputFields.set();
      console.log(inputFields.length);
      if (inputFields.length !== 0)
      {
        $rootScope.activeProject.title = inputFields[0];
        $rootScope.activeProject.youtube = '';
        $rootScope.activeProject.short = inputFields[1];
        $rootScope.activeProject.long = inputFields[2];
        $rootScope.activeProject.owner = $scope.user;
        inputFields = [];
        sharedInputFields.clear();

        $location.path('projects/team');
      }
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
        $scope.project.$delete(function () {
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
    $scope.qrProjectId = null;
    $scope.findOne = function () {
      $scope.project = Projects.get({ projectId: $stateParams.projectId },function(project) {
        $scope.hasVoted = $scope.user.votedProjects.indexOf(project._id) !== -1;
        $scope.qrProjectId = $scope.project._id;
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

      if (comment.trim() === ''){
        return;
      }

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

'use strict';

//Projects service used for communicating with the articles REST endpoints
angular.module('projects').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('subevents').config(['$stateProvider',
  function ($stateProvider) {
    // SubEvents state routing
    $stateProvider
      .state('subevents', {
        abstract: true,
        url: '/admin/events/:eventId/subevents',
        template: '<ui-view/>',
        data: {
          adminOnly: true
        }
      })
      .state('subevents.index', {
        url: '',
        templateUrl: 'modules/subevents/client/views/list.client.view.html'
      })
      .state('subevents.create', {
        url: '/create',
        templateUrl: 'modules/subevents/client/views/create.client.view.html'
      })
      .state('subevents.edit', {
        url: '/:subeventId/edit',
        templateUrl: 'modules/subevents/client/views/edit.client.view.html'
      });
  }
]).config(['$stateProvider',
  function ($stateProvider) {
    // SubEvents state routing
    $stateProvider
      .state('schedule', {
        abstract: true,
        url: '/schedule',
        template: '<ui-view/>',
      })
      .state('schedule.index', {
        url: '',
        templateUrl: 'modules/subevents/client/views/schedule.client.view.html'
      })
      .state('schedule.view', {
        url: '/:subeventId/view',
        templateUrl: 'modules/subevents/client/views/view.client.view.html'
      });
  }
]);

'use strict';

// Projects controller
angular.module('subevents').controller('SubEventsController',
  ['$scope', '$state', '$stateParams', '$location', 'SubEvent', 'HackathonEvent', 'ActiveEvent', '$interval',
  function ($scope, $state, $stateParams, $location, SubEvent, HackathonEvent, ActiveEvent, $interval) {
    $scope.loadEvent = function(cb) {
      if ($stateParams.eventId) {
        HackathonEvent.get({ eventId: $stateParams.eventId }, function(event) {
          $scope.event = event;

          if (cb) {
            cb(event);
          }
        });
      } else {
        $scope.event = ActiveEvent.get().then(function(event) {
          $scope.event = event;

          if (cb) {
            cb(event);
          }
        });
      }
    };

    $scope.create = function() {
      var subevent = new SubEvent({
        title: this.title,
        description: this.description,
        location: this.location,
        datetime: this.datetime,
        event: $scope.event
      });

      // Redirect after save
      subevent.$save({ eventId: $scope.event._id }, function (response) {
        $location.path('admin/events');

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.location = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function () {
      var querySubevents = function (event) {
        $scope.subevents = SubEvent.query({ eventId: event._id });
        $scope.activeEvent = event;

        $scope.calcEventTime();
        $interval($scope.calcEventTime, 1000);
      };

      $scope.loadEvent(querySubevents);
    };

    $scope.findOne = function () {
      var querySubevent = function (event) {
        $scope.subevent = SubEvent.get({
          eventId: event._id,
          subeventId: $stateParams.subeventId
        });
      };

      $scope.loadEvent(querySubevent);
    };

    $scope.update = function () {
      $scope.subevent.$update(function () {
        $location.path('admin/events/' + $scope.event._id + '/subevents');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function (subevent) {
      if (subevent) {
        subevent.$remove();

        $location.path('admin/events/' + $scope.event._id + '/subevents');
      } else {
        $scope.subevent.$remove(function () {
          $location.path('admin/events/' + $scope.event._id + '/subevents');
        });
      }
    };

    $scope.calcEventTime = function() {
      var now = new Date();
      var timeLeft, timeTill;
      var days, hours, minutes, seconds;
      var startDate = new Date($scope.activeEvent.start);
      var endDate = new Date($scope.activeEvent.end);

      if (startDate < now) {
        $scope.activeEvent.inProgress = true;
        timeLeft = parseInt((endDate - now) / 1000); // Time left in seconds
        hours = parseInt(timeLeft / (60*60));
        minutes = parseInt((timeLeft - hours * 60 * 60) / 60);
        seconds = timeLeft - hours * 60 * 60 - minutes * 60;
        $scope.activeEvent.timer = hours + ':' + minutes + ':' + seconds;
      } else {
        $scope.activeEvent.inProgress = false;
        timeTill = parseInt((startDate - now) / 1000); // Time till in seconds
        days = parseInt(timeTill / (24 * 60 * 60));
        hours = parseInt((timeTill - days * 24 * 60 * 60) / 60 / 60);
        minutes = parseInt((timeTill - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
        $scope.activeEvent.timer = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes';
      }
    };

  }]);

'use strict';

angular.module('events')
  .factory('SubEvent', ['$resource',
    function ($resource) {
      return $resource('api/admin/events/:eventId/subevents/:subeventId', {
        eventId: '@_id',
        subeventId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      });
    }
  ]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('user', {
        abstract: true,
        url: '/user',
        template: '<ui-view/>'
      })
      .state('signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/signin.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome', {
        url: '/welcome',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome1', {
        url: '/welcome2',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome1.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.welcome2', {
        url: '/welcome3',
        templateUrl: 'modules/users/client/views/welcomescreens/welcome2.client.view.html',
        data: {
          allowAnon: true,
        }
      })
      .state('user.view', {
        url: '/:userId',
        templateUrl: 'modules/users/client/views/view-user.client.view.html'
      });
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      console.log("ASD");
      $location.path('/');
    }

    $scope.signin = function (isValid) {
      var credentials = {
        email: this.email,
        password: this.password
      };

      $scope.error = null;

      $http.post('/api/auth/signin', credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    /* Update user */
    $scope.update = function () {
      $scope.error = null;

      $scope.authentication.user.$update(function () {
        $http.put('/api/user/' + $scope.authentication.user._id);
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };
    return auth;
  }
]);


angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/user/:userId', { userId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);


