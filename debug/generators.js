/**
 * Created by nuxeslin on 17/3/6.
 */
function* gen () {
    let noop = 0;
    let res = yield noop + 1;
    console.log(res);
    let store = yield res + 1;
    return store;
}

let g = gen();
console.log(g.next());
console.log(g.next());
console.log(g.next());