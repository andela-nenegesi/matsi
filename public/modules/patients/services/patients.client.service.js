'use strict';

//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', ['$resource',
	function($resource) {
		return $resource('patients/:patientId', { patientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


angular.module('patients').factory('Donate', ['$resource',
	function($resource) {
		return $resource('patients/:patientId/donate', { patientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);



angular.module('patients').factory('DonatedValue', [
	function() {
		return {
			amountDonated : 0
		};
	}
]);