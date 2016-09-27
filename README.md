### Node 单元测试

@author Linuxb


####简单的例子

node单元测试采用mocha为核心测试框架,只需要很简单的配置就可以完成测试

首先安装mocha
```
$ npm install --global mocha
```

比如我们有一个这种模块,导出一个函数,我们需要对这个函数的功能进行测试

```javascript
// lib/simple.js
exports.validate = function (num) {
    if (num < 0) return 0;
    return num;
};
```

然后在我们的项目工程下新建一个 test 目录,在编写测试用例之前我们需要一个断言库来为我们的测试结果断言,mocha并没有集成断言库,我们可以用should作为断言库
```
$ npm install --save-dev should
```

然后可以这样编写我们的测试用例代码

```javascript
// test/simple.test.js
//描述块: 描述模块
describe('simple',function () {
    //描述块: 描述模块中的接口
    describe('#validate',function () {
        //这里写测试用例
        it('it should return 10',function () {
            //断言
            simple.validate(10).should.be.equal(10);
        });
    });
});

```

当然我们首先要导入模块

```javascript
//导入断言库,这里我们用chai的should断言
const should = require('should');
//导入待测试的模块
const simple = require('../lib/simple');
```

现在只需要在项目的根目录运行mocha就可以了
```
$ mocha test/simple.test.js
```


```
 simple
    #validate
      ✓ it should return 10


  1 passing (8ms)

```


现在一次基本的自动化单元测试就完成了

####异步接口的测试

嵌套回调的测试请参考mocha的文档

这里主要说明带有promise的异步测试以及通过hook来预装数据和卸载数据

下面是个简单的例子模拟异步

```javascript
// lib/db.js
var _users = [];

exports.save = function (users) {
    return new Promise(function (resolve,reject) {
        if (!Array.isArray(users)) return reject(new TypeError('users required Array type!'));
        setTimeout(function () {
            _users = users;
            console.log('current state in users db list :');
            console.log(util.inspect(_users));
            resolve();
        },1000);
    });
};

exports.find = function (name) {
    return new Promise(function (resolve,reject) {
        if(typeof name !== 'string') return reject(new TypeError('key name must be String !'));
        if(_users.length === 0) return reject(new Error('users list empty error!'));
        setTimeout(function () {
            if(_users.indexOf(name) === -1) return reject(new Error('can not find this user!'));
            var userIndex = _users.indexOf(name);
            resolve(_users[userIndex]);
        },1000);
    });
};

exports.clear = function () {
    return new Promise(function (resolve,reject) {
        console.log('release db refs');
        if(!Array.isArray(_users)) return reject(new TypeError('users list required Array !'));
        setTimeout(function () {
            _users = [];
            console.log('current state in db ...');
            console.log(util.inspect(_users));
            resolve();
        },1500);
    });
};

```

这些导出的接口的返回结果都是以promise包装,所以我们可以很方便地用在测试用例中获取promise完成时的结果,以及reject时的异常

比如我需要从查找某个user的名字

```javascript
it('promise should be resolved',function () {
            return db.find('ryan').should.eventually.equal('ryan');
        });
```

这样我们就可以直接对promise fullfill状态的结果进行断言

同样的,也可以测试reject的情况,获得异常

```javascript
//this case test reject promise type error
        it('promise will be rejected : type error',function () {
            return db.find(null).should.be.rejected;
        });
```

那么怎么通过hook进行数据预装与卸载呢

比如我们在测试环境中,可能users列表没有值,需要某些业务操作才会被陆续写入,所以我们需要通过块的钩子函数在进入(退出)描述块,或者进入(退出)测试用例块时执行

这里需要在调用测试用例之前给users列表装入数据

```javascript
//register async hooks for db
        before(function (done) {
            console.log('hooks are invoked');
            db.save(['ryan','cherry']).then(function (res) {
                done();
            },function (err) {
                done(err);
            });
        });
```

注意钩子函数要写在描述块里面,不然会被当成mocha context的全局钩子,在每一个描述块进入时会被执行。

这里要注意,如果hook的是一个异步操作,我们最好把它封装为promise,这样mocha会等待promise的结果,那么promise将会被怎么处理呢

如果我们在hook里面这么写

```javascript
return db.save(['ryan','john','cherry']);
```

mocha先会等待promise的结果,然后resolve就是后面在测试用例中写的find操作了(这里中间通过调用done()进入下一步,后面会分析)。
这样看起来好像没什么问题,但如果save这个异步操作一旦出了异常,问题就来了,如下代码

```javascript
return db.save(null);
```

传入save的参数不再是正常的数组类型,然后在执行mocha进行测试

```
 0 passing (4s)
  1 failing

  1) db find user in db "before all" hook:
     Error: timeout of 2000ms exceeded. Ensure the done() callback is being called in this test.
  

```

报错的原因的提示不是那么友好,这里先解释下done函数是什么,这里要先考虑下mocha怎么处理异步的用例,mocha在异步函数执行时会进入等待状态,那么就需要一个回调来提醒它,异步完成了,可以执行测试的下一个操作了,这个回调就是done函数,mocha可以对函数的arguments.length进行判断,如果发现done这个形参,就注入done函数作为实参,在异步执行的回调函数或者promise的resolve或者reject中,我们需要调用done()来通知mocha该醒来了,执行下一步操作,这里我们传进了一个不合法的参数,promise会进入reject状态,然而通过直接返回这个promise后续的操作只会被当作fullfill状态的resolve函数来执行,并没有定义一个具体的reject处理函数,不像默认的resolve那样会自动调用done函数,所以这里done函数并没有执行到,mocha还在处于等待状态,到达给定的超时时间就直接抛出异常,就是我们所看到的错误提示。

解决的方法也很简单,既然没有调用done,那我们就给promise注册reject,resolve方法,在里面调用done,做点处理再给下一步处理

```javascript
return db.save(['ryan','cherry']).then(function (res) {
                done();
            },function (err) {
                done(err);
            });
```

运行一下换回正常的参数还是会报错的,原因也比较明显,返回的promise注册了resolve方法调用done,mocha也自动给promise注册resolve,调用done,所以resolve就相当于被
两次指定了,不符合promise的标准,所以手动调用done的方式不能带上return,直接在resolve,reject调用done通知mocha promise完成即可。

同理,在执行完测试用例,需要卸载数据,清空users列表,还原到测试前的状态,避免污染真正运行的环境。

```javascript
after(function (done) {
            console.log('release our hooks');
            db.clear().then(function (res) {
                done();
            },function (err) {
                done(err);
            });
        });
```


我们把一些异常情况都写进测试用例

```javascript
it('promise should be resolved',function () {
            return db.find('ryan').should.eventually.equal('ryan');
        });
        //this case test reject promise type error
        it('promise will be rejected : type error',function () {
            return db.find(null).should.be.rejected();
        });
        it('promise will be rejected: not exist user',function () {
            return db.find('none').should.be.rejected();
        });
```

然后运行命令
```
$ mocha  test/db.test.js
```

```
  db
    find user in db
hooks are invoked
current state in users db list :
[ 'ryan', 'cherry' ]
      ✓ promise should be resolved (1005ms)
      ✓ promise will be rejected : type error
      ✓ promise will be rejected: not exist user
release our hooks
release db refs
recycle hooks
current state in db ...
[]


  3 passing (4s)

```

测试就完成了。

注意一个问题，我们在写promise的断言一定要在it函数里面返回，才能让mocha获取到我们promise的本体，才能去判断它的状态，跟断言的状态进行比较，否则，mocha会当我们在这个用例什么都没干，直接显示这个用例测试通过。

注意,mocha等待异步的时间是有限的,默认为2000ms,超过这个时间还没有通过done来通知就算超时,抛出异常,所以假如我们有超过2000ms的异步操作就需要配置mocha的超时时间,比如有一个操作需要4000ms,可以这样做
```
$ mocha -t 4000 test/db.test.js
```

####代码覆盖率计算

一些资料介绍会通过mocha的html-cov生成html格式的报告,但mocha3.0.0以上的版本已经弃用了这个reporter。
计算覆盖率一种办法直接对所有的模块代码进行重编译,得到ast进行一次语义分析,植入执行计数的代码,这种方式当项目的代码增多,要一次性测试的模块增多后由于重编译会影响性能,所以这里我们采用基于mocha运行环境对代码运行时进行计算的工具istanbul,该工具直接用js写成,不需要像jscover等工具一样依赖java环境,也不需要额外生成编译文件,直接通过交付v8引擎的语法树分析,动态插入拆解代码,进行计数。

istanbul的使用很简单

安装istanbul
```
$ npm install --global istanbul
```

在项目根目录运行

```
$ istanbul cover _mocha -- test/db.test.js
```

就可以在项目的coverage子目录下找到html格式的代码测试以及覆盖率报告,在浏览器打开即可。

注意,mocha的命令前面必须加上下划线,而且mocha命令的参数需要用 -- 隔开,不然会被识别成istanbul的参数。

####ES6语法的支持

开发中我们很多都会用到ES6的语法，怎么针对于ES6进行自动化测试呢？

我们可以考虑先用Babel将ES6转码成ES5的代码，再进行计数代码的插装，但我们算出的覆盖率线上的代码的实际覆盖率相差甚远，这是因为转码后的代码没法还原成实际编写的代码，所以计算时需要依赖ES6的AST进行插装而不是ES5的AST，即先对源代码进行语法分析，在AST层面完成插装，再由babel转换成可以在Node执行的代码。

综上，要达到我们的目的，需要满足两个条件：1. 代码能够在Node中正确执行  2. 代码插装器可以生成ES6的AST

要满足第一个条件很简单，先用Babel编译，再送往Node执行就是，可以用 [babel-node](https://www.npmjs.com/package/node-babel "babel-node") 这个工具，点击可以进入文档页

要满足第二个条件，可以考虑两个开源工具： [isparta](https://www.npmjs.com/package/isparta "isparta") 和 [babel-istanbul](https://www.npmjs.com/package/babel-istanbul "babel-istanbul")

第一个工具MacOs环境下使用正常，在Window8.1跟Ubuntu环境下覆盖率无法计算，第二个工具两种环境下都可以进行计算。

所以我们只需要运行命令：

```
babel-node node_modules/babel-istanbul/lib/cli cover node_modules/mocha/bin/_mocha -- --recursive test/*.js
```

然后在工程的coverage目录下就可找到我们的代码覆盖率报告了~

先看看效果~~

![](http://km.oa.com/files/photos/pictures/201609/1474468613_62_w608_h399.png)

![](http://km.oa.com/files/photos/pictures/201609/1474468634_73_w432_h339.png)

babel-istanbul和mocha也可以通过全局的命令来运行，注意mocha命令需要加上下划线，不然无法获取到编译的结果，为什么会这样呢？

结果也很简单，mocha实际上会fork一个子进程，fork的时候会子进程会共享父进程的堆栈段代码段，这个时候babel可能还没有完成将代码编译放入父进程的进程空间，然而子进程才是mocha的本体，它执行的 ```_mocha``` 的过程，它一旦运行，就在空间上跟父进程独立，这个时候babel将转移的代码放入进程空间如果不通过一些共享内存或者pipe等IPC方法真正运行的mocha进程是不会得到转码后的代码的，所以会得到编译错误，ES6语法无法识别的错误，不少开发者看到一下子还真是一头雾水。



####集成测试到项目的构建

工程化的项目需要有一个统一的构建系统,在这里*nix环境下采用make构建,windows下采用grunt构建

使用Makefile集成测试

可以在我们的Makefile文件中添加如下代码

```
COVERDIST = lib-cov
TIMEOUT = 10000
TEST =  mocha
TESTDIRS = lib

.PHONY: clean test test-cov test-all

clean: 
    @echo "test clean"
    @rm -rf ./$(COVERDIST)

test:
    @$(TEST) --timeout=$(TIMEOUT)


test-cov:
    @istanbul cover _$(TEST) --timeout=$(TIMEOUT)


test-all: test-cov
```

直接运行make的相关命令就可以很方便完成复杂的测试过程。

当然我们也可以通过npm命令执行

```
"scripts": {
"test": "babel-node node_modules/babel-istanbul/lib/cli cover node_modules/mocha/bin/_mocha -- --recursive test/download.test.js"
}
```

我们运行
```
$ npm test
```

就可以完成复杂的自动化测试并完成代码覆盖率的报告


