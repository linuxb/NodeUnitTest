const fs = require('fs');

exports.downloadInfo = function (url) {
    var content = fs.readFileSync('../asynctest');
    return new Promise(function (resolve,reject) {
        setTimeout(function () {
            resolve(content);
        },1000);
    });
};