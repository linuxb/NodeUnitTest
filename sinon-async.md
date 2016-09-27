## Node自动化测试函数Mock解决方案
@author Linuxb

函数mock在node的自动化测试中应该是一个比较核心的问题，很多情况下都需要对一些函数进行mock操作，比如一个简单接口的单元测试，它可能依赖一些网络请求模块，文件IO模块，我们很难在测试中模拟网络的异常或者擅自修改磁盘权限模拟文件IO异常，但不这么做我们又很难测试到接口是否真的能如我们所愿实现预期功能，代码的覆盖率也由于这些障碍无法提升，所以有一个成熟的mock框架对于测试是十分关键的。

先举个例子，比如我们有这么一个接口需要单元测试:

        exports.downloadInfo = function(url) {
        return new Promise((resolve, reject) => {
            if(url === null) reject(new Error('url not allow null'));
            fs.readFile('../cherry',(err,content) => {
                if (err) return reject(err);
                setTimeout(() => {
                    resolve(content);
                },1000);
            });
        });
    };
这个异步接口用promise封装，中间还调用了一次读文件的操作，所以我们要做的就是把这个读操作mock掉，怎么做到这一步呢？

其实思路很简单，JS的世界一切皆引用，这就给了我们无限可能，我们把函数的引用换掉就完事了，mocha的测试框架为我们的测试提供了很好用的hook，我们可以在开始调用测试用例时把readFile的引用先缓存起来，再换成我们自己定义的函数，里面可以模拟一些认为的超时或者抛出异常操作，然后在调用完毕，context切换回来时在把readFile还原回去.

    let _readFile;
    
    before(() => {
    	_readFile = fs.readFile;
    	fs.readFile = () => {
    		//do something you like
    	};
    });
    
    //test cases
    
    after(() => {
    	fs.readFile = _readFile;
    });
问题好像到这就结束了，但我们运行一些mocha，测试并不会通过，promise会超时，为什么呢？

mocha通过调用it的测试用例得到返回的promise，在内部等待promise的状态才可以断言最终promise状态，但在这里promise一直是pending状态，完全没有被resolve，那是因为，readFile的回调没有被执行，而恰好resolve方法也是在回调函数里面被执行，所以接口的promise永远不会fulfilled，mocha等待一个promise的耐性是有限的，就是设定的timeout的时间，所以mocha会报promise等待超时的错，但怎样才可以让里面的回调执行呢，我们再mock一个回调？显然我们在mock环境是无法还原那个回调的，因为作用域无法被还原，由于contextify的特性（node的一个特性不做深入解释），拷贝作用域是十分危险的，可能引起v8堆栈的混乱或内存泄漏，而且这个问题也是不太好回避的一个问题，首先node有很多类似的异步操作，我们要把异步变为同步就需要用promise来像上面的接口一样封装，然后再使用生成器。

解决这个问题我们需要做到一种有关联的mock机制，我在这里引用了proxy mock的概念，基于sinon.js造了轮子解决了这个问题，现在代码我放在了我的[github][1]上，并附上了sinon的文档，有兴趣的伙伴欢迎一起来继续改进，框架提出的主要是一个spy函数跟stub函数的概念，类似于proxy/stub的模式，mock一个函数实际上是给一个函数封装层proxy，proxy对象引用这函数的本体，拥有函数的所有属性，context，参数等等，并且能够监控函数是否被执行，执行计数，定制特定的行为，对于给定的输入能得到特定的输出，还能进行回调参数的控制，我在框架上加上了异步模块针对于很多异步需求，也能支持promise的行为，暴露的接口可以给开发者灵活的定制异步函数的行为，以及在原作用域调用回调并注入我们mock的参数，这样我们就可以很完美的解决问题了，框架的API参考下[sinon文档][2]，核心的几个接口是stub，spy，yields，setBeforeCallbackHook，yieldsBeforeCallbackHook，前面两个是proxy方法，生成一个封装的代理对象，yields方法主要是给回调函数注入参数，后面两个是behavior层的hook的，一个是个抽象方法，需要我们具体实现在执行回调具体模拟的操作，可以在里面完成一些异常抛出，超时模拟，而且支持扩展，可以设定配置参数进行延时等异步控制，支持promise，并且可以传递消息给回调函数，注入参数，对于上面这个例子，如果我们需要模拟一个耗时的读操作，可以这么写：

    before(() => {
                sinon.stub(fs,'readFile').yields(null,'test read file').setBeforeCallbackHook(() => {
                    //do anything else
                },{ timeout: 2000 }).yieldsBeforeCallbackHook();
            });
    after(() => {
        fs.readFile.restore();
    });
setBeforeCallbackHook接口接受两个参数，第一个是一个抽象的钩子函数，里面实现要定义的操作，第二个参数是一个配置项，可以设定timeout，promisified，控制异步的延时，以及是否要将一个异步结果封装成promise传递给回调函数，没错，这个hook还可以将异步结果注入到回调作为参数，我们在测试用例中这么写，上面的问题就完美解决了，测试会先等待2秒的延时，再执行原来作用域的回调，由于hook没有返回消息，所以回调的参数还是yields方法注入的参数，这样，readFile本身的回调会被执行，resolve了promise，也就不会有超时的错误了。

那么怎么向回调传递消息呢? 我们可以这样写：

    let stubProxy = stub(fs,'readFile');
        
    stubProxy.yields(null,'test file').setBeforeCallbackHook(function (args) {
            var interceptors = [{
                pos: 1,
                value: args
            }];
            return interceptors;
        }).yieldsBeforeCallbackHook(null,'hook invoked');

消息体设计成一个数组，里面的的对象只有一个pos属性跟一个value属性，意思在回调函数的第几个参数注入什么值，当然这是同步消息，怎么实现异步呢，比如我想完成一个耗时的异步操作，完成时把结果传递给回调函数，这样离readFile关联性更大了，我们把返回的结果包装成一个promise即可:

    let stubProxy = stub(fs,'readFile');
    
    stubProxy.yields(null,'test file').setBeforeCallbackHook(function (args) {
        return new Promise(function (resolve,reject) {
             var interceptors = [{
                pos: 1,
                value: args
        	}];
        	setTimeout(function () {
                resolve(interceptors);
               },1000);
             });
    }).yieldsBeforeCallbackHook(null,'hook invoked');
    
这样回调的参数就被修改了。

这样使用这个sinon－async框架就可以很方便灵活得进行一些异步函数的mock而不用担心promise超时的问题啦～～

    


  [1]: https://github.com/linuxb/sinon-async
  [2]: http://sinonjs.org/docs/