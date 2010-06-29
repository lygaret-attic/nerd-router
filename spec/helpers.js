var assert = require('assert');

assert.isRegExp = function(obj, message) {
	if (!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false))) {
		assert.fail(obj, 'regexp', message || "expected {obj} to be a regexp");
	}
}

assert.regexEqual = function(r1, r2, message) {
	assert.isRegExp(r1);
	assert.isRegExp(r2);

	if (!((r1.source === r2.source) &&
		  (r1.global === r2.global) &&
		  (r1.ignoreCase === r2.ignoreCase) &&
		  (r1.multiline === r2.multiline)))
		assert.fail(r1, r2, message || "expected {r1} to be equal to {r2}", assert.regexEqual);
}
