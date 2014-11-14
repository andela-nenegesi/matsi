'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var patients = require('../../app/controllers/patients');

	// Patients Routes
	app.route('/patients')
		.get(patients.list)
		.post(users.requiresLogin,patients.create);		
	
	app.route('/patients/:patientId/donate')
		.get(patients.read)
		.put(patients.updateDonation);

	app.route('/patients/:patientId')
		.get(patients.read)
		.put(users.requiresLogin, users.isAdmin, patients.hasAuthorization, patients.update)
		.delete(users.requiresLogin, users.isAdmin, patients.hasAuthorization, patients.delete);

	// Finish by binding the Patient middleware
	app.param('patientId', patients.patientByID);
};


