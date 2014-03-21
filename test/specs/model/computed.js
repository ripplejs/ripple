describe('computed', function(){
  var assert = require('assert');
  var model = require('ripple/lib/model');
  var computed = require('ripple/lib/model/computed');

  var Model, state;

  beforeEach(function () {
    Model = model().use(computed);
  });

  it('should be able to do computed properties', function(){
    Model.computed('three', ['one', 'two'], function(){
      return this.get('one') + this.get('two')
    });
    state = new Model({
      one: 1,
      two: 2
    });
    assert(state.get('three') === 3);
  })

  it('should pass the values through to the callback', function(){
    Model.computed('three', ['one', 'two'], function(one, two){
      return one + two;
    });
    state = new Model({
      one: 1,
      two: 2
    });
    state.set('two', 3);
    assert(state.get('three') === 4);
  })

  it('should emit change events for computed properties', function(done){
    Model.computed('three', ['one', 'two'], function(){
      return this.get('one') + this.get('two')
    });
    state = new Model({
      one: 1,
      two: 2
    });
    state.change('three', function(change){
      assert(change === 4);
      done();
    });
    state.set('one', 2);
  })

  it('should be able to do computed properties without explicit deps', function(done){
    Model.computed('three', function(){
      return this.get('one') + this.get('two')
    });
    state = new Model({
      one: 1,
      two: 2
    });
    state.change('three', function(change){
      assert(change === 4);
      done();
    });
    state.set('one', 2);
  })

  it('should get properties as normal', function(){
    state = new Model({ 'foo' : 'bar' });
    assert( state.get('foo') === 'bar' );
  })

});