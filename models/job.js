var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
	startupname: String,
	category: String,
	title: String,
	siteurl: String,
	infourl: String,
	contact: String,
	weare: String,
	wewant: String,
	lat: String,
	lon: String,
	expired: Boolean,
	added: Date,
	from: String
});

module.exports = mongoose.model('Job', jobSchema);