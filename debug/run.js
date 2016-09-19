/**
 * Created by nuxeslin on 16/9/18.
 */
const injector = require('./injector');
//hook
let restore = injector.inject();
//run experiments
const experiment = require('./experiment');
experiment.test();
restore();