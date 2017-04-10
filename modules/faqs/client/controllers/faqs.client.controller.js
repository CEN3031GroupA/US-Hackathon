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
      console.log($scope.faq);
      var answer = this.answer;

      var req = {
        method: 'POST',
        url: '/api/faqs/' + $scope.faq._id + '/addAnswer',
        data: {
          answer: answer
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
  }
]);

// if (!$rootScope.activeFAQ) {
//   $rootScope.activeFAQ = {
//     solution: {}
//   };
// }
//
//
// $scope.saveQuestion = function (response) {
//   $rootScope.activeFAQ.question = this.question;
//
//   $location.path('faqs');
// };
//
// $scope.post = function (isValid) {
//   $scope.error = null;
//
//   // Create new FAQ object
//   var faq = new FAQs($rootScope.activeFAQ);
//   // Redirect
//   faq.$save(function (response) {
//     $scope.faqs.push(response);
//     $scope.askme=false;
//     // clear active
//     $rootScope.activeFAQ = null;
//   }, function (errorResponse){
//     $scope.error = errorResponse.data.message;
//   });
// };
// // Find a list of faqs

// // Find a faq
// $scope.findOne = function () {
//   $scope.faq = FAQs.get({
//     faqId: $stateParams.faqId
//   });
// };
// // Remove existing Project
// $scope.remove = function (faq) {
//   if (faq) {
//     faq.$remove();
//
//     for (var i in $scope.faqs) {
//       if ($scope.faqs[i] === faq) {
//         $scope.faqs.splice(i, 1);
//       }
//     }
//   } else {
//     $scope.faq.$remove(function () {
//       $location.path('faqs');
//     });
//   }
// };
//
// // Update existing faq
// $scope.update = function (isValid) {
//   $scope.error = null;
//
//   if (!isValid) {
//     $scope.$broadcast('show-errors-check-validity', 'faqForm');
//
//     return false;
//   }
//
//   $scope.faq.$update(function () {
//     $location.path('faqs/');
//   }, function (errorResponse) {
//     $scope.error = errorResponse.data.message;
//   });
// };
