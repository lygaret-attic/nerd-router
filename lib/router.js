var http        = require('http'),
    url         = require('url'),
	logger      = require('nerdrouter/logger'),
    parser      = require('nerdrouter/parser');

exports.route = function(config) {
	return new Router(config);
}

////////////////////////////////////////// ROUTER CLASS ///////////////////////

// constructor
var Router = function Router(config) {

	// for each key in the config
	//   if the value is a function, it's a direct route, so add it that way
	//   if the value if an object, the handler is a new router

	this.routes = [];
	
	for (routeDesc in config) {
		var route   = parser.parse_config(routeDesc);
		var handler = config[routeDesc];
		this.routes.push(new Route(route, handler));
	}
};

Router.prototype.handle = function(context) {

	// loop through the routes, checking for a match. 
	for(var i = 0; i < this.routes.length; i++) {
		if (!this.routes[i].matches(context.request.method, context.path)) {
			continue;
		}

		// matched a route, set up params
		var route = this.routes[i];
		var params = route.getParams(context.path);

		// add any additional arguments to the param list
		// (from the second to the last, in reverse order)
		var origargs = Array.prototype.slice.call(arguments);
		origargs.slice(1).reverse().forEach(function (x) { params.unshift(x); });

		// fix the context object and add to the params
		var origpath = context.path;
		context.path = route.getContPath(context.path);
		params.unshift(context);

		// call the handler with all the parameters
		var handled = route.handler.apply(route, params);
		if (handled === false) {
			context.path = origpath
			continue;
		}

		// don't try to match anymore
		return true;
	}

	return false;
}

////////////////////////////////////////// ROUTE CLASS ////////////////////////

var Route = function Route(route, handler) {
	this.route = route;

	var handlerType = typeof handler;
	switch(handlerType) {
		case 'function':
			this.handler = handler;
			break;
		case 'object':
			var subrouter = new Router(handler);
			this.handler = function() {
				var args = Array.prototype.slice.call(arguments);
				return Router.prototype.handle.apply(subrouter, args);
			}
			break;
		default:
			logger.error("Bad handler!");
	}
};

Route.prototype.matches = function(method, path) {
	var match = true;
	match &= (this.route.method === method || this.route.method === "ANY")
	match &= (this.route.matcher.test(path)) 
	return match;
};

Route.prototype.getContPath = function(path) {
	if (typeof this.route.params.rest !== 'undefined') {
		var match = this.route.matcher.exec(path);
		var rest = match[this.route.params.rest] || "/";
		return rest;
	}

	return path;
};

Route.prototype.getParams = function(path) {
	var match = this.route.matcher.exec(path);
	var params = [];

	for (var p in this.route.params) {
		if (p !== 'rest')
			params.push(match[this.route.params[p]]);
	}

	return params;
};
