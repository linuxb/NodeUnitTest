const fs = require('fs');

exports.downloadInfo = function (url) {
    // var content = fs.readFileSync('../asynctest');
    return new Promise(function (resolve,reject) {
        fs.readFile('../asynctest',function (err) {
            if(err) return reject(err);
            setTimeout(function () {
                resolve(content);
            },1000);
        });
    });
};