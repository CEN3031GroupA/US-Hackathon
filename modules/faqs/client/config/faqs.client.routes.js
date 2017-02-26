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
                url: '/faqs',
                template: '<ui-view/>'
            })
            .state('faqs.post', {
                url: '/post',
                templateUrl: 'modules/faqs/client/views/post-faq.client.view.html',
            });
    }
]);
