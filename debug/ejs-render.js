const ejs = require('ejs');
const lru = require('lru-cache');

const str = '<%if (user) { %>' +
    '<h2><%- user.name %></h2>' +
    '<% } %>';

const istr = '<% users.forEach(function(user){ %> <%- include("views/test", {user: user} )%> <% }); %>';

let res = ejs.render(istr, {users: [{name: 'linuxb'}]}, {filename: 'test.ejs', cache: lru(100)});

console.log(res);
// console.log(ejs.cache.get(__filename));