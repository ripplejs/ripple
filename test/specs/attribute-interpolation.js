describe('attribute interpolation', function () {
  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var View, view, el;

  beforeEach(function () {
    View = ripple('<div id="{{foo}}" hidden="{{hidden}}"></div>');
    view = new View({
      data: {
        foo: 'bar',
        hidden: true
      }
    });
    el = view.el;
    view.appendTo(document.body);
  });

  afterEach(function () {
    view.destroy();
  });

  it('should interpolate attributes', function(done){
    dom.defer(function(){
      assert(el.id === 'bar');
      done();
    });
  })

  it('should render initial values immediately', function () {
    assert(el.id === 'bar');
  });

  it('should not render undefined', function () {
    var View = ripple('<div id="{{foo}}"></div>');
    var view = new View();
    assert(view.el.id === "");
  });

  it('should update interpolated attributes', function(done){
    view.set('foo', 'baz');
    dom.defer(function(){
      assert(el.id === 'baz');
      done();
    });
  })

  it('should toggle boolean attributes', function(done){
    dom.defer(function(){
      assert(view.el.hasAttribute('hidden'));
      view.set('hidden', false);
      dom.defer(function(){
        assert(view.el.hasAttribute('hidden') === false);
        done();
      });
    });
  })

});