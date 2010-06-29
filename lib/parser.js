var sys = require('sys');

var methods = /(any|options|get|head|post|put|delete|trace)/i;

exports.parse_config = function(config) {
	
	var method_match = methods.exec(config);
	if (method_match == null) 
		return null;

	var method = method_match[1].toUpperCase();

	var matchstr = "";
	var pathstr = config.substr(method_match.index + method.length + 1);
	var paths = pathstr.split('/').filter(function (x) { return x.length > 0; });

	if (paths.length == 0) {
		// special case the root
		matchstr = "/";
	}
	else {
		for (var i = 0; i < paths.length; i++) {
			var path = paths[i];
			
			// wildcards can only exist as the last path token
			if (path === "*" && (i + 1) < paths.length) {
				return null;
			}
			else if (path === "*") {
				matchstr += "(/.*)";
				continue;		
			}

			matchstr += "/" + path;
		}
	}

	matchstr += "$";

	var matcher = new RegExp(matchstr);

	return {
		method: method,
		matcher: matcher,
		params: []
	};
};
