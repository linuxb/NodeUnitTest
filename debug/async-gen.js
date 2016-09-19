/**
 * Created by nuxeslin on 16/9/19.
 */
// require('babel-core/register');
// require('babel-polyfill');

let sleeper = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },timeout);
    });
};

(async () => {
    try {
        console.log('start to timer sleeping');
        await sleeper(3000);
        console.log('stop');
    } catch (ex) {
        console.error(ex.message);
    } finally {
        console.log('finish');
    }
})();