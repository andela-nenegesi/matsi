'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Patient = mongoose.model('Patient');

/**
 * Globals
 */
var user, patient;

/**
 * Unit tests
 */
describe('Patient Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			name: 'Full Name',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			patient = new Patient({
				name: 'Patient Name',
				dob: 'Date of Birth',
				sex: 'Patient sex',
				country: 'Patient country',
				description: 'description',
				story: 'story',
				donor: 0,
				image: 'Patient image',
				amountCollected: 0,
				amountNeeded: 0,
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return patient.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			patient.name = '';

			return patient.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Patient.remove().exec();
		User.remove().exec();

		done();
	});
});