// Invoke 'strict' JavaScript mode
'use strict';

/* Create a new 'render' controller method */
exports.render = function(req, res) {
	/* Use the 'response' object to render the 'index' view with a 'title' property */
	console.log("Here");
	res.render('index');
};