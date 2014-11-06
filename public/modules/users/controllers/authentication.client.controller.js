'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'DonatedValue',
    function($scope, $http, $location, Authentication, DonatedValue) {
        $scope.authentication = Authentication;
        $scope.userRole = '';
        $scope.amountDonated = DonatedValue.amountDonated;
        // If user is signed in then redirect back home
        //if ($scope.authentication.user.userRoles === 'user') $location.path('/signin');

        $scope.signup = function(credentials) {
            if ((credentials.email.substring(credentials.email.indexOf('@'), credentials.email.length)) === '@andela.co') {
                credentials.userRoles = 'admin';
            } else {
                credentials.userRoles = 'user';
            }
            $http.post('/auth/signup', credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.passMatch = false;
        $scope.passMatch2 = true;
        $scope.checkpass = function(val1, val2) {
            if (val1 === val2) {
                $scope.passMatch = false;
                $scope.passMatch2 = false;
            } else {
                $scope.passMatch = true;
                $scope.passMatch2 = true;
            }
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
