describe('watching', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View = ripple('<div></div>');

  it('should watch for changes', function(done){
    var view = new View();
    view.set('foo', 'bar');
    view.watch('foo', function(){
      done();
    })
    view.set('foo', 'baz');
  })

  it('should unwatch all changes to a property', function(done){
    var view = new View();
    view.set('foo', 'bar');
    view.watch('foo', function(){
      done(false);
    })
    view.unwatch('foo');
    view.set('foo', 'baz');
    done();
  })

  it('should unwatch changes with a property and a function', function(done){
    var view = new View();
    view.set('foo', 'bar');
    function change(){
      done(false);
    }
    view.watch('foo', change);
    view.unwatch('foo', change);
    view.set('foo', 'baz');
    done();
  })

  it('should use the change method for binding to changes', function(done){
    view = new View();
    view.watch('one', function(change){
      assert(change === 1);
      done();
    });
    view.set('one', 1);
  })

  if('should watch all changes', function(done){
    view = new View();
    view.watch(function(){
      done();
    });
    view.set('one', 1);
  });

  if('should unwatch all changes', function(done){
    view = new View();
    view.watch(function change(){
      done(false);
    });
    view.unwatch(change);
    view.set('one', 1);
    done();
  });

  it('should bind to changes of multiple properties', function(){
    var called = 0;
    view = new View();
    view.watch(['one', 'two'], function(attr, value){
      called += 1;
    });
    view.set('one', 1);
    assert(called === 1);
  })

  it('should unbind to changes of multiple properties', function(){
    var called = 0;
    view = new View();
    function change(){
      called += 1;
    }
    view.watch(['one', 'two'], change);
    view.unwatch(['one', 'two'], change);
    view.set('one', 1);
    view.set('two', 1);
    assert(called === 0);
  })

  describe('nested properties', function(){
    var view;

    beforeEach(function(){
      view = new View({
        foo: {
          bar: 'baz'
        }
      });
    });

    it('should emit events for the bottom edge', function(done){
      view.watch('foo.bar', function(){
        done();
      });
      view.set('foo.bar', 'zab');
    })

    it('should not emit events in the middle', function(){
      var called = false;
      view.watch('foo', function(val){
        called = true;
      });
      view.set('foo.bar', 'zab');
      assert(called === false);
    })

    it('should emit when setting an object in the middle', function () {
      var called = false;
      view.watch('foo', function(val){
        called = true;
      });
      view.set('foo', {
        bar: 'zab'
      });
      assert(called === true);
    });

    it('should not emit events if the value has not changed', function(){
      var called = 0;
      view.set('foo.bar', 'zab');
      view.watch('foo', function(val){
        called++;
      });
      view.watch('foo.bar', function(val){
        called++;
      });
      view.set('foo', {
        bar: 'zab'
      });
      assert(called === 0);
    })

  })

})