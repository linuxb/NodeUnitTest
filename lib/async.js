'use strict';
const util = require('util');

exports.query = function(sql, callback) {
	setTimeout(function() {
		callback.apply(this, ['success result!']);
	},1000);
};

exports.queryPromisify = function(sql) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve.apply(this, 'success test promise'), 1000);
	});
};

exports.then = function() {

};

