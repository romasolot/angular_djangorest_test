
'use strict';

angular.
module('testApp').
factory('Emails', ['$http', '$q', 'Auth', 'localStorageService',
    function($http, $q, Auth, localStorageService) {

        var emails = [];
        var getEmails = function(nextPageToken) {
            var params = {};
            if(nextPageToken) {
                params.nextPageToken = nextPageToken;
            }
            var deferred = $q.defer();
            const access_token = localStorageService.get('access_token');
            const refresh_token = localStorageService.get('refresh_token');

            if (typeof(access_token) === 'undefined' || typeof(refresh_token) === 'undefined' || access_token === null) {
                deferred.reject({error: 'Something is wrong'});
                return deferred.promise;
            }

            Auth.isAuthenticated().then((user) => {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8000/users/emails/',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    params: params
                }).then((data) => {
                    this.emails = data.data;
                    deferred.resolve(this.emails);
                }).catch(() => {
                    deferred.reject({error: 'Something is wrong'});
                })
            });

            return deferred.promise;
        };

        return {
            getEmails: getEmails
        }
    }
]);