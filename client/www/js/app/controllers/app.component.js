'use strict';

var appComponent = {
    templateUrl: 'js/app/templates/app.template.html',
    controller: ['$scope', 'Auth', 'Emails',
        function($scope, Auth, Emails) {
            this.showUser = false;
            this.emails = [];
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

            $scope.$watch('user', (newVal, oldVal) => {
                if ($scope.user !== false && typeof($scope.user) !== 'undefined') {
                    Emails.getEmails().then((data) => {
                        this.emails = data;
                    }).catch((error) => {
                        console.log('Error: ', error);
                    });
                }
            });
        }
    ]
};

angular.module('testApp')
    .component('appComponent', appComponent)