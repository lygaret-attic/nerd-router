var sys = require('sys');
var log = require('nerd-router/logger');

// matchers
var methods_re  = /(any|options|get|head|post|put|delete|trace)/i;
var wildcard_re = /^\*/;
var param_re    = /^(\()?:(\w+){(.+)}(\)?)/;

var parse = function(path) {

	// three possibilities:
	//   1. simple path component
	//   2. wildcard (only at the end)
	//   3. named parameter (with regex)

	var match;
	if (match = wildcard_re.exec(path)) {
		return {
			wildcard: true,
			name    : undefined,
			matcher : '(/.*)?'
		};
	}
	else if (match = param_re.test(path)) {
		var match = param_re.exec(path)
		return {
			wildcard: false,
			name 	: match[2],
			matcher : '/(' + match[3] + ')' + (typeof match[1] !== 'undefined' ? '?' : '')
		}
	}
	else {
		return {
			wildcard: false,
			name    : undefined,
			matcher	: '/' + path
		}
	}
};

exports.parse_config = function(config) {

	// extract the verb from the beginning of the string
	var method_match = methods_re.exec(config);
	if (method_match == null) {
		log.error("cannot parse bad config string:", config);
		return null;
	}

	var method = method_match[1].toUpperCase();

	// parse each section
	var pathstr = config.substr(method_match.index + method.length + 1);
	var paths = pathstr.split('/').filter(function (x) { return x.length > 0; });

	var matchstr = "";
	var params   = {};

	if (paths.length == 0) {
		// special case the root
		matchstr = "/";
	}
	else {
		for (var i = 0; i < paths.length; i++) {
			var result = parse(paths[i]);
			log.log("config:", config, "parsed:", result);

			if (result.wildcard) {
				if (i < (paths.length - 1)) {
					log.error("cannot have wildcard except at end of path", config);
					return null;
				}

				params['rest'] = i + 1;
			}

			if (result.name) {
				params[result.name] = i + 1;
			}

			matchstr += result.matcher;
		}
	}

	matchstr += "$";

	var matcher = new RegExp(matchstr);

	return {
		method: method,
		matcher: matcher,
		params: params
	};
};
