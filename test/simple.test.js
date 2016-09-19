/**
 * Created by nuxeslin on 16/9/8.
 */

//导入断言库,这里我们用chai的should断言
//导入待测试的模块
const should = require('should');
const simple = require('../lib/simple');
// const util = require('util');
// console.log(util.inspect(simple));

// test/simple.test.js
//描述块: 描述模块
describe('simple',function () {
    //描述块: 描述模块中的接口
    describe('#validate',function () {
        //这里写测试用例
        it('it should return 10',function () {
            //断言
            simple.validate(10).should.be.equal(10);
        });
    });
});
