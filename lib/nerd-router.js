var http        = require('http'),
    url         = require('url'),
    parser      = require('nerd-router/parser');

exports.route = function(config) {
	return new Router(config);
}

////////////////////////////////////////// ROUTER CLASS ///////////////////////

// constructor
var Router = function Router(config) {
};

// extend http.Server
Router.prototype = (function() {
	var Server = function() {};
	Server.prototype = http.Server.prototype;
	return new Server();
})();
Router.prototype.constructor = Router;

////////////////////////////////////////// ROUTE CLASS ////////////////////////

var Route = function Route(config, handler) {
};

