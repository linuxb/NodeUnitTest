const util = require('util');
const castle = require('../index');
const should = require('should');



describe('async',function() {
	describe('query',function() {
		it('promise should be resolve',function(done) {
			castle.async.query('select * from t_test where id = "0"',function(result,err) {
				should(result).be.exactly('success result!');
				if(err) done(new Error(err));
				else done();
			});
		});
	});
});