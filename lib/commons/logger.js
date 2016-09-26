/**
 * Created by nuxeslin on 16/9/22.
 */
const winston = require('winston');
const path = require('path');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: path.resolve('../logs/runtime.log') })
    ]
});

logger.log = console.log;

module.exports = logger;