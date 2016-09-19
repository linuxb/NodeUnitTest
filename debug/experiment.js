const util = require('util');

exports.test = function () {
    if(__SERVER__) {
        console.log('test successful');
    }
};

