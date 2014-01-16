var Ripple = require('ripple');
var Emitter = require('emitter');
var assert = require('assert');

describe('Ripple', function(){
  var ripple;

  beforeEach(function(){
    ripple = new Ripple();
  });

  it('should compile a template to a function', function(){
    var fn = ripple.compile('<div></div>');
    assert(typeof fn === "function");
  });

  it('should create a function that returns an element', function(){
    var fn = ripple.compile('<div></div>');
    var el = fn();
    assert(el.nodeType);
  });

  it('should emit events when compiling', function(done){
    ripple.on('compile', function(compiler, scope){
      done();
    });
    ripple.compile('<div></div>')();
  });

  it('should accept elements instead of a template', function(){
    var div = document.createElement('div');
    var fn = ripple.compile(div);
    var el = fn();
    assert(el === div);
  });

  it('should add directives', function(){
    ripple.directive('data-text', function(scope, el, value){
      el.innerHTML = scope.get(value);
    });
    var fn = ripple.compile('<div data-text="name"></div>');
    var el = fn({ name: 'Tom' });
    assert(el.innerHTML === "Tom");
  });

  describe('multiple scopes', function(){

    beforeEach(function(){
      ripple.directive('data-text', function(scope, el, value){
        el.innerHTML = scope.get(value);
      });
    })

    it('should search from the bottom-up', function(){
      var fn = ripple.compile('<div data-text="name"></div>');
      var el = fn({ name: 'Bob' }, { name: 'Tom' });
      assert(el.innerHTML === "Tom");
    })

    it('should look at the parent', function(){
      var fn = ripple.compile('<div data-text="firstname"></div>');
      var el = fn({ firstname: 'Bob' }, { name: 'Tom' });
      assert(el.innerHTML === "Bob");
    })

  })

  describe('watching objects for changes', function(){
    var fn;

    beforeEach(function(){
      ripple.directive('data-text', function(scope, el, value){
        el.innerHTML = scope.get(value);
      });
      fn = ripple.compile('<div data-text="name"></div>');
    })

    it('should accept a plain object', function(){
      var obj = { name: 'Tom' };
      fn(obj);
      obj.name = 'Bob';
      assert(el.innerHTML === "Bob");
    })

    it('should accept an emitter', function(){
      var emitter = new Emitter();
      emitter.name = "Tom";
    })

    it('should accept a stream', function(){

    })

  });

})