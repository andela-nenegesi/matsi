'use strict';

//Setting up route
angular.module('patients').config(['$stateProvider',
	function($stateProvider) {
		// Patients state routing
		$stateProvider.
		state('listPatients', {
			url: '/ministries',
			templateUrl: 'modules/patients/views/list-patients.client.view.html'
		}).
		state('createPatient', {
			url: '/ministries/create',
			templateUrl: 'modules/patients/views/create-patient.client.view.html'
		}).
		state('viewPatient', {
			url: '/patients/:patientId',
			templateUrl: 'modules/patients/views/view-patient.client.view.html'
		}).
		state('editPatient', {
			url: '/patients/:patientId/edit',
			templateUrl: 'modules/patients/views/edit-patient.client.view.html'
		}).state('donatePatient', {
			url: '/patients/:patientId/donate',
			templateUrl: 'modules/patients/views/donate-patient.client.view.html'
		});
	}
]);