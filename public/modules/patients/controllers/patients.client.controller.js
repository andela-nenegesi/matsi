'use strict';

// Patients controller
angular.module('patients').controller('PatientsController', ['$scope', '$stateParams', '$timeout', '$upload', '$location', 'Authentication', 'Patients',
	function($scope, $stateParams, $timeout, $upload, $location, Authentication, Patients ) {
		$scope.authentication = Authentication;
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
				amountNeeded: this.amountNeeded,
				image: $scope.uploadResult
			});
			// Redirect after save
			patient.$save(function(response) {
				$location.path('patients/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.dob = '';
				$scope.gender = '';
				$scope.country = '';
				$scope.description = '';
				$scope.story = '';
				$scope.amountNeeded = '';
				$scope.image = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Image Upload
		// 		--on File Select
		$scope.onFileSelect = function($files) {
			$scope.files = $files;
			$scope.imageFiles = [];
			$scope.uploadResult = [];
			$scope.correctFormat = true;
			if($scope.files) {
			for (var i in $scope.files) {
			if($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
			// $scope.correctFormat = true;
			$scope.start(i);
		} 
			else {
				alert('Wrong file format...');
				$scope.correctFormat = true;
		}
			

		}
		}
		};
		$scope.start = function(indexOftheFile) {
			$scope.loading = true;
				var formData = {
				key: $scope.files[indexOftheFile].name,
				AWSAccessKeyID: 'AKIAIWGDKQ33PXY36LQA',
				acl: 'private',
				policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtlaGVzamF5In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
				signature: 'PLzajm+JQ9bf/rv9lZJzChPwiBc=',
				filename: $scope.files[indexOftheFile].name,
				'Content-Type':$scope.files[indexOftheFile].type
			};
            
		$scope.imageFiles[indexOftheFile] = $upload.upload({
                url: 'https://kehesjay.s3-us-west-2.amazonaws.com/',
                method: 'POST',
                headers: {
                    'Content-Type':$scope.files[indexOftheFile].type
                },
                data: formData,
                file: $scope.files[indexOftheFile]
            });
		$scope.imageFiles[indexOftheFile].then(function(response) {
                $timeout(function() {
                    $scope.loading = false;
                    //alert('uploaded');
                    var imageUrl = 'https://kehesjay.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
                    $scope.uploadResult.push(imageUrl);
                });
            }, function(response) {
                $scope.loading = false;
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                alert('Connection Timed out');
            }, function(evt) {
                
            });
		$scope.imageFiles[indexOftheFile].xhr(function(xhr) {
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

		// Update existing Patient
		$scope.update = function() {
			var patient = $scope.patient;
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
