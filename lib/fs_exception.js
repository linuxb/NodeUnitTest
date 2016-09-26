const fs = require('fs');

exports.downloadInfo = function(url) {
    return new Promise((resolve, reject) => {
        if(url === null) reject(new Error('url not allow null'));
        fs.readFile('../cherry',(err,content) => {
            if (err) return reject(err);
            setTimeout(() => {
                resolve(content);
            },1000);
        });
    });
};
