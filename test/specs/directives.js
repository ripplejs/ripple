describe('directives', function () {
  var ripple = require('ripple');
  var assert = require('assert');

  it('should match directives with a string', function(done){
    var View = ripple('<div data-test="foo"></div>');
    View.directive('data-test', function(view, el, value){
      assert(value === 'foo');
      done();
    });
    var view = new View();
    view.mount('body');
    view.unmount();
  });

  it('should not interpolate directive values', function(done){
    var View = ripple('<div data-test="{{foo}}"></div>');
    View.directive('data-test', function(view, el, value){
      assert(value === '{{foo}}');
      done();
    });
    var view = new View({
      foo: 'bar'
    });
    view.mount('body');
    view.unmount();
  });

  it('should be able to bind to expressions', function () {
    var View = ripple('<div data-test="{{foo}}"></div>');
    View.directive('data-test', function(view, el, value){

      view.on('mounted', function(){

      });

      view.on('unmounted', function(){

      });

      this.interpolate(value, function(){

      });

      assert(value === '{{foo}}');
      done();
    });
    var view = new View({
      foo: 'bar'
    });
    view.mount('body');
    view.unmount();
  });


});