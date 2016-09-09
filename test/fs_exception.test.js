/**
 * Created by nuxeslin on 16/9/9.
 */
const should = require('should');
const muk = require('muk');
const fs = require('fs');
const castle = require('../lib/index');

const fsException = castle.fsException;

describe('fsException',function () {
    describe('#downloadInfo',function () {
        // var _readFileSync;
        before(function () {
            muk(fs,'readFileSync',function (path) {
                return 'test read file';
            });
        });
        after(function () {
            muk.restore();
        });
        it('we should get the right content of mocked file',function () {
            fsException.downloadInfo(null).should.eventually.equal('test read file');
        });
    });
});