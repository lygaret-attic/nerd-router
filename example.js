var http        = require('http'),
	url         = require('url'),
	nerdrouter  = require('nerdrouter'),
	logger      = require('nerdrouter/logger');

var router = nerdrouter.route({

	'get /': function(path, req, resp) {
		resp.writeHead(200, {'Content-Type': 'text/plain'});
		resp.end("You got the home page\n");
	},

	'get /:num{\\d{1,3}}/': function(path, req, resp, num) {
		resp.writeHead(200, {'Content-Type': 'text/plain'});
		resp.end("You asked for item #" + num);
	},

	'get /jon/*': {
	
		'get /': function(path, req, resp) {
			resp.writeHead(200, {'Content-Type': 'text/plain'});
			resp.end("You got jon's home page\n");
		},

		'get /:name{@slug}': function(path, req, resp, slug) {
			resp.writeHead(200, {'Content-Type': 'text/plain'});
			resp.end("Jon says: 'Hi, " + slug + "!'\n");
		}
	},

	'get /:year{@year}/:month{@month}/:day{@day}': function(path, req, resp, year, month, day) {
		resp.writeHead(200, {'Content-Type': 'text/plain'});
		resp.end("It was " + month + "/" + day + "/" + year + ", the worst day ever.\n");	
	},

	'get *': function(path, req, resp) {
		resp.writeHead(404, {'Content-Type': 'text/plain'});
		resp.end("'" + path + "' was not found. 404.\n");
	}

});

http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	router.handle(path, req, res);
}).listen(8124);

logger.log("Listening at http://localhost:8124");
