'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'DonatedValue',
	function($scope, $http, $location, Authentication, DonatedValue) {
		$scope.authentication = Authentication;
		$scope.userRole = '';
		$scope.amountDonated = DonatedValue.amountDonated;
		// If user is signed in then redirect back home
		//if ($scope.authentication.user.userRoles === 'user') $location.path('/signin');

<<<<<<< HEAD
		$scope.signup = function() {
			console.log($scope.credentials);
			if(($scope.credentials.email.substring($scope.credentials.email.indexOf('@'), $scope.credentials.email.length)) === '@andela.co'){
        		$scope.credentials.userRoles = 'admin';
    		} else {
        		$scope.credentials.userRoles = 'user';
    		} 
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
=======
		$scope.signup = function(credentials) {
			if ((credentials.email.substring(credentials.email.indexOf('@'), credentials.email.length)) === '@andela.co') {
				credentials.userRoles = 'admin';
			} else {
				credentials.userRoles = 'user';
			}
			$http.post('/auth/signup', credentials).success(function(response) {
>>>>>>> 868b0b812e70de86d40957b09458aa80337100be
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//User should stay on the current page
				// And redirect to the index page
				//$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		$scope.passMatch = false;
		$scope.passMatch2 = true;
<<<<<<< HEAD
		$scope.checkpass = function(){
			console.log($scope.credentials.password);
			if ($scope.credentials.password === $scope.credentials.confirmPassword)
			{
=======
		$scope.checkpass = function(val1, val2) {
			if (val1 === val2) {
>>>>>>> 868b0b812e70de86d40957b09458aa80337100be
				$scope.passMatch = false;
				$scope.passMatch2 = false;
			} else {
				$scope.passMatch = true;
				$scope.passMatch2 = true;
			}
		};
		$scope.signin = function() {
			console.log($scope.credentials);
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//User should stay on the current page
				// And redirect to the index page
				//$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
