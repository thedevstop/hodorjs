var assert = require("assert");
var TaskFactory = require("../src/TaskFactory.js");

describe("Task Factory", function(){
  it("exists", function(){
    assert(TaskFactory);
  });

  it("can start a task immediately", function(done){

    var f = function() { return 42; };

    var task = TaskFactory.startNew(f);

    task.awaitResult(function(x){
      assert.equal(42, x);
      done();
    });
  });

  it("can create a task without starting it", function(){
    var one = 1;
    
    var f = function() { one++ };
  
    var task = TaskFactory.create(f);
    assert.equal(1, 1);
  });
});
