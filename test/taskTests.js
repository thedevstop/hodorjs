var assert = require("assert");
var Task = require('../src/Task.js');

describe("Task", function(){
  it("exists", function(){
    var task = new Task();
    assert(task); 
  });

  it("doesn't start immediately", function(){
    var one = 1;
    var f = function(){ one++; };
    
    var task = new Task(f);
    assert.equal(1, one);
  });

  it("can start", function(){
    var two = 1;
    var f = function() { two = 2 };
    
    var task = new Task(f);
    task.start();
    assert.equal(2, two);
  });

  it("doesn't start others when it starts", function(){
    var twoA = 1;
    var twoB = 1;
    
    var fA = function() { twoA = 2; };
    var fB = function() { twoB = 2; };

    var taskA = new Task(fA);
    var taskB = new Task(fB);
  
    taskA.start();
    
    assert.equal(1, twoB); 
  });

  it("can return a value", function(done){
    var result;
    
    var f = function() { return 42; };

    var task = new Task(f);
    task.start();

    task.awaitResult(function(result){
      assert.equal(42, result);
      done();
    });

  });

  it("await result can wait", function(done){
    var result;
    
    var f = function(done) { setTimeout(function(){ done(56); }, 150 ) };

    var task = new Task(f);
    task.start();

    task.awaitResult(function(result){
      assert.equal(56, result);
      done();
    });
  });
});
