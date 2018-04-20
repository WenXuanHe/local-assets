const PENDING = "pending";
const FUlFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise (excutor){
  // 缓存当前promise实例对象
  let that = this;
  // 初始状态
  that.status = PENDING;
  that.value = undefined;
  that.reason = undefined;
  that.onFulfilledCallbacks = []; // 存储fulfilled状态对应的onFulfilled函数
  that.onRejectedCallbacks = []; // 存储rejected状态对应的onRejected函数

  function resolve(value){
    if(value instanceof Promise){
      return value.then(reslove, reject);
    }

    setTimeout(() => {
      if(that.status === PENDING){
        that.status = FUlFILLED;
        that.value = value;
        that.onFulfilledCallbacks.forEach(cb => {
          cb(that.value);
        });
      }
    });
  }

  function reject (reason) {
    setTimeout(() => {
      if(that.status === PENDING){
        that.status = REJECTED;
        that.reason = value;
        that.onRejectedCallbacks.forEach(cb => {
          cb(that.value);
        });
      }
    });
  }

  try{
    excutor(resolve, reject);
  }catch(e){
    reject(e);
  }
}

// then 返回值是一个新的Promise, 添加回调函数到onFulfilledCallbacks 和onRejectedCallbacks
Promise.prototype.then = function(onFulfilled, onRejected){
  const that = this;
  let newPromise;

  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

  if(that.status === FUlFILLED){
    return newPromise = new Promise((resolve, reject) => {
      setTimeout(function(){
        let x = onFulfilled(that.value);
        resolvePromise(newPromise, x, resolve, reject);
      });
    })
  }

  if(that.status === REJECTED){
    return newPromise = new Promise((resolve, reject) => {
      setTimeout(function(){
        let x = onRejected(that.reason);
        resolvePromise(newPromise, x, resolve, reject);
      });
    })
  }

  if(that.status === PENDING){
    return newPromise = new Promise((resolve, reject) => {
      that.onFulfilledCallbacks.push((value) => {
        try {
          let x = onFulfilled(value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch(e) {
            reject(e);
        }
      });
      that.onRejectedCallbacks.push((reason) => {
        let x = onRejected(that.reason);
        resolvePromise(newPromise, x, resolve, reject);
      });
    })
  }


}