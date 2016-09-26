/**
 * Created by nuxeslin on 16/9/12.
 */
const sinon = require('../lib/sinon-async/sinon');
// const sinon = require('sinon');
const fs = require('fs');

/*
* 如果mock的目标含有闭包,引用外层的作用域,mock后的函数引用已经
* 切换了父级作用域,无法引用原来的对象,导致promise无法resolve
* */

let callCount = 0;

function invokePromiseContextify() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            fs.readFile('../cherry',(err,data) => {
                if(err) return reject(err);
                console.log(`callback call at ${++callCount} times`);
                resolve(data);
            });
        },500);
    });
};

const executor = (async() => {
    let res = await invokePromiseContextify();
    //this promise will be fulfilled with res
    console.log('promise fulfilled successful ! ');
    return res;
});

let stubProxy = sinon.stub(fs, 'readFile');
//采用异步的回调注入,调用同步的nextTick,插入event loop,在IO loop之前执行,v8工作线程添加到任务队列,主线程消费
stubProxy.yields(null,'test async file').setAsyncHook((args) => {
    console.log(args);
},{ timeout: 5000} ).yieldsAsyncWithHook(null,'hook invoked');
executor().then((res) => {
    console.log(res.toString());
    //避免函数引用竞争
    fs.readFile.restore();
}, reason => {
    console.log(reason.message);
    fs.readFile.restore();
}).catch((ex) => {
    console.error(ex.message);
});
