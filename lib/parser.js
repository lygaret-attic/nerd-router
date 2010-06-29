var methods = /(any|options|get|head|post|put|delete|trace|head)/i;

exports.parse_config = function(config) {
	
	var method_match = methods.exec(config);
	if (method_match == null) 
		return null;

	var method = method_match[1] == "any" ? null : method_match[1].toUpperCase();

	return {
		method: method,
		matcher: /\/$/,
		params: []
	};
};
