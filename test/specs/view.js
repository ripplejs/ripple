describe('View', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view);
  });

  it('should have a unique id', function () {
    var view = new View();
    var view2 = new View();
    assert(view.id);
    assert(view.id !== view2.id);
  });

  it('should call an initialize method if it exists', function (done) {
    View = ripple('<div></div>');
    View.prototype.initialize = function() {
      done();
    };
    new View();
  });

  it('should create a view with a selector', function () {
    var test = document.createElement('div');
    test.id = 'foo';
    document.body.appendChild(test);
    View = ripple('#foo');
    var view = new View();
    assert(view.template = '<div id="foo"></div>');
  });

  it('should construct with properties', function(){
    var view = new View({
      foo: 'bar'
    });
    assert(view.get('foo') === 'bar');
  })

  it('should set values', function () {
    var view = new View({
      foo: 'bar'
    });
    view.set('foo', 'baz');
    assert( view.get('foo') === 'baz' );
  });

  it('should be able to set default properties', function () {
    var View = ripple('<div></div>')
      .attr('first', { default: 'Fred' })
      .attr('last', { default: 'Flintstone' });
    var view = new View();
    view.set('first', 'Wilma');
    assert(view.first === 'Wilma', 'First name should be Wilma');
    assert(view.last === 'Flintstone', 'Last name should be Flintstone');
  });

  it('should add required attributes', function (done) {
    var View = ripple('<div></div>')
      .attr('first', { required: true });
    try {
      new View();
      done(false);
    }
    catch (e) {
      assert(e);
      done();
    }
  });

  it('should add required attributes with defaults', function (done) {
    var View = ripple('<div></div>')
      .attr('first', { required: true, default: 'foo' });
    var view = new View();
    assert(view.first === 'foo');
    done();
  });

  it('should have typed attributes', function (done) {
    var View = ripple('<div></div>')
      .attr('first', { type: 'string' });
    try {
      new View({ 'first': 10 });
      done(false);
    }
    catch (e) {
      assert(e);
      done();
    }
  });

  it('should have typed required attributes', function (done) {
    var View = ripple('<div></div>')
      .attr('first', { required: true, type: 'string' });
    try {
      new View();
      done(false);
    }
    catch (e) {
      assert(e);
      done();
    }
  });

  it('should have typed attributes with defaults', function (done) {
    var View = ripple('<div></div>')
      .attr('first', { default: 'foo', type: 'string' });
    var view = new View();
    assert(view.first === 'foo');
    done();
  });

  it('should have different bindings for each view', function () {
    var i = 0;
    var One = ripple('<div foo="bar"></div>');
    One.directive('foo', function(val){
      i++;
    });
    var Two = ripple('<div foo="bar"></div>');
    var one = new One();
    var two = new Two();
    assert(i === 1);
  });

  it('should have the same bindings for each instance', function () {
    var one = new View();
    var two = new View();
    assert(two.bindings === one.bindings);
  });

  it('should allow a custom template when created', function () {
    var view = new View(null, {
      template: '<ul></ul>'
    });
    assert(view.el.outerHTML === '<ul></ul>');
  });

})