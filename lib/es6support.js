/**
 * Created by nuxeslin on 16/9/18.
 */
let obj;
let util = require('util');
const fs = require('fs');
exports.tryNewSyntax = () => {
    if (!obj) {
        let copy = {
            prop: 'copy props'
        };
        obj = {
            key: 6336,
            ...copy
        };
        let args = [0, 1, 2];
        let content = fs.readFileSync('../cherry');
        fs.writeFileSync('../cherry', content);
        (async() => {
            await(() => {
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

let raceAsyncQueue = () => {
    return new Promise((resolve) => {
        process.nextTick(() => {
            console.log('compact the IO tasks in event loop!');
            resolve();
        });
    });
};

exports.tryAsyncOperation = (async () => {
    console.log('start async timer');
    await raceAsyncQueue();
});
