describe('accessors', function(){
  var assert = require('assert');
  var model = require('ripple/lib/model');
  var accessors = require('ripple/lib/model-accessors');

  var Model;

  beforeEach(function () {
    Model = model().use(accessors);
  });

  it('should define getters', function(){
    var state = new Model({
      foo: 'bar'
    });
    assert( state.foo === 'bar' );
  });

  it('should define setters', function(){
    var state = new Model({
      foo: 'bar'
    });
    state.foo = 'baz';
    assert( state.get('foo') === 'baz' );
  });

  it('should emit events', function(done){
    var state = new Model({
      foo: 'bar'
    });
    state.change('foo', function(){
      done();
    });
    state.foo = 'baz';
  });

  it('should have accessors if not defined when created', function(){
    var state = new Model();
    state.set('foo', 'bar');
    assert(state.foo === 'bar');
  })

  it('should have accessors if set is called with an object', function(){
    var state = new Model();
    state.set({
      foo: 'bar',
      bar: 'foo'
    });
    assert(state.foo === 'bar');
    assert(state.bar === 'foo');
  })

  it('should update the accessors', function(){
    var state = new Model();
    state.set('foo', 'bar');
    state.updateAccessors();
    assert(state.foo === 'bar');
  })

  it('should get nested properties', function(){
    var state = new Model({
      foo: {
        bar: 'baz'
      }
    });
    assert( state.foo.bar === 'baz' );
  })

});