describe('interpolation', function(){
  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var View;

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should throw an error if trying to interpolate with a property that does not exist', function(done){
    View = ripple('<div>{{foo}}</div>');
    var view = new View();
    try {
      view.mount(document.body);
    }
    catch(e) {
      view.unmount();
      return done();
    }
    done(false);
  });

  it('should have a different interpolator for each View', function () {
    var One = ripple('<div>{{ test | foo }}</div>');
    var Two = ripple('<div>{{ test | foo }}</div>');
    One.filter('foo', function(val){
      return 'one';
    });
    Two.filter('foo', function(){
      return 'two';
    });
    var one = new One({ test: 'test' });
    var two = new Two({ test: 'test' });
    one.mount(document.body);
    two.mount(document.body);
    assert(one.innerHTML === "one");
    assert(two.innerHTML === "two");
    one.unmount();
    two.unmount();
  });

  it('should have the same interpolator for each view instance', function () {
    var count = 0;
    View = ripple('<div>{{ test | foo }}</div>');
    View.filter('foo', function(){
      count++;
    });
    var one = new View({ test: 'test' });
    var two = new View({ test: 'test' });
    one.mount(document.body).unmount();
    two.mount(document.body).unmount();
    assert(count === 2);
  });

  it('should change delimiters', function () {
    View.delimiters(/\<\%(.*?)\%\>/g);
    var view = new View({ foo: 'bar' });
    assert( view.interpolate('<% foo %>') === "bar");
  });

  it('should add filters', function () {
    View.filter('caps', function(val){
      return val.toUpperCase();
    });
    var view = new View({ foo: 'bar' });
    assert( view.interpolate('{{foo | caps}}') === "BAR");
  });

  it('should update when a state changes', function(){
    var name;
    var view = new View();
    view.set('name', 'Fred');
    view.createTextBinding('{{name}}', function(val){
      name = val;
    });
    view.set('name', 'Barney');
    assert(name === "Barney");
  });

  it('should remove the binding when the view is destroyed', function(){
    var name;
    var view = new View();
    view.set('name', 'Fred');
    view.createTextBinding('{{name}}', function(val){
      name = val;
    });
    assert(name === "Fred");
    view.destroy();
    view.set('name', 'Barney');
    assert(name === "Fred");
  });

  it('should return the raw value for simple expressions', function(done){
    var name;
    var view = new View();
    view.set('names', ['Fred']);
    view.createTextBinding('{{names}}', function(val){
      assert(Array.isArray(val));
      assert(val[0] === 'Fred');
      done();
    });
  });

  describe.skip('text interpolation', function () {
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

  describe.skip('attribute interpolation', function () {
    var el, View, view;

    beforeEach(function () {
      View = ripple('<div id="{{foo}}" hidden="{{hidden}}"></div>');
      view = new View({
        foo: 'bar',
        hidden: true
      });
      view.mount(document.body);
    });

    afterEach(function () {
      view.unmount();
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

});