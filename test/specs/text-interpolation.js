describe('text interpolation', function () {
  var assert = require('assert');
  var ripple = require('ripple');
  var frame = require('raf-queue');
  var View, view, el;

  beforeEach(function () {
    View = ripple('<div>{{text}}</div>');
    view = new View({
      text: 'Ted'
    });
    view.appendTo('body');
  });

  afterEach(function(){
    view.remove();
  });

  it('should interpolate text nodes', function(done){
    frame.defer(function(){
      assert(view.el.innerHTML === 'Ted');
      done();
    });
  })

  it('should render initial props immediately', function () {
    assert(view.el.innerHTML === 'Ted');
  });

  it('should not render null or undefined', function () {
    var View = ripple('<div>{{foo}}</div>');
    var view = new View();
    assert(view.el.innerHTML === "");
  });

  it('should remove the binding when the view is destroyed', function(done){
    var el = view.el;
    frame.defer(function(){
      view.destroy();
      view.set('text', 'Barney');
      frame.defer(function(){
        assert(el.innerHTML === "Ted");
        done();
      });
    });
  });

  it('should batch text node interpolation', function(done){
    var count = 0;
    var view = new View();
    var previous = view.interpolate;

    view.interpolate = function(){
      count++;
      return previous.apply(this, arguments);
    };

    view.set('text', 'one');
    view.set('text', 'two');
    view.set('text', 'three');

    frame.defer(function(){
      assert(count === 1);
      assert(view.el.innerHTML === 'three');
      done();
    });
  })

  it('should update interpolated text nodes', function(done){
    view.set('text', 'Fred');
    frame.defer(function(){
      assert(view.el.innerHTML === 'Fred');
      done();
    });
  })

  it('should handle elements as values', function(done){
    var test = document.createElement('div');
    view.set('text', test);
    frame.defer(function(){
      assert(view.el.firstChild === test);
      done();
    });
  })

  it('should update elements as values', function(done){
    var test = document.createElement('div');
    var test2 = document.createElement('ul');
    view.set('text', test);
    frame.defer(function(){
      view.set('text', test2);
      frame.defer(function(){
        assert(view.el.firstChild === test2);
        done();
      });
    });
  })

  it('should handle when the value is no longer an element', function(done){
    var test = document.createElement('div');
    view.set('text', test);
    frame.defer(function(){
      view.set('text', 'bar');
      frame.defer(function(){
        assert(view.el.innerHTML === 'bar');
        done();
      });
    });
  });

  it('should update from an non-string value', function(done){
    view.set('text', null);
    frame.defer(function(){
      view.set('text', 'bar');
      frame.defer(function(){
        assert(view.el.innerHTML === 'bar');
        done();
      });
    });
  });

});