
var registry = {};

exports.get = function(name) {
	return registry[name] || null;
}

exports.add = function(name, pattern) {
	registry[name] = pattern;
}

exports.add('number', '\\d+');
exports.add('slug', '\\w[\\w-_]*');
exports.add('year', '\\d{4}');
exports.add('month','01|02|03|04|05|06|07|08|09|10|11|12');
exports.add('day', '(?:[012]\\d)|(?:3\\d)');
