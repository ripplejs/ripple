describe('composing views', function () {

  var assert = require('assert');
  var ripple = require('ripple');
  var frame = require('raf-queue');
  var child, view;

  beforeEach(function () {
    Child = ripple('<div id="{{id}}" color="{{parentcolor}}"></div>');
    Parent = ripple('<child id="test" parentcolor="{{color}}"></child>');
    Parent.compose('child', Child);
    view = new Parent({
      color: 'red'
    });
    view.appendTo(document.body);
  });

  afterEach(function () {
    view.remove();
  });

  it('should not traverse composed view elements', function () {
    Child = ripple('<div></div>');
    Parent = ripple('<div><child>{{foo}}</child></div>');
    Parent.compose('child', Child);
    var parent = new Parent();
    parent.appendTo(document.body);
    parent.remove();
  });

  it('should pass data to the component', function () {
    assert(view.el.id === "test", view.el.id);
  });

  it('should pass data as an expression to the component', function () {
    assert(view.el.getAttribute('color') === "red");
  });

  it('should update data passed to the component', function (done) {
    view.set('color', 'blue');
    frame.defer(function(){
      assert(view.el.getAttribute('color') === "blue");
      done();
    });
  });

  it('should use custom content', function (done) {
    var Child = ripple('<div>{{yield}}</div>');
    var Parent = ripple('<child>foo</child>');
    Parent.compose('child', Child);
    var view = new Parent();
    view.appendTo(document.body);
    frame.defer(function(){
      assert(view.el.outerHTML === '<div>foo</div>');
      view.remove();
      done();
    });
  });

  it('should allow a component as the root element', function (done) {
    Child = ripple('<div>child</div>');
    Parent = ripple('<child></child>');
    Parent.compose('child', Child);
    view = new Parent();
    view.appendTo(document.body);
    frame.defer(function(){
      assert(view.el.outerHTML === '<div>child</div>');
      done();
    });
  });

  it('should keep parsing the template', function (done) {
    var Child = ripple('<div>Child</div>');
    var Other = ripple('<div>Other</div>');
    var Parent = ripple('<div><child></child><other></other><div test="bar"></div></div>');
    Parent.compose('child', Child);
    Parent.compose('other', Other);
    Parent.directive('test', function(value){
      assert(value === "bar");
      done();
    });
    var view = new Parent();
    view.appendTo(document.body);
    frame.defer(function(){
      view.remove();
    });
  });

});