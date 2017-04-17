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
