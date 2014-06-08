describe('View', function(){
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view);
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

  describe.skip('creating child views', function () {

    beforeEach(function () {
      View = ripple('<div></div>');
    });

    it('should create child views with the same bindings', function (done) {
      View.directive('foo', function(val){
        assert(val === 'bar');
        done();
      });
      var Child = View.create('<div foo="bar"></div>');
      new Child();
    });

    it('should not have the same lifecycle events', function (done) {
      View.created(function(val){
        done(false);
      });
      var Child = View.create('<div foo="bar"></div>');
      new Child();
      done();
    });

  });

})