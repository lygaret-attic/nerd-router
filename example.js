var http        = require('http'),
	url         = require('url'),
	nerdrouter  = require('nerd-router'),
	logger      = require('nerd-router/logger');

var router = nerdrouter.route({

	'get /': function(path, req, resp) {
		resp.writeHeader(200, {'Content-Type': 'text/plain'});
		resp.end("You got the home page\n");
	},

	'get /jon/*': {
	
		'get /': function(path, req, resp) {
			resp.writeHeader(200, {'Content-Type': 'text/plain'});
			resp.end("You got jon's home page\n");
		},

		'get /:name{@slug}': function(path, req, resp, slug) {
			resp.writeHeader(200, {'Content-Type': 'text/plain'});
			resp.end("Jon says: 'Hi, " + slug + "!'\n");
		}
	},

	'get /:year{@year}/:month{@month}/:day{@day}': function(path, req, resp, year, month, day) {
		resp.writeHeader(200, {'Content-Type': 'text/plain'});
		resp.end("It was " + month + "/" + day + "/" + year + ", the worst day ever.\n");	
	},

	'get *': function(path, req, resp) {
		resp.writeHeader(404, {'Content-Type': 'text/plain'});
		resp.end("'" + path + "' was not found. 404.\n");
	}

});

http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	router.handle(path, req, res);
}).listen(8124);

logger.log("Listening at http://localhost:8124");
