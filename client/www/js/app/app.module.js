'use strict';

// Define the `phonecatApp` module
angular.module('testApp', [
    'ngAnimate',
    'ngRoute',
    'LocalStorageModule'
])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
