describe('composing views', function () {

  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var child, view;

  beforeEach(function () {
    Child = ripple('<div id="{{id}}" color="{{parentcolor}}"></div>');
    Parent = ripple('<child id="test" parentcolor="{{color}}"></child>');
    Parent.compose('child', Child);
    Parent.prototype.getInitialState = function(){
      return {
        color: 'red'
      };
    };
    view = new Parent();
    view.mount(document.body);
  });

  afterEach(function () {
    view.unmount();
  });

  it('should not traverse composed view elements', function () {
    Child = ripple('<div id="{{id}}" color="{{parentcolor}}"></div>');
    Parent = ripple('<div><child>{{foo}}</child></div>');
    Parent.compose('child', Child);
    var parent = new Parent();
    parent.mount(document.body);
    parent.unmount();
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

  it('should use custom content', function (done) {
    Child = ripple('<div>{{$content}}</div>');
    Parent = ripple('<child>foo</child>');
    Parent.compose('child', Child);
    view = new Parent();
    view.mount(document.body);
    dom.defer(function(){
      assert(view.el.outerHTML === '<div>foo</div>');
      done();
    });
  });

  it('should allow a component as the root element', function (done) {
    Child = ripple('<div>child</div>');
    Parent = ripple('<child></child>');
    Parent.compose('child', Child);
    view = new Parent();
    view.mount(document.body);
    dom.defer(function(){
      assert(view.el.outerHTML === '<div>child</div>');
      done();
    });
  });

});