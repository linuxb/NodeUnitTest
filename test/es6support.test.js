/**
 * Created by nuxeslin on 16/9/18.
 */
const util = require('util');
const should = require('should');
const sinon = require('sinon');
const fs = require('fs');

describe('es6-support',function () {
    describe('#tryNewSyntax',function () {

        before(() => {
            sinon.stub(fs,'readFileSync',() => {
                console.log('stub new read api');
            });
            sinon.stub(fs,'writeFileSync',() => {
                console.log('stub new write api');
            });
        });

        after(() => {
            fs.readFileSync.restore();
            fs.writeFileSync.restore();
        });

        const support = require('../lib/es6support');
        it('it should be transform successful', () => {
            support.tryNewSyntax();
        });
        it('generator should be invoked',() => {
            support.tryAsyncOperation();
        });
    });
});