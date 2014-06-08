describe('model', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View, view;

  beforeEach(function(){
    View = ripple('<div></div>');
  });

  it('should set properties in the constructor', function(){
    view = new View({
      foo: 'bar'
    });
    assert( view.get('foo') === 'bar' );
    assert( view.attrs.foo === 'bar' );
  })

  it('should work with no properties', function(){
    view = new View();
    view.set('foo', 'bar');
    assert( view.get('foo') === 'bar' );
    assert( view.attrs.foo === 'bar' );
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
    assert( view.attrs.foo === 'bar' );
  });

  it('should set and object with a falsy 2nd param', function(){
    view = new View();
    view.set({ 'foo' : 'bar' }, undefined);
    assert( view.get('foo') === 'bar' );
  });

  it('should emit change events', function(){
    var match = false;
    view = new View();
    view.watch('foo', function(){
      match = true;
    });
    view.set('foo', 'bar');
    assert(match === true);
  });

  it('should set properties in constructor', function(){
    var obj = new View({
      'foo':'bar'
    });
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


});