/**
 * Created by nuxeslin on 16/9/18.
 */

const fs = require('fs');
const path = require('path');

exports.inject = function () {
    const experimentPath = path.resolve('./experiment.js');
    var content = fs.readFileSync(experimentPath);
    var wrappedContent = 'const __SERVER__ = true;\n' + content;
    //write
    fs.writeFileSync(experimentPath, wrappedContent);
    //restore
    return function () {
        delete wrappedContent;
        fs.writeFileSync(experimentPath,content);
    };
};


