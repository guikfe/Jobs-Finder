var request = require('request');
var Job = require('../models/job.js');
var gitRes;

exports.start = function() {
	request({ url:'https://jobs.github.com/positions.json', qs: {  }, json: {} }, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    gitRes = body;
	    get();
	    console.log('ready');
	  }
	});
}

// Get the jobs posted 24 hours past
var get = function() {
	var gitJob;
	var jobDate;
	var jobsToInsert = [];
	var yesterday = new Date();
	yesterday = new Date(yesterday - 86400000*24);

	for (var i=0; i<gitRes.length; i++) {
		gitJob = gitRes[i];
		jobDate = new Date(gitJob.created_at);

		if (jobDate.getTime() > yesterday.getTime() && gitJob.location) {
			jobsToInsert.push(gitJob);
		}
	}

	saveToDB(jobsToInsert);
}

var defineCategory = function(title) {
	if (/\w*dev\w*|\w*end|progra\w*|software/i.test(title)) {
		return 'programming';
	} else if (/design\w*|ui/i.test(title)) {
		return 'design';
	} else if (/business|exec|manager/i.test(title)) {
		return 'business';
	} else if (/support/i.test(title)) {
		return 'support';
	} else {
		return 'misc';
	}
}

var extractJob = function(githubJob) {
	var job = {};
	job.startupname = githubJob.company;
	job.title = githubJob.title;
	job.siteurl = githubJob.company_url;
	job.infourl = githubJob.url;
	job.added = new Date();
	job.from = 'github';
	job.expired = false;

	request({ url:'http://api.tiles.mapbox.com/v3/examples.map-vyofok3q/geocode/' + githubJob.location + '.json' }, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    body = JSON.parse(body);

	    if (body.results.length == 0) {
	  		console.log('Location error:', githubJob.location);
	  		return undefined;
	    }

		job.category = defineCategory(githubJob.title);
	    job.lat = body.results[0][0].lat;
	    job.lon = body.results[0][0].lon;


	    saveJob(job);
	  } else {
	  	console.log('Location error:', githubJob.location);
	  }
	});
}

var saveToDB = function(jobs) {
	for (var i=0; i<jobs.length; i++) {
		var job = extractJob(jobs[i]);
	}
}

var saveJob = function(job) {
	    console.log(job);
	Job.findOneAndUpdate({ infourl: job.infourl}, job, { upsert: true }, function(err) {
		if(err) {
			console.log('error trying to save job', job);
		} else {
			console.log('job saved with success');
		}
	});
}