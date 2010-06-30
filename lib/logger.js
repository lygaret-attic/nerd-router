var eyes = require('eyes').inspector({ stream: null });
var sys  = require('sys');

exports.inspect = function inspect(val) {
	return '\033[1m' + eyes(val) + '\033[22m';
};

exports.log = function log(str) {
	if (arguments.length > 1)
		for (var i = 1; i < arguments.length; i++)
			str += " " + eyes(arguments[i]);

	sys.puts('» ' + str);
};

exports.error = function error(str) {
	if (arguments.length > 1)
		for (var i = 1; i < arguments.length; i++)
			str += " " + eyes(arguments[i]);

	sys.puts('✗ ' + str);
};
