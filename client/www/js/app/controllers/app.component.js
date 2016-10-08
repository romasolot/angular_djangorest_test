'use strict';

var appComponent = {
    templateUrl: 'js/app/templates/app.template.html',
    controller: ['$scope', 'Auth', 'Emails',
        function($scope, Auth, Emails) {
            this.showUser = false;
            this.emails = [];
            this.emails_loaded = false;
            this.prevPageTokens = [];
            this.nextPageToken = false;
            $scope.user = false;

            Auth.isAuthenticated().then((data) => {
                if (data.user !== false) {
                    this.showUser = true;
                    $scope.user = data.user;
                } else {
                    this.showUser = false;
                    this.user = false;
                }
            }).catch((error) => {
                console.log('Error: ', error);
            });

            this.login = function() {
                Auth.login().then((data) => {
                    this.showUser = true;
                    $scope.user = data.user;
                }).catch((error) => {
                    console.log('Error: ', error);
                });
            };

            this.logout = function() {
                Auth.logout().then((data) => {
                    this.showUser = false;
                    $scope.user = false;
                    this.emails = [];
                }).catch((error) => {
                    console.log('Error: ', error);
                });
            };
            this.getEmails = function (dir) {
                this.emails_loaded = false;
                this.emails = [];
                if ($scope.user !== false && typeof($scope.user) !== 'undefined') {
                    if(dir == 'next') {
                        this.prevPageTokens.push(this.nextPageToken);
                    }
                    if(dir == 'back') {
                        this.prevPageTokens.pop();
                        this.nextPageToken = this.prevPageTokens[this.prevPageTokens.length - 1]
                    }
                    Emails.getEmails(this.nextPageToken).then((data) => {
                        this.emails = data.emails;
                        this.nextPageToken = data.nextPageToken;
                        this.emails_loaded = true;
                    }).catch((error) => {
                        console.log('Error: ', error);
                    });
                }
            };
            $scope.$watch('user', (newVal, oldVal) => {
                if ($scope.user !== false && typeof($scope.user) !== 'undefined') {
                    this.getEmails('next');
                }
            });
        }
    ]
};

angular.module('testApp')
    .component('appComponent', appComponent)