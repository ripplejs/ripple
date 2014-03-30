describe('scope', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View = ripple('<div></div>');

  it('should get data from the parent scope', function(){
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    assert( child.get('foo') === 'bar' );
  })

  it('should watch for changes on the parent scope', function(done){
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(){
      done();
    })
    parent.set('foo', 'baz');
  })

  it('should watch for multiple changes on the parent scope', function(){
    var count = 0;
    var parent = new View();
    parent.set({
      'foo': 'bar',
      'raz': 'taz'
    });
    var child = new View({
      scope: parent
    });
    child.watch(['foo', 'raz'], function(){
      count++;
    })
    parent.set({
      'foo': 'baz',
      'raz': 'baz'
    });
    assert(count === 2);
  })

  it('should unwatch for changes on the parent scope', function () {
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(){
      assert(false, 'it should be remove this callback');
    })
    child.unwatch('foo');
    parent.set('foo', 'baz');
    assert(child.scopeWatchers.foo.length === 0);
  });

  it('should unwatch for multiple changes on the parent scope', function () {
    var count = 0;
    var parent = new View();
    parent.set({
      'foo': 'bar',
      'raz': 'taz'
    });
    var child = new View({
      scope: parent
    });
    child.watch(['foo', 'raz'], function(){
      count++;
    });
    child.unwatch(['foo', 'raz']);
    parent.set({
      'foo': 'baz',
      'raz': 'baz'
    });
    assert(count === 0);
  });

  it('should unwatch some changes on the parent scope', function () {
    var count = 0;
    var parent = new View();
    parent.set({
      'foo': 'bar',
      'raz': 'taz'
    });
    var child = new View({
      scope: parent
    });
    child.watch(['foo', 'raz'], function(){
      count++;
    });
    child.unwatch('foo');
    parent.set({
      'foo': 'baz',
      'raz': 'baz'
    });
    assert(count === 1);
  });

  it('should unwatch for changes on the parent scope if the child sets the value', function () {
    var count = 0;
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(value){
      assert(value === 'raz');
      count++;
    })
    child.set('foo', 'raz');
    parent.set('foo', 'baz');
    assert(count === 1);
  });

  it('should unwatch for changes on the parent scope if the child sets the value as an object', function () {
    var count = 0;
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(value){
      assert(value === 'raz');
      count++;
    })
    child.set({ 'foo': 'raz' });
    parent.set('foo', 'baz');
    assert(count === 1);
  });

  it('should unwatch for changes on the parent scope but still keep parent listeners', function (done) {
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    parent.watch('foo', function(){
      done();
    });
    child.set('foo', 'raz');
    parent.set('foo', 'baz');
  });

  it('should remove all the scope watchers when the child gets the value', function () {
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(){});
    child.set('foo', 'raz');
    assert(child.scopeWatchers['foo'] === undefined);
  });

  it('should remove all scope listeners when destroyed', function () {
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    child.watch('foo', function(){
      assert(false, 'this should be unbound');
    });
    child.destroy();
    parent.set('foo', 'baz');
  });

  it.only('should interpolate with properties from the parent scope', function () {
    var parent = new View();
    parent.set('foo', 'bar');
    var child = new View({
      scope: parent
    });
    assert( child.interpolate('{{foo}}') === 'bar' );
  });

})