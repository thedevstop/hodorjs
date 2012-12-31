var Hodor = Hodor || {}; 

Hodor.Task = (function(){
  // if we have no window we will end up returning an object literal that 
  // responds to a postMessage function. This is primarily to support running on node/mocha
  var simulate = typeof window === 'undefined';
  var URL = simulate ? null : window.URL || window.webkitURL;
  var template = "self.onmessage=function(evt){var f={0};self.postMessage(f());};"
  var asyncTemplate = "self.onmessage=function(evt){var f={0};f(function(x){self.postMessage(x);}); };"

  var Task = function(f){
    var self = this;

    if (!f) return null;

    // See above comment. mocha unit tests on node don't have a window, so we fake it. I don't like this, but
    // it will do until we decide on something else.
    if (simulate) {
      self.worker = {
        postMessage: f.length === 0 ? 
          function (evt) { self.worker.onmessage({data:f()}); } :
          function (evt) { f(function(x) { self.worker.onmessage({data:x}); }); }
      }
    }
    else {
      var textContent = (f.length === 0 ? template : asyncTemplate).replace("{0}", f.toString()); 
      var blob = new Blob([textContent], {"type":"application/x-javascript"});

      self.worker = new Worker(URL.createObjectURL(blob));
    }
    
    // when the worker completes, store the result
    self.worker.onmessage = function(e){
      self.result = e.data;
    };

    // to start the task, we post a message to the worker. currently the message data is ignored.
    self.start = function() { self.worker.postMessage('start'); };

    // others can wait for us to complete by providing a callback
    self.awaitResult = function(callback) {
      if(typeof self.result !== 'undefined'){
        // we already have our result, so we can execute the callback immediately
        callback(self.result);
      }
      else{
        // when the worker signals us, we will execute the callback with the data. We need to keep the original
        // handler as well.
        var currentHandler = self.worker.onmessage;
        this.worker.onmessage = function(e) { if(currentHandler) { currentHandler(e); } callback(e.data); };
      }
    };

    return this;
  };

  return Task;
})();

if (typeof module !== 'undefined') module.exports = Hodor.Task;
