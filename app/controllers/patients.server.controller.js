'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Patient = mongoose.model('Patient'),
	_ = require('lodash');

/**
 * Create a Patient
 */
exports.create = function(req, res) {
	var patient = new Patient(req.body);
	patient.user = req.user;
	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * Show the current Patient
 */
exports.read = function(req, res) {
	res.jsonp(req.patient);
};

/**
 * Update a Patient
 */
exports.update = function(req, res) {
	var patient = req.patient ;
	patient = _.extend(patient , req.body);
	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

exports.updateDonation = function(req, res) {
	var patient = req.patient ;
	
	if(patient._id)
	{
		Patient.where().update({_id:patient._id},{$set:{amountCollected:req.body.amountCollected,donor:req.body.donor}},{multi:false},function(err,count){

			if(err)
				return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else 
				res.jsonp(patient);
		});
	}
	else 
		res.status(400).send({message:'Invalid request'});
};

/**
 * Delete a Patient
 */
exports.delete = function(req, res) {
	var patient = req.patient ;
	patient.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * List of Patients
 */
exports.list = function(req, res) {

	var processSchema = function(schema)
	{
		if(req.query.page)
		{
			var numItems = 3;
			var lim = numItems + 1;
			var skipCount = numItems * parseInt(req.query.page,10);
			return schema.limit(lim).skip(skipCount);
		}
		return schema;
	}

	processSchema(Patient.find()).sort('-created').populate('user', 'displayName').exec(function(err, patients) {
		 
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patients);
		}
	});
};


// Event.find()
//     .select('name')
//     .limit(perPage)
//     .skip(perPage * page)
//     .sort({
//         name: 'asc'
//     })
//     .exec(function(err, events) {
//         Event.count().exec(function(err, count) {
//             res.render('events', {
//                 events: events,
//                 page: page,
//                 pages: count / perPage
//             })
//         })
//     })

/**
 * Patient middleware
 */
exports.patientByID = function(req, res, next, id) { Patient.findById(id).populate('user', 'displayName').exec(function(err, patient) {
		if (err) return next(err);
		if (! patient) return next(new Error('Failed to load Patient ' + id));
		req.patient = patient ;
		next();
	});
};

/**
 * Patient authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
