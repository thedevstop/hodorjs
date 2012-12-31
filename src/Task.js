var Hodor = Hodor || {}; 

Hodor.Task = (function(){
  // if we have no window we will end up returning an object literal that 
  // responds to a postMessage function
  var simulate = typeof window === 'undefined';
  var URL = simulate ? null : window.URL || window.webkitURL;

  var Task = function(f){
    var result;
 
    if (simulate) {
      result = {
        postMessage: function (evt) { return f(); }
      }
    }
    else {

      var textContent = "self.onmessage = function(evt){var f={0};var r=f();self.postMessage(r);};".replace("{0}", f.toString());
      var blob = new Blob([textContent], {"type":"application/x-javascript"});
      result = new Worker(URL.createObjectURL(blob));
    }
  
    result.start = function() { result.postMessage('start'); };
    return result;
  };

  return Task;
})();

if (typeof module !== 'undefined') module.exports = Hodor.Task;
