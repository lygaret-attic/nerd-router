var http        = require('http'),
    url         = require('url'),
    nerdrouter  = require('nerdrouter'),
    logger      = require('nerdrouter/logger');

var router = nerdrouter.route({

	'get /': function(context) {
		context.response.writeHead(200, {'Content-Type': 'text/plain'});
		context.response.end("You got the home page\n");
	},

	'get /:add1{\\d{1,3}}/*': {
		'get /:add2{\\d{1,3}}/': function(context, num1, num2) {
			num1 = parseInt(num1);
			num2 = parseInt(num2);

			context.response.writeHead(200, {'Content-Type': 'text/plain'});
			context.response.end("You asked for " + num1 + "+" + num2 + " = " + (num1 + num2));
		}
	},

	'get /jon/*': {
		'get /': function(context) {
			context.response.writeHead(200, {'Content-Type': 'text/plain'});
			context.response.end("You got Jon's home page\n");
		},

		'get /:name{@slug}': function(context, slug) {
			context.response.writeHead(200, {'Content-Type': 'text/plain'});
			context.response.end("Jon says: 'Hi, " + slug + "!'\n");
		},

		'get /:id{@number}/*': {
			'get /:name{@slug}': function(context, id, slug) {
				context.response.writeHead(200, {'Content-Type': 'text/plain'});
				context.response.end("ID: " + id + ", Slug: " + slug + "\n");
			}
		}
	},

	'get /:year{@year}/:month{@month}/:day{@day}': function(context, year, month, day) {
		context.response.writeHead(200, {'Content-Type': 'text/plain'});
		context.response.end("It was " + month + "/" + day + "/" + year + ", the worst day ever.\n");	
	},

	'get *': function(context) {
		context.response.writeHead(200, {'Content-Type': 'text/plain'});
		context.response.end("'" + context.path + "' was not found. 404.\n");
	}

});

http.createServer(function(req, res) {
	var context = {
		path: url.parse(req.url).pathname,
		request: req,
		response: res
	};
	router.handle(context);
}).listen(8124);

logger.log("Listening at http://localhost:8124");
