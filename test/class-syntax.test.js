/**
 * Created by nuxeslin on 16/9/21.
 */
import AsyncBase from '../lib/class-syntax';
import 'util';
const should = require('should');

describe('class syntax',() => {
    describe('test async looper compaction',() => {
        it('the class syntax should be compiled successful',() => {
            let controller = new AsyncBase({ nWatchers: 15});
            return controller.pumpAsyncTimer().should.be.fulfilledWith(null);
        });
        it('the timer should be invoked',() => {
            let controller = new AsyncBase();
            return controller.pumpTimeout().should.be.fulfilled();
        });
    });
});