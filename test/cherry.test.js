const castle = require('../index');
const util = require('util');

console.log(util.inspect(castle));

describe('cherry',function () {
	describe('validator',function() {
		it('it should success',function() {
			castle.cherry.validator(6);
		});
	});
});