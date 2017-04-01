(function () {
  'use strict';

  angular
    .module('questions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('questions', {
        abstract: true,
        url: '/questions',
        template: '<ui-view/>'
      })
      .state('questions.list', {
        url: '',
        templateUrl: 'modules/questions/client/views/list-questions.client.view.html',
        controller: 'QuestionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Questions List'
        }
      })
      .state('questions.create', {
        url: '/create',
        templateUrl: 'modules/questions/views/form-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          questionResolve: newQuestion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Questions Create'
        }
      })
      .state('questions.edit', {
        url: '/:questionId/edit',
        templateUrl: 'modules/questions/views/form-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          questionResolve: getQuestion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Question {{ questionResolve.name }}'
        }
      })
      .state('questions.view', {
        url: '/:questionId',
        templateUrl: 'modules/questions/views/view-question.client.view.html',
        controller: 'QuestionsController',
        controllerAs: 'vm',
        resolve: {
          questionResolve: getQuestion
        },
        data: {
          pageTitle: 'Question {{ questionResolve.name }}'
        }
      });
  }

  getQuestion.$inject = ['$stateParams', 'QuestionsService'];

  function getQuestion($stateParams, QuestionsService) {
    return QuestionsService.get({
      questionId: $stateParams.questionId
    }).$promise;
  }

  newQuestion.$inject = ['QuestionsService'];

  function newQuestion(QuestionsService) {
    return new QuestionsService();
  }
}());
