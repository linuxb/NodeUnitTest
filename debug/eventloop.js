/**
 * Created by nuxeslin on 16/9/19.
 */
const util = require('util');
const EventEmitter = require('events');
const logger = require('../lib/commons/logger');

function MyEmitter() {
    //initialize the EventEmitter for the listeners queue
    EventEmitter.call(this);
    //do something first
    // this.emit('event_x'); handler can not receive this event because it emitted synchronously when MyEmitter instantiated
    //it works
    setImmediate(emitInCallback, this, new Error('temporary error instance to preserve lost call stack'));
}

function emitInCallback(self, err) {
    if(err) {
        self.emit('error_event');
        return;
    }
    self.emit('event_x');
}

util.inherits(MyEmitter, EventEmitter);

let em = new MyEmitter();

em.on('event_x', () => {
    //but the emitter API is synchronously
    logger.log('I can receive this asynchronously event ');
});

em.on('error_event', () => {
    logger.log('I can receive this error event ');
});