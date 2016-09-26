/**
 * Created by nuxeslin on 16/9/21.
 */
import 'util';
import 'fs';
import {config} from '../config/config';
const logger = require('./commons/logger');

export default class AsyncBase {

    constructor(props) {
        if(props) {
            logger.log(props.nWatchers);
        }
    }

    pumpTimeout() {
        return (async () => {
            await (() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        logger.log('timer in promise invoke ! ');
                        resolve(config.resolveMessage);
                    },3000);
                });
            })();
        })();
    }

    pumpAsyncTimer() {
        return (async () => {
            let res = await (() => {
                return new Promise((resolve) => {
                    process.nextTick(() => {
                        logger.log('start async timer in this class');
                        // resolve('resolve runner');
                        resolve(null);
                    });
                });
            })();
            return res;
        })();
    }
}