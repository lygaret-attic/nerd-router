var vows    = require('vows'),
    assert  = require('assert'),
    helpers = require('./helpers'),
    parser  = require('nerd-router/parser');

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
