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
