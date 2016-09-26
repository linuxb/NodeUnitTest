exports.validator = function(arg) {
	if (typeof arg !== 'number') throw new TypeError('test type error');
	if (arg < 0) return 0;
	return arg;
};
