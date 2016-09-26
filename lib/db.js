/**
 * Created by nuxeslin on 16/9/8.
 */
const util = require('util');


// lib/db.js
var _users = [];

exports.save = function(users) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(users)) return reject(new TypeError('users required Array type!'));
        setTimeout(function() {
            _users = users;
            console.log('current state in users db list :');
            console.log(util.inspect(_users));
            resolve();
        },1000);
    });
};

exports.find = function(name) {
    return new Promise(function(resolve, reject) {
        if (typeof name !== 'string') return reject(new TypeError('key name must be String !'));
        if (_users.length === 0) return reject(new Error('users list empty error!'));
        setTimeout(function() {
            if (_users.indexOf(name) === -1) return reject(new Error('can not find this user!'));
            var userIndex = _users.indexOf(name);
            resolve(_users[userIndex]);
        },1000);
    });
};

exports.clear = function() {
    return new Promise(function(resolve, reject) {
        console.log('release db refs');
        console.log('recycle hooks');
        if (!Array.isArray(_users)) return reject(new TypeError('users list required Array !'));
        setTimeout(function() {
            _users = [];
            console.log('current state in db ...');
            console.log(util.inspect(_users));
            resolve();
        },1500);
    });
};

