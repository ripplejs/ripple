describe('directives', function () {
  var ripple = require('ripple');
  var assert = require('assert');

  it('should match directives with a string', function(done){
    var View = ripple('<div data-test="foo"></div>');
    View.directive('data-test', {
      update: function(value, el, view){
        assert(value === 'foo');
        assert(view instanceof View);
        done();
      }
    });
    var view = new View();
    view.appendTo('body');
    view.destroy();
  });

  it('should use just an update method', function(done){
    var View = ripple('<div data-test="foo"></div>');
    View.directive('data-test', function(value){
      assert(value === 'foo');
      done();
    });
    var view = new View();
  });

  it('should pass in the element and the view', function(done){
    var View = ripple('<div data-test="foo"></div>');
    View.directive('data-test', function(value, el, view) {
      assert(value === 'foo');
      assert(el instanceof Element);
      assert(view instanceof View);
      done();
    });
    var view = new View();
  });

  it('should update with interpolated values', function(done){
    var View = ripple('<div data-test="{{foo}}"></div>');
    View.directive('data-test', {
      update: function(value) {
        assert(value === 'bar');
        done();
      }
    });
    var view = new View({
      foo: 'bar'
    });
  });

  it('should call the binding in the context of the directive', function (done) {
    var View = ripple('<div data-test="foo"></div>');
    View.directive('data-test', function(value){
      assert(this.constructor.name === 'Directive');
      done();
    });
    var view = new View();
  });

});