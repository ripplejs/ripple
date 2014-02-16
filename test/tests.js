var ripple = require('ripple');
var assert = require('assert');

describe('Ripple', function(){
  var View;

  it('should compile a template to a function', function(){
    View = ripple('<div></div>');
    assert(typeof View === "function");
  });

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view.el);
    assert(view.state);
  });

  it('should add directives', function(){
    View = ripple('<div data-text="name"></div>');
    View.directive('data-text', function(view, el, attr, value){
      el.innerHTML = view.get(value);
    });
    var view = new View({
      name: 'Tom'
    });
    assert(view.el.innerHTML === "Tom");
  });

  describe('interpolation', function () {

    beforeEach(function () {
      View = ripple('<div></div>');
    })

    it('should interpolate a string', function(done){
      var view = new View();
      view.set('foo', 'bar');
      view.interpolate('{{foo}}', function(val){
        assert(val === 'bar');
        done();
      });
    })

    it('should add interpolation filters', function(done){
      View.filter('noobify', function(){
        return 'noob';
      });
      var view = new View();
      view.set('foo', 'bar');
      view.interpolate('{{foo | noobify}}', function(val){
        assert(val === 'noob');
        done();
      });
    })

   it('should watch a string for changes', function(done){
      var count = 0;
      var view = new View();
      view.set('foo', 'bar');
      view.interpolate('{{foo}}', function(val){
        count++;
        if(count === 1) assert(val === 'bar');
        if(count === 2) {
          assert(val === 'baz');
          done();
        }
      });
      view.set('foo', 'baz');
    })

    it('should unwatch a strings changes', function(){
      var count = 0;
      var view = new View();
      view.set('foo', 'bar');
      var unbind = view.interpolate('{{foo}}', function(val){
        count++;
      });
      unbind();
      view.set('foo', 'baz');
      assert(count === 1, count);
    })

  });

  describe('binding events', function () {

    it('should bind and fire an event', function(done){
      var view = new View();
      view.on('bind', function(){
        done();
      });
      view.bind();
    })

    it('should unbind and fire an event', function(done){
      var view = new View();
      view.on('unbind', function(){
        done();
      });
      view
        .bind()
        .unbind();
    })

  });

})