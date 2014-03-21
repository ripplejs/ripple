describe('view-compiler', function(){
  var assert = require('assert');
  var createView = require('ripple/lib/view');
  var compiler = require('ripple/lib/view-compiler');
  var interpolate = require('ripple/lib/view-interpolate');
  var dom = require('fastdom');

  var View, One, Two, view;

  beforeEach(function () {
    View = createView()
      .use(interpolate)
      .use(compiler('<div></div>'));

    One = createView()
      .use(interpolate)
      .use(compiler('<div></div>'));

    Two = createView()
      .use(interpolate)
      .use(compiler('<div></div>'));
  });

  it('should mount to an element and fire an event', function(done){
    view = new View();
    view.on('mounted', function(){
      assert(document.body.contains(view.el));
      done();
    })
    view.mount(document.body);
    view.unmount();
  })

  it('should unmount and fire an event', function(done){
    view = new View();
    view.mount(document.body);
    view.on('unmounted', function(){
      done();
    })
    view.unmount();
  })

  it('should unmount when destroyed', function (done) {
    view = new View();
    view.on('unmounted', function(){
      done();
    });
    view.mount(document.body);
    view.destroy();
  });

  it('should have a different compiler for each view', function () {
    var one = new One();
    var two = new Two();
    assert(one.compiler !== two.compiler);
  });

  it('should have the same compiler for each instance', function () {
    var one = new One();
    var two = new One();
    assert(two.compiler === one.compiler);
  });

  describe('rendering', function () {
    var one, two, rendered, target;

    beforeEach(function () {
      target = document.createElement('div');
      document.body.appendChild(target);
      rendered = 0;
      one = new View();
      two = new View();
      var render = one.compiler.render;
      one.compiler.render = function(){
        rendered += 1;
        return render.apply(this, arguments);
      };
    });

    afterEach(function () {
      one.unmount();
      two.unmount();
      if(target.parentNode) target.parentNode.removeChild(target);
    });

    it('should mount to an element and render', function () {
      one.mount(document.body);
      assert(rendered === 1);
      assert(document.body.lastElementChild === one.el);
    });

    it('should not re-render when mounting another element', function () {
      one.mount(document.body);
      one.mount(target);
      assert(target.lastElementChild === one.el);
      assert(rendered === 1);
    });

    it('should replace an element', function(){
      assert( target.parentNode != null );
      one.mount(target, {
        replace: true
      });
      assert( target.parentNode == null );
    });

    it('should re-render if unmounted', function () {
      one.mount(target);
      one.unmount();
      one.mount(target);
      assert(rendered === 2);
    });

    it('should not unmount if not mounted', function () {
      var count = 0;

      one.on('unmounted', function(){
        count += 1;
      });

      one
        .mount(target)
        .unmount(target)
        .unmount(target);

      assert(count === 1);
    });

  });


  describe('composing', function () {
    var child, view;

    beforeEach(function () {

      Child = createView()
        .use(interpolate)
        .use(compiler('<div id="{{id}}" color="{{parentcolor}}"></div>'));

      Parent = createView()
        .use(interpolate)
        .use(compiler('<child id="test" parentcolor="{{color}}"></child>'))
        .compose('child', Child);

      Parent.initialState(function(){
        return {
          color: 'red'
        };
      });

      view = new Parent();
      view.mount(document.body);
    });

    afterEach(function () {
      view.unmount();
    });

    it('should pass data to the component', function (done) {
      dom.defer(function(){
        assert(view.el.id === "test", view.el.id);
        done();
      });
    });

    it('should pass data as an expression to the component', function (done) {
      dom.defer(function(){
        assert(view.el.getAttribute('color') === "red");
        done();
      });
    });

    it('should update data passed to the component', function (done) {
      view.set('color', 'blue');
      dom.defer(function(){
        assert(view.el.getAttribute('color') === "blue");
        done();
      });
    });

    it('should use a custom template', function (done) {

      Child = createView()
        .use(interpolate)
        .use(compiler('<div></div>'));

      Parent = createView()
        .use(interpolate)
        .use(compiler('<div><child>foo</child></div>'))
        .compose('child', Child);

      view = new Parent();
      view.mount(document.body);

      dom.defer(function(){
        assert(view.el.innerHTML === 'foo');
        done();
      });

    });

    it('should allow a component as the root element', function (done) {

      Child = createView()
        .use(interpolate)
        .use(compiler('<div>child</div>'));

      Parent = createView()
        .use(interpolate)
        .use(compiler('<child></child>'))
        .compose('child', Child);

      view = new Parent();
      view.mount(document.body);

      dom.defer(function(){
        assert(view.el.outerHTML === '<div>child</div>');
        done();
      });
    });

  });

});