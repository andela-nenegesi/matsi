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
		type: [{
				type: String,
				enum: ['male', 'female']
			}],
		default: [''],
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
	donor:{
		type:Number,
		default:0
	},
	image:{
		type:String,
		default:'',
		required:'Please Upload a picture of the Patient'
	},
	amountNeeded:{
		type:Number,
		default: 0
	},
	amountCollected:{
		type:Number,
		default:0,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Patient', PatientSchema);
