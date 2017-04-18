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
