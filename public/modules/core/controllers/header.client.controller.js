'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$modal', '$log',
	function($scope, Authentication, Menus, $modal, $log) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		//modal for signIn
		$scope.modalSignIn = function (size) {
			console.log("modal");
			var modalInstance = $modal.open({
				templateUrl: 'modules/users/views/authentication/signin.client.view.html',
				controller: function($scope, $modalInstance){
					$scope.close = function () {
						$modalInstance.close();
					};
				},
				size: size,
			});
		};
	}
]);
