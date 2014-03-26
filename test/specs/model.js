describe('model', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View, view;

  beforeEach(function(){
    View = ripple('<div></div>');
  });

  it('should set properties in the constructor', function(){
    view = new View({ 'foo' : 'bar' });
    assert( view.get('foo') === 'bar' );
    assert( view.data.foo === 'bar' );
  })

  it('should work with no properties', function(){
    view = new View();
    view.set('foo', 'bar');
    assert( view.get('foo') === 'bar' );
    assert( view.data.foo === 'bar' );
  })

  it('should set key and value', function(){
    view = new View();
    view.set('foo', 'bar');
    assert( view.get('foo') === 'bar' );
  });

  it('should set key and value with an object', function(){
    view = new View();
    view.set({ 'foo' : 'bar' });
    assert( view.get('foo') === 'bar' );
    assert( view.data.foo === 'bar' );
  });

  it('should set and object with a falsy 2nd param', function(){
    view = new View();
    view.set({ 'foo' : 'bar' }, undefined);
    assert( view.get('foo') === 'bar' );
  });

  it('should emit change events', function(){
    var match = false;
    view = new View();
    view.change('foo', function(){
      match = true;
    });
    view.set('foo', 'bar');
    assert(match === true);
  });

  it('should set properties in constructor', function(){
    var obj = new View({ 'foo':'bar' });
    assert( obj.get('foo') === 'bar' );
  });

  it('should set nested properties', function(){
    view = new View();
    view.set('foo.bar', 'baz');
    assert( view.get('foo').bar === 'baz' );
  });

  it('should get nested properties', function(){
    view = new View();
    view.set('foo', {
      bar: 'baz'
    });
    assert( view.get('foo.bar') === 'baz' );
  });

  it('should return undefined for missing nested properties', function(){
    view = new View();
    view.set('razz.tazz', 'bar');
    assert( view.get('foo') === undefined );
    assert( view.get('foo.bar') === undefined );
    assert( view.get('razz.tazz.jazz') === undefined );
  })

  describe('events for nested properties', function(){
    var view;

    beforeEach(function(){
      view = new View({
        foo: {
          bar: 'baz'
        }
      });
    });

    it('should emit events for the bottom edge', function(done){
      view.change('foo.bar', function(){
        done();
      });
      view.set('foo.bar', 'zab');
    })

    it('should emit events in the middle', function(){
      var called = false;
      view.change('foo', function(val){
        called = true;
      });
      view.set('foo.bar', 'zab');
      assert(called === true);
    })

    it.skip('should emit events', function(done){
      view.change(function(val){
        done();
      });
      view.set('foo.bar', 'zab');
    })

    it('should not emit events if the value has not changed', function(){
      var called = 0;
      view.set('foo.bar', 'zab');
      view.change('foo', function(val){
        called++;
      });
      view.change('foo.bar', function(val){
        called++;
      });
      view.set('foo', {
        bar: 'zab'
      });
      assert(called === 0);
    })

  })

  it('should use the change method for binding to changes', function(done){
    view = new View();
    view.change('one', function(change){
      assert(change === 1);
      done();
    });
    view.set('one', 1);
  })

  if('should bind to all changes', function(done){
    view = new View();
    view.change(function(attr, value){
      assert(attr === 'one');
      assert(value === 1);
      done();
    });
    view.set('one', 1);
  });

  it('should return a method to unbind changes', function(){
    var called = 0;
    view = new View();
    var unbind = view.change('one', function(value){
      called += 1;
    });
    unbind();
    view.set('one', 1);
    assert(called === 0);
  })

  it('should bind to changes of multiple properties', function(){
    var called = 0;
    view = new View();
    view.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    view.set('one', 1);
    assert(called === 1);
  })

  it('should unbind to changes of multiple properties', function(){
    var called = 0;
    view = new View();
    var unbind = view.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    unbind();
    view.set('one', 1);
    view.set('two', 1);
    assert(called === 0);
  })

});