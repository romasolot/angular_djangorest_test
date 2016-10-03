
'use strict';

angular.
module('testApp').
service('Auth', ['$http', '$q', 'localStorageService',
    function($http, $q, localStorageService) {
        this.user = false;

        this.isAuthenticated = () => {
            var deferred = $q.defer();

            if (!this.user) {
                const username = localStorageService.get('username');
                if (typeof(username) !== 'undefined' && username !== null) {
                    this.user = {
                           username: username
                    };
                }
                deferred.resolve({user: this.user});
            } else {
                deferred.resolve({user: this.user});
            }

            return deferred.promise;
        };

        this.login = function() {
            var deferred = $q.defer();

            if (!this.user) {
                gapi.auth.authorize({
                    client_id: "1065700267506-hketl2csh59v8vgopei7n7c4kk6vdgtt.apps.googleusercontent.com",
                    scope: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/gmail.readonly',
                    'https://www.googleapis.com/auth/plus.login',
                    'profile',
                    'email'
                ],
                    immediate: false
                }, (googleUser) => {
                   $http({
                       method: 'POST',
                       url: 'http://127.0.0.1:8000/users/register-by-token/google-plus/',
                       data: {
                           access_token: googleUser.access_token
                       },

                   }).then((data) => {
                       localStorageService.set('username', data.data.username);
                       localStorageService.set('access_token', data.data.access_token);
                       localStorageService.set('refresh_token', data.data.refresh_token);

                       this.user = {
                           username: data.data.username
                       };

                       deferred.resolve({user: this.user});
                   }).catch(() => {
                       deferred.reject({error: 'Something is wrong'});
                   })
                });

            } else {
                deferred.resolve({user: this.user});
            }

            return deferred.promise;

        };

        this.logout = function() {
            var deferred = $q.defer();

            if (this.user) {
                gapi.auth.signOut();

                localStorageService.clearAll();

                // $http({
                //     method: 'GET',
                //     url: 'http://127.0.0.1:8000/users/logout/google-plus'
                // }).then((data) => {
                    this.user = false;
                    deferred.resolve({success: true});
                // }).catch(() => {
                //     deferred.reject({error: 'Something is wrong'});
                // })
            } else {
                deferred.resolve({success: true});
            }

            return deferred.promise;
        };

        return this;
    }
]);