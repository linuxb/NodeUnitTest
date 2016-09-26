/**
 * Created by nuxeslin on 16/9/19.
 */
const util = require('util');
const fs = require('fs');
const path = require('path');

const experimentPath = path.resolve('/Users/nuxeslin/dev/proxy/webapp/cherryPipe/cherry');
fs.readFile(experimentPath,function (err,data) {
    if(err) {
        console.error(err.message);
        return;
    }
    console.log(data.toString());
});

exports.invoke = function () {
    process.nextTick(function () {
        console.log('finish this event loop phase');
    });
}();