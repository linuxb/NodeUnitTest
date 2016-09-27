/**
 * Created by nuxeslin on 16/9/9.
 */
const should = require('should');
const fs = require('fs');
const castle = require('../lib/index');
const util = require('util');
const sinon = require('../deps/sinon-async/sinon');


const fsException = castle.fsException;

describe('fsException',function () {
    describe('#downloadInfo',function () {
        before(() => {
            sinon.stub(fs,'readFile').yields(null,'test read file').setBeforeCallbackHook(() => {
                //do anything else
            },{ timeout: 2000 }).yieldsBeforeCallbackHook();
        });
        after(() => {
            fs.readFile.restore();
        });
        it('we should get the right content of mocked file',function () {
            return fsException.downloadInfo('').should.eventually.equal('test read file');
        });
        it('it should be rejected when a error occurs',function () {
            return fsException.downloadInfo(null).should.be.rejected();
        });
    });
});