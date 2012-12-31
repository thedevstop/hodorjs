var Hodor = Hodor || {};
Hodor.TaskFactory = (function(){
  var TaskFactory = {
    startNew: function(f){
      var task = new Hodor.Task(f);
      task.postMessage('start');
      return task;
    }
  };

  return TaskFactory;
})();
