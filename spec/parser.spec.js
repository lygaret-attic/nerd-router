var vows    = require('vows'),
    assert  = require('assert'),
    helpers = require('./helpers'),
    parser  = require('nerd-router/parser');
	
vows.describe('Route Config Parser').addBatch({

	'a non-sensical config string': {
		topic: function() { return parser.parse_config('blah blah blah, jon, what do you think?'); },

		'should return null on parse': function(topic) {
			assert.isNull(topic);
		}
	},

	'a route config of "get /"': {
		topic: function() { return parser.parse_config('get /'); },

		'should have an http method of GET': function(topic) {
			assert.equal(topic.method, "GET");
		},

		'should match only the / route': function(topic) {
			assert.regexEqual(topic.matcher, /\/$/);
		},

		'should have no expected params': function(topic) {
			assert.length(topic.params, 0);
		}
	},

	'a route config of "post /"': {
		topic: function() { return parser.parse_config('post /'); },

		'should have an http method of POST': function(topic) {
			assert.equal(topic.method, "POST");
		}
	},

	'a route config of "any /"': {
		topic: function() { return parser.parse_config('any /'); },

		'should have a null http method property': function(topic) {
			assert.isNull(topic.method);
		}
	}

}).export(module);
