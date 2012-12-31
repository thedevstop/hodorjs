var Hodor = Hodor || {}; 

Hodor.Task = (function(){
  // if we have no window we will end up returning an object literal that 
  // responds to a postMessage function
  var simulate = typeof window === 'undefined';
  var URL = simulate ? null : window.URL || window.webkitURL;

  var Task = function(f){
    var self = this;

    if (simulate) {
      self.worker = {
        postMessage: function (evt) { self.worker.onmessage({data:f()}); }
      }
    }
    else {

      var textContent = "self.onmessage = function(evt){var f={0};self.postMessage(f());};".replace("{0}", f.toString());
      var blob = new Blob([textContent], {"type":"application/x-javascript"});

      self.worker = new Worker(URL.createObjectURL(blob));
    }
  
    self.worker.onmessage = function(e){
      self.result = e.data;
    };

    self.start = function() { self.worker.postMessage('start'); };
    self.awaitResult = function(callback) {
      if(typeof self.result !== 'undefined'){
        callback(self.result);
      }
      else{
        var currentHandler = self.worker.onmessage;
        this.worker.onmessage = function(e) { if(currentHandler) { currentHandler(e); } callback(e.data); };
      }
    };

    return this;
  };

  return Task;
})();

if (typeof module !== 'undefined') module.exports = Hodor.Task;
