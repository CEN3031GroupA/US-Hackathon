(function () {
  'use strict';

  angular
    .module('questions')
    .controller('QuestionsListController', QuestionsListController);

  QuestionsListController.$inject = ['QuestionsService'];

  function QuestionsListController(QuestionsService) {
    var vm = this;

    vm.questions = QuestionsService.query();
  }
}());
