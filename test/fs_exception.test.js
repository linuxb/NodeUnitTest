/**
 * Created by nuxeslin on 16/9/9.
 */
const should = require('should');
const muk = require('muk');
const fs = require('fs');
const castle = require('../lib/index');
//nock for express request mocking
// const nock = require('nock');
const util = require('util');
const sinon = require('sinon');


const fsException = castle.fsException;

describe('fsException',function () {
    describe('#downloadInfo',function () {
        // var _readFileSync;
        before(function () {
            sinon.stub(fs,'readFile').yields(new Error('test error'));
        });
        after(function () {
            fs.readFile.restore();
        });
        it('we should get the right content of mocked file',function () {
            fsException.downloadInfo(null).should.eventually.equal('test read file');
        });
        it('it should be rejected when a error occurs',function () {
            fsException.downloadInfo(null).should.be.rejected;
        });
    });
});