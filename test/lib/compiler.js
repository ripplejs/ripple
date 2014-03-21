describe('compiler', function(){

  var Compiler = require('ripple/lib/compiler');
  var interpolate = require('ripple/lib/view-interpolate');
  var createView = require('ripple/lib/view');
  var assert = require('assert');
  var dom = require('fastdom');

  var View, compiler, view;

  function create(){
    return createView().use(interpolate);
  }

  beforeEach(function(){
    View = create();
    view = new View();
    compiler = new Compiler();
  });

  describe('directives', function () {
    it('should match directives with a string', function(done){
      compiler.directive('data-test', function(view, el, attr, value){
        assert(value === 'foo');
        assert(attr === 'data-test');
        done();
      });
      compiler.render('<div data-test="foo"></div>', view);
    });
    it('should match directives with a regex', function(done){
      compiler.directive(/test/, function(view, el, attr, value){
        assert(value === "foo");
        done();
      });
      compiler.render('<div data-test="foo"></div>', view);
    });
  });

  describe('components', function () {
    it('should match components with a string', function(done){
      compiler.component('dummy', function(){
        done();
      });
      compiler.render('<div><dummy></dummy></div>', view);
    });
    it('should be case-insensitive', function(done){
      compiler.component('Dummy', function(){
        done();
      });
      compiler.render('<div><dummy></dummy></div>', view);
    });
    it('should be case-insensitive for elements', function(done){
      compiler.component('dummy', function(){
        done();
      });
      compiler.render('<div><Dummy></Dummy></div>', view);
    });
    it('should not traverse nodes that have been removed', function () {
      compiler.component('dummy', function(node){
        node.parentElement.removeChild(node);
      });
      compiler.render('<div><dummy>{{foo}}</dummy></div>', view);
    });
    it('should render components as the root node', function () {
      var test = document.createElement('div');
      compiler.component('dummy', function(node){
        node.parentNode.replaceChild(test, node);
      });
      var el = compiler.render('<dummy></dummy>', view);
      assert(el === test);
    });
  });

  describe('text interpolation', function () {
    var el;

    beforeEach(function () {
      view.set('foo', 'bar');
      el = compiler.render('<div>{{foo}}</div>', view);
    })

    it('should interpolate text nodes', function(done){
      dom.defer(function(){
        assert(el.innerHTML === 'bar');
        done();
      });
    })

    it('should batch text node interpolation', function(){
      var view = new View();
      assert(el.innerHTML !== 'bar');
    })

    it('should update interpolated text nodes', function(done){
      view.set('foo', 'baz');
      dom.defer(function(){
        assert(el.innerHTML === 'baz');
        done();
      });
    })

    it('should handle elements as values', function(done){
      var test = document.createElement('div');
      view.set('foo', test);
      dom.defer(function(){
        assert(el.firstChild === test);
        done();
      });
    })

    it('should update elements as values', function(done){
      var test = document.createElement('div');
      var test2 = document.createElement('ul');
      view.set('foo', test);
      dom.defer(function(){
        view.set('foo', test2);
        dom.defer(function(){
          assert(el.firstChild === test2);
          done();
        });
      });
    })

    it('should handle when the value is no longer an element', function(done){
      var test = document.createElement('div');
      view.set('foo', test);
      dom.defer(function(){
        view.set('foo', 'bar');
        dom.defer(function(){
          assert(el.innerHTML === 'bar');
          done();
        });
      });
    });

    it('should throw errors for undefined variables', function(done){
      try {
        compiler.render('<div>{{bar}}</div>', view)
      }
      catch(e) {
        done();
      }
    });

    it('should update from an non-string value', function(done){
      view.set('foo', null);
      dom.defer(function(){
        view.set('foo', 'bar');
        dom.defer(function(){
          assert(el.innerHTML === 'bar');
          done();
        });
      });
    });

    describe('rendering empty strings', function () {
      afterEach(function (done) {
        dom.defer(function(){
          assert(el.innerHTML === '');
          done();
        });
      });
      it('should render null', function(){
        view.set('foo', null);
      });
      it('should render false', function(){
        view.set('foo', false);
      });
      it('should render true', function(){
        view.set('foo', true);
      });
    });
  });


  describe('attribute interpolation', function () {
    var el;

    beforeEach(function () {
      view.set({
        foo: 'bar',
        hidden: true
      });
      el = compiler
        .render('<div id="{{foo}}" hidden="{{hidden}}"></div>', view);
    });

    it('should interpolate attributes', function(done){
      dom.defer(function(){
        assert(el.id === 'bar');
        done();
      });
    })

    it('should update interpolated attributes', function(){
      view.set('foo', 'baz');
      dom.defer(function(){
        assert(el.id === 'baz');
      });
    })

    it('should toggle boolean attributes', function(){
      dom.defer(function(){
        assert(el.hasAttribute('hidden'));
        view.set('hidden', false);
        dom.defer(function(){
          assert(el.hasAttribute('hidden') === false);
        });
      });
    })

  });

})