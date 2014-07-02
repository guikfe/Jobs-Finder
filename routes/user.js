var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = '78a09c27ed1b66a5487209f5951fef9f-us7';

try {
    var chimpApi = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

chimpApi.call('campaigns', 'list', { start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.subscribe = function(req, res){
	console.log(req.body);
	res.json(200);
};