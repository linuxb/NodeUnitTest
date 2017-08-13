/**
 * Created by nuxeslin on 16/9/19.
 */

const logger = require('../lib/commons/logger');
const fs = require('fs');
const path = require('path');

// let sleeper = (timeout) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve();
//         },timeout);
//     });
// };

let recursiveCounter = 0;

let eddyCrash = () => {
    if(++recursiveCounter > 100000) return;
    logger.log('current stack phase id ==> ' + recursiveCounter);
    process.nextTick(eddyCrash);
}

// eddyCrash();
const timeOut = 10;
let horribleLoop = () => {
    //entry nextTick event invoked by Module.runMain() (within JS code stack), so the node::MakeCallback is never called util node will be exited
    process.nextTick(() => {
        logger.log('entry next tick task executed');
    });
    //check event
    setImmediate(() => {
        logger.log('end this phase of event loop');
        //but the AsyncWrap::MakeCallback invoked nextTick callback block this turn of event loop
        for (let i = 0; i < 10; i++) {
            process.nextTick(() => {
                logger.log('current stack phase id ==> ' + (++recursiveCounter));
            });
        }
    }, timeOut);
    //timer event
    setTimeout(() => {
        logger.log('timer task executed');
    }, 5);
    //poll event
    fs.readFile(path.resolve('../cherry'), (err, data) => {
        if(err) {
            logger.log(err.message);
            return;
        }
        logger.log('poll event executed ==> ' + data.toString());
    });
};

horribleLoop();

// (async () => {
//     try {
//         eddyCrash();
//     } catch (ex) {
//         logger.error(ex.message);
//     } finally {
//         logger.log('finish');
//     }
// })();