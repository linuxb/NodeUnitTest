/**
 * Created by nuxeslin on 16/9/12.
 */
// "use strict"
const sinon = require('sinon');
const util = require('util');
const request = require('request');
const fs = require('fs');
// proxy()

function getProfiles() {
    request.get('localhost',function (err,response,json) {
        console.log('if fake func can be yield');
        if(err) console.error(err.stack);
        console.log(response);
        console.log(json);
        fs.readFile('./asynctest',function (err,data) {
            if(err) console.error(err);
            console.log(data);
        })
    });
};

let fake = sinon.stub(request,'get').yields(null,null,'async_req_proxy').yields().yields(null,null,'cover it');
sinon.stub(fs,'readFile').yields(null,'test yield async file');
// console.info(util.inspect(res));
getProfiles();
request.get.restore();
// getProfiles();
// console.info(util.inspect(proxy.calledOnce));