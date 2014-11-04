'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'matsi';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload',
        'angularPayments'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('patients');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('about', {
      url: '/about',
      templateUrl: 'modules/core/views/about.client.view.html'
    }).state('contact', {
      url: '/contact',
      templateUrl: 'modules/core/views/contact.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('patients').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', 'Patients', 'patients', '/patients(/create)?');
    Menus.addMenuItem('topbar', 'View Patients', 'patients');
    Menus.addMenuItem('topbar', 'New Patient', 'patients/create');
  }
]);'use strict';
//Setting up route
angular.module('patients').config([
  '$stateProvider',
  function ($stateProvider) {
    // Patients state routing
    $stateProvider.state('listPatients', {
      url: '/patients',
      templateUrl: 'modules/patients/views/list-patients.client.view.html'
    }).state('createPatient', {
      url: '/patients/create',
      templateUrl: 'modules/patients/views/create-patient.client.view.html'
    }).state('viewPatient', {
      url: '/patients/:patientId',
      templateUrl: 'modules/patients/views/view-patient.client.view.html'
    }).state('editPatient', {
      url: '/patients/:patientId/edit',
      templateUrl: 'modules/patients/views/edit-patient.client.view.html'
    }).state('donatePatient', {
      url: '/patients/:patientId/donate',
      templateUrl: 'modules/patients/views/donate-patient.client.view.html'
    });
  }
]);'use strict';
// Patients controller
angular.module('patients').config(function () {
  window.Stripe.setPublishableKey('pk_test_lRwjZcqwjWs9OO2H9M76uP9N');
}).controller('PatientsController', [
  '$scope',
  '$stateParams',
  '$timeout',
  '$upload',
  '$location',
  'Authentication',
  'Patients',
  function ($scope, $stateParams, $timeout, $upload, $location, Authentication, Patients) {
    $scope.authentication = Authentication;
    $scope.url = 'http://watsi.org' + $location.path();
    // $scope.url = $location.absUrl();
    //Date picker
    $scope.today = function () {
      $scope.dt = new Date();
      var curr_date = $scope.dt.getDate();
      var curr_month = $scope.dt.getMonth();
      var curr_year = $scope.dt.getFullYear();
      $scope.dt = curr_year + curr_month + curr_date;
    };
    $scope.today();
    $scope.clear = function () {
      $scope.dt = null;
    };
    $scope.toggleMin = function () {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.formats = [
      'dd-MMMM-yyyy',
      'yyyy/MM/dd',
      'dd.MM.yyyy',
      'shortDate'
    ];
    $scope.format = $scope.formats[1];
    // Create new Patient
    $scope.create = function () {
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
      patient.$save(function (response) {
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
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Image Upload
    // 		--on File Select
    $scope.onFileSelect = function ($files) {
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
    $scope.start = function (indexOftheFile) {
      $scope.loading = true;
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
        headers: { 'Content-Type': $scope.files[indexOftheFile].type },
        data: formData,
        file: $scope.files[indexOftheFile]
      });
      $scope.imageFiles[indexOftheFile].then(function (response) {
        $timeout(function () {
          $scope.loading = false;
          //alert('uploaded');
          var imageUrl = 'https://kehesjay.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
          $scope.uploadResult.push(imageUrl);
        });
      }, function (response) {
        $scope.loading = false;
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        alert('Connection Timed out');
      }, function (evt) {
      });
      $scope.imageFiles[indexOftheFile].xhr(function (xhr) {
      });
    };
    // Remove existing Patient
    $scope.remove = function (patient) {
      if (patient) {
        patient.$remove();
        for (var i in $scope.patients) {
          if ($scope.patients[i] === patient) {
            $scope.patients.splice(i, 1);
          }
        }
      } else {
        $scope.patient.$remove(function () {
          $location.path('patients');
        });
      }
    };
    // donate function added by Terwase Gberikon
    $scope.stripeCallback = function (code, result) {
      if (result.error) {
        window.alert('it failed! error: ' + result.error.message);
      } else {
        window.alert('your donation of ' + '$' + $scope.amountCollected + ' has been recieved');
      }
    };
    // Update existing Patient
    $scope.update = function () {
      var patient = $scope.patient;
      patient.$update(function () {
        $location.path('patients/' + patient._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Patients
    $scope.find = function () {
      $scope.patients = Patients.query();
    };
    $scope.countryPush = function (value, value2) {
      if (value) {
        $scope.countryCount++;
        $scope.countryArray.push(value2);
      }
    };
    $scope.homePageDatas = function () {
      $scope.patientCount = 0;
      $scope.donorCount = 0;
      $scope.countryCount = 0;
      $scope.countryArray = [0];
      $scope.shouldPush = false;
      $scope.pushData = '';
      $scope.datas = Patients.query().$promise.then(function (response) {
        angular.forEach(response, function (data, key) {
          $scope.donorCount += data.donor;
          if (data.donor > 0) {
            $scope.patientCount++;
            angular.forEach($scope.countryArray, function (country, key) {
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
      });
      $timeout(function () {
      }, 2000);
    };
    // Find existing Patient
    $scope.findOne = function () {
      $scope.patient = Patients.get({ patientId: $stateParams.patientId }, function () {
        $scope.patientName = $scope.patient.name.toUpperCase();
      });
    };
    //percentage of patients funds
    var getFundsPerc = function (amountCollected, amountNeeded) {
      return amountCollected / amountNeeded * 100;
    };
    $scope.progressBar = function (amountCollected, amountNeeded) {
      var perc = Math.floor(amountCollected / amountNeeded * 100);
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
      var timer = null, startTime = null, progress = angular.element(document.getElementById('progress')).shieldProgressBar(options).swidget();
    };
    var amountCollected = 200;
    var amountNeeded = 1000;
    $scope.progressBar(amountCollected, amountNeeded);
    $scope.updateRate = function (amountDonated) {
      var i = parseInt(amountDonated, 10);
      i = i > 0 ? i : 0;
      var newAmount = amountCollected + i;
      $scope.progressBar(newAmount, amountNeeded);
    };
    $scope.fundsPercentage = getFundsPerc();
    $scope.ellipsis = function (story, length) {
      return story.substring(0, length).replace(/[^ ]*$/, '...');
    };
  }
]).filter('myCurrency', [
  '$filter',
  function ($filter) {
    return function (input) {
      input = parseFloat(input);
      if (input % 1 === 0) {
        input = input.toFixed(0);
      } else {
        input = input.toFixed(2);
      }
      return '$' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  }
]);'use strict';
//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', [
  '$resource',
  function ($resource) {
    return $resource('patients/:patientId', { patientId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    $scope.userRole = '';
    // If user is signed in then redirect back home
    if ($scope.authentication.user.userRoles === 'user')
      $location.path('/signin');
    $scope.signup = function () {
      if ($scope.credentials.email.substring($scope.credentials.email.indexOf('@'), $scope.credentials.email.length) === '@andela.co') {
        $scope.credentials.userRoles = 'admin';
      } else {
        $scope.credentials.userRoles = 'user';
      }
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.passMatch = false;
    $scope.passMatch2 = true;
    $scope.checkpass = function () {
      if ($scope.credentials.password === $scope.credentials.confirmPassword) {
        $scope.passMatch = false;
        $scope.passMatch2 = false;
      } else {
        $scope.passMatch = true;
        $scope.passMatch2 = true;
      }
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);