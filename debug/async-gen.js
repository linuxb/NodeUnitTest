/**
 * Created by nuxeslin on 16/9/19.
 */
// require('babel-core/register');
// require('babel-polyfill');

const logger = require('../lib/commons/logger');

let sleeper = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },timeout);
    });
};

(async () => {
    try {
        logger.log('start to timer sleeping');
        await sleeper(3000);
        logger.log('stop');
    } catch (ex) {
        logger.error(ex.message);
    } finally {
        logger.log('finish');
    }
})();