/**
 * Created by nuxeslin on 16/9/8.
 */
const should = require('should');
const util = require('util');
const castle = require('../index');

const db = castle.db;


describe('db',function () {
    describe('find user in db',function () {
        //register async hooks for db
        before(function (done) {
            console.log('hooks are invoked');
            // return db.save(['ryan','john','cherry']);
            db.save(['ryan','cherry']).then(function (res) {
                done();
            },function (err) {
                done(err);
            });
        });
        after(function (done) {
            console.log('release our hooks');
            db.clear().then(function (res) {
                done();
            },function (err) {
                done(err);
            });
        });
        it('promise should be resolved',function () {
            return db.find('ryan').should.eventually.equal('ryan');
        });
        //this case test reject promise type error
        it('promise will be rejected : type error',function () {
            return db.find(null).should.be.rejected();
        });
        it('promise will be rejected: not exist user',function () {
            return db.find('none').should.be.rejected();
        });
    });
});