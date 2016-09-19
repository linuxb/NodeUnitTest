/**
 * Created by nuxeslin on 16/9/18.
 */
let obj;
let util = require('util');
const fs = require('fs');
exports.tryNewSyntax = () => {
    if(!obj) {
        let copy = {
            prop: 'copy props'
        };
        obj = {
            key: 6336,
            ...copy
        };
        let args = [0,1,2];
        let content = fs.readFileSync('../asynctest');
        fs.writeFileSync('../asynctest',content);
        (async () => {
            await (() => {
                return new Promise((resolve) => {
                    setImmediate(() => {
                        console.log('sleeper');
                        resolve();
                    },1000);
                });
            })();
            return [...args,6];
        })();
    }
    // return null;
};

let sleep = (timeout) => {
    return new Promise((resolve) => {
        setImmediate(() => {
            console.log('timer invoked');
            resolve();
        },timeout);
    });
};

exports.tryAsyncOperation = (async () => {
    console.log('start async timer');
    await sleep(1000);
});