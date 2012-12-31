var Hodor = Hodor || {};

// In the browser, reference Task.js. In node / mocha testing, we'll require it
var Task = Hodor.Task || require("./Task.js");

Hodor.TaskFactory = (function(){

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
