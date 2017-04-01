/**
 * Created by George on 2/26/2017.
 */
'use strict';

// Setting up route
angular.module('faqs').config(['$stateProvider',
  function ($stateProvider) {
        // Projects state routing
    $stateProvider
      .state('faqs', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('faqs.list', {
        url: '/faqs',
        templateUrl: 'modules/faqs/client/views/list-faqs.client.view.html'
      })
      .state('faqs.respond', {
        url: '/faq/:faqId/Respond',
        templateUrl: 'modules/faqs/client/views/respond-faq.client.view.html',
      });
  }
]);
