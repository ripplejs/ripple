describe('View', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view);
  });

  it('should add attributes', function (done) {
    View = ripple('<div data-text="foo"></div>');
    View.directive('data-text', function(){
      done();
    });
    var view = new View();
    view.mount(document.body);
    view.unmount();
  });

  it('should construct with properties', function(){
    var view = new View({
      foo: 'bar'
    });
    assert(view.data.foo === 'bar');
  })

  it('should set values', function () {
    var view = new View({
      foo: 'bar'
    });
    view.set('foo', 'baz');
    assert( view.data.foo === 'baz' );
  });

  it('should watch for changes', function(done){
    var view = new View();
    view.set('foo', 'bar');
    view.watch('foo', function(){
      done();
    })
    view.set('foo', 'baz');
  })

  it('should unwatch changes', function(done){
    var view = new View();
    view.set('foo', 'bar');
    var id = view.watch('foo', function(){
      done(false);
    })
    view.unwatch(id);
    view.set('foo', 'baz');
  })

  it('should be able to set default properties', function () {
    View.prototype.getInitialState = function(){
      return {
        first: 'Fred',
        last: 'Flintstone'
      };
    };
    var view = new View();
    view.set('first', 'Wilma');
    assert(view.data.first === 'Wilma');
    assert(view.data.last === 'Flintstone');
  });



  it('should have a different compiler for each view', function () {
    var One = ripple('<div></div>');
    var Two = ripple('<div></div>');
    var one = new One();
    var two = new Two();
    assert(one.compiler !== two.compiler);
  });

  it('should have the same compiler for each instance', function () {
    var one = new View();
    var two = new View();
    assert(two.compiler === one.compiler);
  });



})