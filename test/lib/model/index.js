describe('Model', function(){
  var state = require('ripple/lib/model');
  var assert = require('assert');

  var Model, model;

  beforeEach(function(){
    Model = state();
  });

  it('should set properties in the constructor', function(){
    model = new Model({ 'foo' : 'bar' });
    assert( model.get('foo') === 'bar' );
  })

  it('should work without new', function(){
    model = Model({ 'foo' : 'bar' });
    assert( model.get('foo') === 'bar' );
  })

  it('should work without new and no properties', function(){
    model = Model();
    model.set('foo', 'bar');
    assert( model.get('foo') === 'bar' );
  })

  it('should set key and value', function(){
    model = new Model();
    model.set('foo', 'bar');
    assert( model.get('foo') === 'bar' );
  });

  it('should set key and value with an object', function(){
    model = new Model();
    model.set({ 'foo' : 'bar' });
    assert( model.get('foo') === 'bar' );
  });

  it('should set and object with a falsy 2nd param', function(){
    model = new Model();
    model.set({ 'foo' : 'bar' }, undefined);
    assert( model.get('foo') === 'bar' );
  });

  it('should emit change events', function(){
    var match = false;
    model = new Model();
    model.change('foo', function(){
      match = true;
    });
    model.set('foo', 'bar');
    assert(match === true);
  });

  it('should set properties in constructor', function(){
    var obj = new Model({ 'foo':'bar' });
    assert( obj.get('foo') === 'bar' );
  });

  it('should set nested properties', function(){
    model = new Model();
    model.set('foo.bar', 'baz');
    assert( model.get('foo').bar === 'baz' );
  });

  it('should get nested properties', function(){
    model = new Model();
    model.set('foo', {
      bar: 'baz'
    });
    assert( model.get('foo.bar') === 'baz' );
  });

  it('should return undefined for missing nested properties', function(){
    model = new Model();
    model.set('razz.tazz', 'bar');
    assert( model.get('foo') === undefined );
    assert( model.get('foo.bar') === undefined );
    assert( model.get('razz.tazz.jazz') === undefined );
  })

  describe('events for nested properties', function(){
    var model;

    beforeEach(function(){
      model = new Model({
        foo: {
          bar: 'baz'
        }
      });
    });

    it('should emit events for the bottom edge', function(done){
      model.change('foo.bar', function(){
        done();
      });
      model.set('foo.bar', 'zab');
    })

    it('should emit events in the middle', function(){
      var called = false;
      model.change('foo', function(val){
        called = true;
      });
      model.set('foo.bar', 'zab');
      assert(called === true);
    })

    it.skip('should emit events', function(done){
      model.change(function(val){
        done();
      });
      model.set('foo.bar', 'zab');
    })

    it('should not emit events if the value has not changed', function(){
      var called = 0;
      model.set('foo.bar', 'zab');
      model.change('foo', function(val){
        called++;
      });
      model.change('foo.bar', function(val){
        called++;
      });
      model.set('foo', {
        bar: 'zab'
      });
      assert(called === 0);
    })

  })

  it('should use the change method for binding to changes', function(done){
    model = new Model();
    model.change('one', function(change){
      assert(change === 1);
      done();
    });
    model.set('one', 1);
  })

  if('should bind to all changes', function(done){
    model = new Model();
    model.change(function(attr, value){
      assert(attr === 'one');
      assert(value === 1);
      done();
    });
    model.set('one', 1);
  });

  it('should return a method to unbind changes', function(){
    var called = 0;
    model = new Model();
    var unbind = model.change('one', function(value){
      called += 1;
    });
    unbind();
    model.set('one', 1);
    assert(called === 0);
  })

  it('should bind to changes of multiple properties', function(){
    var called = 0;
    model = new Model();
    model.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    model.set('one', 1);
    assert(called === 1);
  })

  it('should unbind to changes of multiple properties', function(){
    var called = 0;
    model = new Model();
    var unbind = model.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    unbind();
    model.set('one', 1);
    model.set('two', 1);
    assert(called === 0);
  })

});