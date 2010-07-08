Nerd Router
===========
_Super-nerdy HTTP routing for node.js_
-----------

Basically, javascript has this great ability to specify freeform strings as
attribute names in json objects, and I have seen very little in the way of
people taking advantage of this in the routing frameworks.

Example:


	var routes = require('nerdrouter').route({

		// a route spec is:
		//   1. an HTTP verb, or the word 'any' to match any verb
		//   2. a path consisting of one or more components,
		//     i. a simple url piece
		//     ii. a named parameter, with a regex or named pattern
		//     iii. or a wildcard, which must go last, and resets the context.path var

		// example blog router
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


Test the example by hitting the urls:

http://localhost:8124/blog/tags/awesome and
http://localhost:8124/2010/07/04/fireworks

Wishlist
--------

 1. support matching full urls, so we can do subdomain stuff
 2. support optional chunks in urls and default values
 3. support data converters in the named parameters
 4. ?

