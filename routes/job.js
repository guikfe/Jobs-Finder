var Job = require('../models/job.js');

exports.save = function(req, res) {
	req.body.expired = false;
	req.body.added = new Date();

	console.log(req.body);

	new Job(req.body).save(function(err) {
		if(err) {
			res.send(507);
		} else {
			res.send(200);
		}
	});
}

exports.findAll = function(req, res) {
	Job.find({expired: false}, function(err, jobs) {
		if (err) {
			res.send(500);
		} else {
			res.send(jobs);
		}
	})
}