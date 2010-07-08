// example blog router

var routes = require('nerdrouter').route({

	'any /blog/*': {

		'get /': function(context) {
			context.response.writeHead(200, {'content-type': 'text/plain'});
			context.response.end("blog home");
		},

		'get /tags': function(context) {
			context.response.writeHead(200, {'content-type': 'text/plain'});
			context.response.end("all tags");
		},

		// sub paths can be regular regex 

		'get /tags/:tag{@slug}': function(context, tag) {
			context.response.writeHead(200, {'content-type': 'text/plain'});
			context.response.end("tag: '" + tag + "' index");
		},

		// or if the structure is easier, they can be nested

		'get /:year{@year}/*': {
			'get /': function(context, year) {
				context.response.writeHead(200, {'content-type': 'text/plain'});
				context.response.end(year + " index");
			},

			'get /:month{@month}/*': {
				'get /': function(context, year, month) {
					context.response.writeHead(200, {'content-type': 'text/plain'});
					context.response.end(month + "/" + year + " index");
				},

				'get /:day{@day}/*': {
					'get /': function(context, year, month, day) {
						context.response.writeHead(200, {'content-type': 'text/plain'});
						context.response.end(month + "/" + day + "/" + year + " index");
					},

					'get /:slug{@slug}': function(context, year, month, day, slug) {
						context.response.writeHead(200, {'content-type': 'text/plain'});
						context.response.end("individual post for: " + month + "/" + day + "/" + year + ", " + slug);
					}
				}
			}
		}
	},

	// the last match should be a wildcard to catch 404s

	'get *': function(context) {
		context.response.writeHead(200, {'content-type': 'text/plain'});
		context.response.end('Nothing matched; this should be a 404');
	}
});

var url = require('url');
require('http').createServer(function(req, res) {
	var context = {
		path: url.parse(req.url).pathname,
		request: req,
		response: res
	};

	routes.handle(context);
}).listen(8124);


