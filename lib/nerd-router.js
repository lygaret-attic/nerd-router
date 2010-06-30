var http        = require('http'),
    url         = require('url'),
	logger      = require('nerd-router/logger'),
    parser      = require('nerd-router/parser');

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

		if (typeof handler === 'object') {
			var subrouter = new Router(handler);
			handler = function(path, req, resp) {
				subrouter.handle.apply(subrouter, arguments);
			};
		}
		else if (typeof handler !== 'function') {
			logger.error('must specify nested routes or a handler', config);
			return null;
		}

		this.routes.push(new Route(route, handler));
	}

};

Router.prototype.handle = function(path, req, resp) {

	// loop through the routes, checking for a match. 
	// on a match, pull the arguments, and apply everything

	for (var i = 0; i < this.routes.length; i++) {
		if (!this.routes[i].matches(req.method, path)) {
			continue;
		}

		var route = this.routes[i];
		var params = route.getParams(path);

		for(var j = arguments.length - 1; j > 0; j--) {
			params.unshift(arguments[j]);
		}

		params.unshift(route.getContPath(path));

		route.handler.apply(route, params);

		break;
	}

}

////////////////////////////////////////// ROUTE CLASS ////////////////////////

var Route = function Route(route, handler) {
	this.route = route;
	this.handler = handler;
};

Route.prototype.matches = function(method, path) {
	var match = true;
	match &= (this.route.method === method)
	match &= (this.route.matcher.test(path)) 
	return match;
}

Route.prototype.getContPath = function(path) {
	if (typeof this.route.params.rest !== 'undefined') {
		var match = this.route.matcher.exec(path);
		return match[this.route.params.rest];
	}

	return path;
}

Route.prototype.getParams = function(path) {
	var match = this.route.matcher.exec(path);
	var params = [];

	for (p in this.route.params) {
		if (p !== 'rest')
			params.push(match[this.route.params[p]]);
	}

	return params;
}
