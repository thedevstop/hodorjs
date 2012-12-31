var Hodor = Hodor || {};

// In the browser, there should be a preceding reference to Task.js. 
// Running the tests in mocha on node, we'll use require to bring it in.
var Task = Hodor.Task || require("./Task.js");

Hodor.TaskFactory = (function(){
  
  // object literal should do for now??
  var TaskFactory = {
    create: function(f){
      return new Task(f);
    },
    startNew: function(f){
      var task = this.create(f);
      task.start();
      return task;
    }
  };

  return TaskFactory;
})();

if (typeof module !== 'undefined') module.exports = Hodor.TaskFactory;
