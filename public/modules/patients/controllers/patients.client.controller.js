'use strict';

// Patients controller
angular.module('patients').config(function() {
    window.Stripe.setPublishableKey('pk_test_lRwjZcqwjWs9OO2H9M76uP9N');
}).controller('PatientsController', ['$scope', '$stateParams', '$timeout', '$upload', '$location', 'Authentication', 'Patients',
    function($scope, $stateParams, $timeout, $upload, $location, Authentication, Patients) {
        $scope.authentication = Authentication;
        $scope.url = 'http://matsi1.herokuapp.com/#!' + $location.path();
        $scope.fileUploaded = true;
        $scope.fileLoading = false;
        // $scope.url = $location.absUrl();
        //Date picker

        var FBShare = function() {
            FB.ui({
                method: 'feed',
                link: $scope.url,
                picture: $scope.patient.image,
                caption: $scope.patient.story,
                message: $scope.patient.description
            }, function(response) {
                if (response && !response.error_code) {

                }
            });
        }

        $scope.sharePatient = function(i) {
            var url = encodeURIComponent($scope.url);
            var shareURL;

            switch (i) {
                case 1:
                    return FBShare();
                    break;
                case 2:
                    shareURL = '//twitter.com/intent/tweet?original_referer=' + url + '&text=' +
                        $scope.patient.description + '&tw_p=tweetbutton&url=' + url;
                    break;
                case 3:
                    shareURL = '//plus.google.com/share?url=' + url;
                    break;
            }
            if (shareURL)
                window.open(shareURL, 'matsi_window', 'height=250,width=600,toolbar=0,location=0');
        };
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
            var patient = new Patients({
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
        //      --on File Select
        $scope.onFileSelect = function($files) {
            $scope.files = $files;
            $scope.imageFiles = [];
            $scope.uploadResult = [];
            $scope.correctFormat = true;
            if ($scope.files) {
                for (var i in $scope.files) {
                    if ($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
                        // $scope.correctFormat = true;
                        $scope.start(i);
                    } else {
                        alert('Wrong file format...');
                        $scope.correctFormat = true;
                    }


                }
            }
        };
        $scope.start = function(indexOftheFile) {
            $scope.fileLoading = true;
            var formData = {
                key: $scope.files[indexOftheFile].name,
                AWSAccessKeyID: 'AKIAIWGDKQ33PXY36LQA',
                acl: 'private',
                policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtlaGVzamF5In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
                signature: 'PLzajm+JQ9bf/rv9lZJzChPwiBc=',
                filename: $scope.files[indexOftheFile].name,
                'Content-Type': $scope.files[indexOftheFile].type
            };

            $scope.imageFiles[indexOftheFile] = $upload.upload({
                url: 'https://kehesjay.s3-us-west-2.amazonaws.com/',
                method: 'POST',
                headers: {
                    'Content-Type': $scope.files[indexOftheFile].type
                },
                data: formData,
                file: $scope.files[indexOftheFile]
            });
            $scope.imageFiles[indexOftheFile].then(function(response) {
                $timeout(function() {
                    //alert('uploaded');
                    var imageUrl = 'https://kehesjay.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
                    $scope.uploadResult.push(imageUrl);
                    $scope.fileUploaded = false;
                    $scope.fileLoading = false;
                }, 2000);
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                alert('Connection Timed out');
            }, function(evt) {

            });
            $scope.imageFiles[indexOftheFile].xhr(function(xhr) {});

        };

        // Remove existing Patient
        $scope.remove = function(patient) {
            if (patient) {
                patient.$remove();

                for (var i in $scope.patients) {
                    if ($scope.patients[i] === patient) {
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

        $scope.stripeCallback = function(code, result) {
            if (result.error) {
                window.alert('it failed! error: ' + result.error.message);
            } else {
                window.alert('your donation of ' + '$' + $scope.amountCollected + ' has been recieved');
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
        $scope.countryPush = function(value, value2) {
            if (value) {
                $scope.countryCount++;
                $scope.countryArray.push(value2);
            }
        };
        $scope.homePageDatas = function() {
            $scope.patientCount = 0;
            $scope.donorCount = 0;
            $scope.countryCount = 0;
            $scope.countryArray = [0];
            $scope.shouldPush = false;
            $scope.pushData = '';
            $scope.datas = Patients.query().$promise.then(
                function(response) {
                    angular.forEach(response, function(data, key) {
                        $scope.donorCount += data.donor;
                        if (data.donor > 0) {
                            $scope.patientCount++;
                            angular.forEach($scope.countryArray, function(country, key) {
                                if (data.country.toUpperCase() === country.toUpperCase()) {
                                    $scope.shouldPush = false;
                                } else {
                                    $scope.shouldPush = true;
                                    $scope.pushData = data.country;
                                }
                            });
                            $scope.countryPush($scope.shouldPush, $scope.pushData);
                        }
                    });
                }
            );
            $timeout(function() {}, 2000);
        };
        // Find existing Patient
        $scope.findOne = function() {
            $scope.patient = Patients.get({
                patientId: $stateParams.patientId
            }, function() {
                $scope.patientName = $scope.patient.name.toUpperCase();
            });
        };
        //percentage of patients funds
        var getFundsPerc = function(amountCollected, amountNeeded) {
            return ((amountCollected / amountNeeded) * 100);
        };
        $scope.progressBar = function(amountCollected, amountNeeded) {
            var perc = Math.floor((amountCollected / amountNeeded) * 100);
            var options = {
                min: 0,
                max: 100,
                value: perc,
                layout: 'circular',
                layoutOptions: {
                    circular: {
                        width: 10,
                        color: 'orange',
                        colorDisabled: '#eee',
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#eee'
                    }
                },

                text: {
                    enabled: true,
                    template: '<span style="font-size:20px;">{0}</span> %'
                },
                reversed: false

            };

            if (perc >= 100) {
                options.layoutOptions.circular.color = 'green';
                options.text.template = '100%';
            } else {
                options.text.template = '{0}%';
            }


            var timer = null,
                startTime = null,
                progress = angular.element(document.getElementById('progress')).shieldProgressBar(options).swidget();
        };

        var amountCollected = 200;
        var amountNeeded = 1000;
        $scope.progressBar(amountCollected, amountNeeded);
        $scope.updateRate = function(amountDonated) {
            var i = parseInt(amountDonated, 10);
            i = i > 0 ? i : 0;
            var newAmount = amountCollected + i;
            $scope.progressBar(newAmount, amountNeeded);

        };
        $scope.fundsPercentage = getFundsPerc();
        $scope.ellipsis = function(story, length) {
            return story.substring(0, length).replace(/[^ ]*$/, '...');
        };
    }
]).filter('myCurrency', ['$filter', function($filter) {
    return function(input) {
        input = parseFloat(input);

        if (input % 1 === 0) {
            input = input.toFixed(0);
        } else {
            input = input.toFixed(2);
        }
        return '$' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
}]);
