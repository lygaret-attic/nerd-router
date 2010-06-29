Nerd Router
===========

_Super-nerdy HTTP routing for node.js_
-----------

Basically, javascript has this great ability to specify freeform strings as
attribute names in json objects, and I have seen very little in the way of
people taking advantage of this in the routing frameworks.

The goal:

	var nerdrouter = require('nerd-router');

	var routes = nerdrouter.route({

		// this means,
		//   'any'              = any HTTP method (GET, POST, PUT, DELETE, etc.)
		//   '//'               = match the full url, from the beginning, not just the path
		//   '(:lang{(en|sp).}) = named parameter, with given matching regex ((en|sp).), which is optional
		//   '*'                = continue matching
		'any ://(:lang{(en|sp).})*': {

			// nested routes are objects with further routes defined as methods.
			// they can also have default values for optional parameters, or helper
			// methods, whatever. The route functions are called in the context of
			// the route config object itself.

			// default value for optional parameter
			lang: 'en',

			'get /' : function (req, resp) {
				resp.sendBody(200, "Hello World!");
			},

			// parameter validated with named pattern @number
			'get /:id{@number}' : function(id, req, resp) {
				resp.sendBody(200, "You asked for id: " + id);
			},

			'post /:id{@number}' : function(id, req, resp) {

			},

			// ... etc
	});
