/**
 * Created by nuxeslin on 16/9/23.
 */
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    user: 'cherry',
    password: 'cherry#dev',
    host: 'localhost',
    database: 'cherry',
    connectTimeout: 1000000
});

connection.connect((err) => {
    if(err) throw err;
    console.log('connect successful as id ==> ' + connection.threadId);
});

console.log(connection.threadId);

connection.query('select * from users where name = ?','cherry',(err,results) => {
    if(err) {
        console.error(err.message);
        return;
    }
    console.log(results);
});

connection.end(() => {
    console.log('connection ended');
});