var vows    = require('vows'),
    assert  = require('assert'),
    helpers = require('./helpers'),
	logger  = require('nerdrouter/logger');
    parser  = require('nerdrouter/parser');

var api = {
	parse: function (str) {
		return function() {
			return parser.parse_config(str);
		};
	}
};

vows.describe('parse sanity').addBatch({

	'an empty config string': {	
		topic: api.parse(''),

		'should return null on parse': function(topic) {
			assert.isNull(topic);
		}
	},

	'a non-sensical config string': {
		topic: api.parse('blah blah blah'),

		'should return null on parse': function(topic) {
			assert.isNull(topic);
		}
	}

}).export(module);

	
vows.describe('http methods').addBatch({

	'a route config of "options /"': {
		topic: api.parse('options /'),
		'should have an http method of OPTIONS': function (topic) {
			assert.equal(topic.method, 'OPTIONS');
		}
	},

	'a route config of "get /"': {
		topic: api.parse('get /'),
		'should have an http method of GET': function (topic) {
			assert.equal(topic.method, 'GET');
		}
	},

	'a route config of "head /"': {
		topic: api.parse('head /'),
		'should have an http method of HEAD': function (topic) {
			assert.equal(topic.method, 'HEAD');
		}
	},

	'a route config of "post /"': {
		topic: api.parse('post /'),
		'should have an http method of POST': function(topic) {
			assert.equal(topic.method, "POST");
		}
	},

	'a route config of "put /"': {
		topic: api.parse('put /'),
		'should have an http method of PUT': function (topic) {
			assert.equal(topic.method, 'PUT');
		}
	},

	'a route config of "delete /"': {
		topic: api.parse('delete /'),
		'should have an http method of DELETE': function (topic) {
			assert.equal(topic.method, 'DELETE');
		}
	},

	'a route config of "trace /"': {
		topic: api.parse('trace /'),
		'should have an http method of TRACE': function(topic) {
			assert.equal(topic.method, "TRACE");
		}
	},

	'a route config of "any /"': {
		topic: api.parse('any /'),
		'should have an http method of ANY': function(topic) {
			assert.equal(topic.method, "ANY");
		}
	},

	'a route config of "unknown /"': {
		topic: api.parse('unknown /'),
		'should return null on parse': function(topic) {
			assert.isNull(topic);
		}
	}

}).export(module);

vows.describe('path parsing').addBatch({
	
	'a route config of "get /"': {
		topic: api.parse('get /'),
		'should only match the root': function(topic) {
			assert.isTrue(topic.matcher.test('/'));
			assert.isFalse(topic.matcher.test(''));
			assert.isFalse(topic.matcher.test('/blah'));
		}
	},

	'a route config of "get /one"': {
		topic: api.parse('get /one'),
		'should only match the path /one': function(topic) {
			assert.isTrue(topic.matcher.test('/one'));
			assert.isFalse(topic.matcher.test('/'));
			assert.isFalse(topic.matcher.test('/one/two'));
		}
	},

	'a route config of "get /one/two"': {
		topic: api.parse('get /one/two'),
		'should only match the path /one/two': function(topic) {
			assert.isTrue(topic.matcher.test('/one/two'));
			assert.isFalse(topic.matcher.test('/one'));
			assert.isFalse(topic.matcher.test('/'));
		}
	},

	'a route config of "get /one/*"': {
		topic: api.parse('get /one/*'),
		'should only match paths starting in /one': function(topic) {
			assert.isFalse(topic.matcher.test('/'));
		},
		'should match any path starting in /one/whatever': function(topic) {
			assert.isTrue(topic.matcher.test('/one/'));
			assert.isTrue(topic.matcher.test('/one/two'));
			assert.isTrue(topic.matcher.test('/one/two/three'));
		},
		'should capture any path after /one in the last regex capture': function(topic) { 
			var match = topic.matcher.exec('/one/two/three');
			assert.equal(match.slice(-1)[0], '/two/three');
		}
	}

}).export(module);

vows.describe('parameter parsing').addBatch({

	'a route config of "get /:id{\\d{2}}"': {
		topic: api.parse('get /:id{\\d{2}}'),

		'should match paths of two numbers (/21, /34, /48)': function(topic) {
			assert.isTrue(topic.matcher.test('/21'));
			assert.isTrue(topic.matcher.test('/34'));
			assert.isTrue(topic.matcher.test('/76'));
		},

		'should not match paths of single numbers (/2)': function(topic) {
			assert.isFalse(topic.matcher.test('/2'));
		}
	},

	'a route config with multiple parts': {
		topic: api.parse('get /:name{\\w+}/:id{\\d+}'),

		'should match valid paths': function(topic) {
			assert.isTrue(topic.matcher.test('/jon/324'));
		},

		'should not match invalid paths': function(topic) {
			assert.isFalse(topic.matcher.test('/jon/iscool'));
		},

		'should not match partial paths': function(topic) {
			assert.isFalse(topic.matcher.test('/jon'));
		}
	},

	'a route config with multiple parts and a wildcard': {
		topic: api.parse('get /:name{\\w{2}}/:id{\\d+}/*'),

		'should match any valid path': function(topic) {
			assert.isTrue(topic.matcher.test('/en/4/blah/blah/blah'));
			assert.isTrue(topic.matcher.test('/ru/3'));
		}
	},

	'a route with named validators': {
		topic: api.parse('get /:year{@year}/:month{@month}/:day{@day}/:slug{@slug}'),

		'should match a valid path as expected': function(topic) {
			assert.isTrue(topic.matcher.test('/2010/06/03/slugs-are-awesome'));
		},

		'should not match an invalid path': function(topic) {
			assert.isFalse(topic.matcher.test('/2010/06/blah'));
		},
	},

	'a route with named sections': {
		topic: api.parse('get /:year{@year}/:slug{@slug}'),

		'should handle retrieving the names': function(topic) {
			var match = topic.matcher.exec('/2010/jon-is-awesome');
			assert.equal(match[topic.params.year], '2010');
			assert.equal(match[topic.params.slug], 'jon-is-awesome');
		}
	}
}).export(module);
