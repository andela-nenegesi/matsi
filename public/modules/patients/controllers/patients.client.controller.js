'use strict';

// Patients controller
angular.module('patients').config(function() {
    window.Stripe.setPublishableKey('pk_test_lRwjZcqwjWs9OO2H9M76uP9N');
}).controller('PatientsController', ['$scope', '$stateParams', '$timeout', '$upload', '$location', 'Authentication', 'Patients', 'CurPats', 'Donate', 'DonatedValue',
    function($scope, $stateParams, $timeout, $upload, $location, Authentication, Patients, CurPats, Donate, DonatedValue) {
        $scope.authentication = Authentication;
        $scope.DonatedValue = DonatedValue;
        $scope.url = 'http://matsi1.herokuapp.com/#!' + $location.path();
        $scope.fileUploaded = true;
        $scope.fileLoading = false;
        // $scope.url = $location.absUrl();
        //Date picker
        var shortenString = function(str) {
            if (typeof str === typeof '') {
                str = str.length >= 200 ? str.substring(0, 197) + '...' : str;
                return str;
            }
            return str;
        };
        var fBShare = function() {
            //var FB = FB?FB:null;
            if(!window.FB)
                return;
            window.FB.ui({
                method: 'feed',
                link: $scope.url,
                picture: $scope.patient.image,
                caption: shortenString($scope.patient.story),
                message: shortenString($scope.patient.description)
            });
        };

        $scope.sharePatient = function(i) {
            var url = encodeURIComponent($scope.url);
            var shareURL;

            switch (i) {
                case 1:
                    fBShare();
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

                $scope.patient.amountCollected += $scope.amountCollected;
                $scope.patient.donor++;
                $scope.donateUpdate();
                $scope.actionText = $scope.authentication.user?'Continue':'Sign Up';
                DonatedValue.amountDonated = $scope.amountCollected;
            }
        };

        $scope.findOneToDonate = function() {
            $scope.amountCollected = $scope.DonatedValue.amountDonated;

            $scope.patient = Donate.get({
                patientId: $stateParams.patientId
            });
        };

        $scope.goPatientHome = function(toDonate) {
            if (toDonate)
                $location.path('patients/' + $scope.patient._id + '/donate');
            else
            {
                if(!$scope.authentication.user)
                    $location.path('signup');
                else
                    $location.path('patients/' + $scope.patient._id);
            }
        };

        $scope.donateUpdate = function() {
            var patient = $scope.patient;
            patient.$update(function() {
                if($scope.mockRedirect)
                {
                    $scope.goPatientHome(true);
                }
                $scope.donateResult = 'Your donation of $' + $scope.amountCollected + ' has been received';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Update existing Patient
        $scope.update = function() {
            var patient = $scope.patient;
            patient.$update(function() {
                $scope.goPatientHome();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
          $scope.patSkip = 0;
        // console.log(CurPats.curPats);
        $scope.viewMore = function(currentPatients){
            $scope.patSkip ++;
            // console.log($scope.patSkip);
            $scope.find();
        };
        // Find a list of Patients
        $scope.patientArray = [];
        $scope.showViewMore = true; 

        $scope.find = function() {
        Patients.query({page:$scope.patSkip}).$promise.then(function(data){
            console.log(data.length);
                if (data.length < 4)
            {
                $scope.showViewMore = false; 
            // var tr = data;
            $scope.patientArray= $scope.patientArray.concat(data);
            $scope.patients = $scope.patientArray;
            }
            else{
            var tr = data.splice(0,(data.length-1));
            $scope.patientArray= $scope.patientArray.concat(tr);
            $scope.patients = $scope.patientArray;
        }
        });
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
            $scope.countryArray = ['t'];
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
        };
        // Find existing Patient
        $scope.findOne = function() {
            $scope.patient = Patients.get({
                patientId: $stateParams.patientId
            }, function(r) {
                $scope.patientName = $scope.patient.name.toUpperCase();
                $scope.progressBar(r.amountCollected, r.amountNeeded);
            });
        };
        //percentage of patients funds
        $scope.getFundsPerc = function(amountCollected, amountNeeded) {
            return Math.round((amountCollected / amountNeeded) * 100);
        };

        $scope.progressBarObject = undefined;
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
                    template: '<span style="font-size:50px;">{0}</span>'
                },
                reversed: false

            };
            if (perc >= 100) {
                options.layoutOptions.circular.color = '#3BB83B';
                options.text.template = '<span class="perc"> 100%</span>' + '<br>' + 'funded by ' + $scope.patient.donor + ' donors' + '<br>' + '$' +  amountCollected + ' raised' ;

            } else {
                options.text.template = '<span class="perc">{0}%</span>' + '<br>' +'funded by ' + $scope.patient.donor + ' donors' + '<br>' + '$' + amountCollected + ' raised' +'<br>'+ '$' + (amountNeeded - amountCollected)+ ' to go';
            }
            $scope.progressBarObject = angular.element(document.getElementById('progress')).shieldProgressBar(options).swidget();
        };
        $scope.updateRate = function(amountDonated) {

            var i = parseInt(amountDonated, 10);
            i = i > 0 ? i : 0;
            DonatedValue.amountDonated = i;
            var newAmount = $scope.patient.amountCollected + i;
            $scope.progressBar(newAmount, $scope.patient.amountNeeded);

        };

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
