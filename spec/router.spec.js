var vows    = require('vows'),
    assert  = require('assert'),
    helpers = require('./helpers'),
	logger  = require('nerdrouter/logger'),
	events  = require('events'),
    nerdrouter  = require('nerdrouter');

var router = nerdrouter.route({
	'get /': function(context) {
		context.response = 'homepage';
	},

	'get /:num{\\d+}': function(context, num) {
		context.response = num;
	},

	'get /:foo{\\d+}/:bar{\\d+}': function(context, foo, bar) {
		context.response = [foo, bar];
	},

	'any /wild/*': {
		'get /foo': function(context) {
			context.response = 'wildfoo';
		},

		'get /:num{\\d+}': function(context, num) {
			context.response = num
		}
	},

	'any /:first{\\w+}/*': {
		'get /:second{\\w+}': function(context, first, second) {
			context.response = [first, second];
		}
	}
});

var runrouter = function(path, method) {
	return function() {
		if (typeof method === 'undefined')
			method = "GET";

		var response = {};
		var context = {
			path    : path,
			request : {method: method},
			response: response
		};

		router.handle(context);
		return context.response;
	}
}

vows.describe('router sanity').addBatch({

	'a simple router': {
		topic: runrouter('/'),

		'should call the handler': function(result) {
			assert.isTrue(true);
		}
	}

}).export(module);

vows.describe('router params').addBatch({

	'a router with a single parameter': {
		topic: runrouter('/12345'),

		'should collect the param': function(result) {
			assert.equal(result, '12345');
		}
	},

	'a router with multiple parameters': {
		topic: runrouter('/12345/98765'),

		'should collect them both': function(result) {
			assert.deepEqual(result, ['12345', '98765']);
		}
	}

}).export(module);

vows.describe('nested routers').addBatch({

	'a nested router with no params': {
		topic: runrouter('/wild/foo'),

		'should match': function(result) {
			assert.equal(result, 'wildfoo');
		}
	},

	'a nested router with a second level param' : {
		topic: runrouter('/wild/12345'),

		'should collect the param': function(result) {
			assert.equal(result, '12345');
		}
	},

	'a nested router with two levels of params' : {
		topic: runrouter('/first/second'),

		'should collect all the params': function(result) {
			assert.deepEqual(result, ['first', 'second']);
		}
	}

}).export(module);
