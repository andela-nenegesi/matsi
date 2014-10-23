'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Patient Schema
 */
var PatientSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Patient name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	dob:{
		type:String,
		default:'',
		required: 'Please specify your Date of Birth',
	},
	sex:{
		type:String,
		default:'',
		required: 'Please specify your Gender'
	},
	country:{
		type:String,
		default:'',
		required: 'Please specify your country'
	},
	description:{
		type:String,
		default:'',
		required:'Please give a short description'
	},
	story:{
		type:String,
		default:'',
		required:'Please give a short story about the Patient'
	},
	image:{
		type:String,
		default:'',
		required:'Please Upload a picture of the Patient'
	},
	amount_needed:{
		type:Number,
		default:'',
		required:'Specify Amount Needed'
	},
	amount_collected:{
		type:Number,
		default:0,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('Patient', PatientSchema);