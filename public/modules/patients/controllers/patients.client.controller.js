'use strict';

// Patients controller
angular.module('patients').controller('PatientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patients', 'Donations',
	function($scope, $stateParams, $location, Authentication, Patients, Donations ) {
		$scope.authentication = Authentication;
		$scope.donationValue = '';
	

	//Date picker
        $scope.today = function() {
            $scope.dt = new Date();
            var curr_date = $scope.dt.getDate();
            var curr_month = $scope.dt.getMonth();
            var curr_year = $scope.dt.getFullYear();
            $scope.dt = curr_year + curr_month + curr_date;
        };
        $scope.today();
        $scope.clear = function() {
            $scope.dt = null;
        };
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation(); 

            $scope.opened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];



		// Create new Patient
		$scope.create = function() {
			// Create new Patient object
			var patient = new Patients ({
				name: this.name,
				dob: this.dob,
				gender: this.gender,
				country: this.country,
				description: this.description,
				story: this.story,
				amountNeeded: this.amountNeeded
			});

			// Redirect after save
			patient.$save(function(response) {
				$location.path('patients/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Patient
		$scope.remove = function( patient ) {
			if ( patient ) { patient.$remove();

				for (var i in $scope.patients ) {
					if ($scope.patients [i] === patient ) {
						$scope.patients.splice(i, 1);
					}
				}
			} else {
				$scope.patient.$remove(function() {
					$location.path('patients');
				});
			}
		};



// donate function added by Terwase Gberikon
		$scope.donate = function(){
			//donateToPatient = $scope.donateToPatient;
			// amountCollected

		Donations.donors = $scope.donateToPatient;
		console.log(Donations.donors);
		$scope.donationValue = Donations.donors;
		console.log($scope.donationValue);
		Donations.donors.push(Donations.donors);
		console.log(Donations.donors);
		};

// $scope.getValue = function (){
// 	console.log(donateToPatient);
// };

/////////////////////////////////////////////////////////////


		// Update existing Patient
		$scope.update = function() {
			var patient = $scope.patient ;

			patient.$update(function() {
				$location.path('patients/' + patient._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patients
		$scope.find = function() {
			$scope.patients = Patients.query();
		};

		// Find existing Patient
		$scope.findOne = function() {
			$scope.patient = Patients.get({ 
				patientId: $stateParams.patientId
			});
		};
	}
]);