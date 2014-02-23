var ripple = require('ripple');
var assert = require('assert');
var dom = require('fastdom');

describe('Ripple', function(){
  var View;

  it('should compile a template to a function', function(){
    View = ripple('<div></div>');
    assert(typeof View === "function");
  });

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view.el);
    assert(view.state);
  });


  describe.skip('components', function () {

    it('should compose other views', function () {
      var Parent = createView('<div><foo/></div>');
      var Child = createView('<aside id="child"></aside>');
      View.component('foo', Child);
      var view = new View();
      console.log(view.el.outerHTML);
      assert(view.el.firstChild.id === "child");
    });

    it('should pass properties to the component', function () {
      var Parent = createView('<div><foo id="world" /></div>');
      var Child = createView('<aside id="{{id}}"></aside>');
      View.component('foo', Child);
      var view = new View();
      assert(view.el.firstChild.id === "world");
    });

    it('should pass dynamic properties to the component', function () {
      var Parent = createView('<div><foo id="{{world}}" /></div>');
      var Child = createView('<aside id="{{id}}"></aside>');
      View.component('foo', Child);
      var view = new View({
        world: 'pluto'
      });
      assert(view.el.firstChild.id === "pluto");
      view.set('world', 'mars')
      assert(view.el.firstChild.id === "mars");
    });

    it('should listen for events on the child view', function (done) {
      var Parent = createView('<div><foo on-change="change" /></div>');
      Parent.prototype.change = function(val){
        assert(val === 'foo');
        done();
      };
      var Child = createView('<aside"></aside>');
      Child.prototype.init = function(){
        this.emit('change', 'foo')
      };
      View.component('foo', Child);
      var view = new View();
    });

  });

 describe.skip('creating child views', function () {
    var child;

    beforeEach(function () {
      View = createView('<div></div>');
      View.directive('data-text', function(view, node, attr, value){
        node.innerHTML = view.get(value);
      });
      View.filter('caps', function(val){
        return val.toUpperCase();
      });
      View.computed('shout', ['content'], function(content){
        return content.toUpperCase();
      });

      child = View.create({
        data: data,
        options: {
          template: '<div id="{{ id | caps }}" data-text="content"></div>'
        }
      });

      child.mount(document.body);
    })

    afterEach(function () {
      child.unmount();
    });

    it('should share directives', function () {
      assert( child.el.innerHTML === 'test' );
    });

    it('should share computed properties', function () {
      assert(child.get('shout') === 'TEST');
    });

    it.skip('should share default properties', function(){

    });

    it('should share filters', function () {
      assert( child.el.id === "FOO" );
    });

    it.skip('should share interpolators', function () {

    });

  });

  describe('attributes', function () {

    beforeEach(function () {
      View = ripple('<div id="foo-{{bar}}" class="{{type}}" hidden="{{hidden}}">{{content}}</div>');
    })

    it('interpolate attributes', function (done) {
      var view = new View({
        bar: 1,
        type: 'danger',
        hidden: true
      });

      dom.defer(function(){
        assert(view.el.id === 'foo-1');
        assert(view.el.getAttribute('class') === 'danger');
        assert(view.el.hasAttribute('hidden'));
        done();
      });

    });

    it('updated interpolated attributes', function (done) {
      var view = new View({
        bar: 1,
        type: 'danger',
        hidden: true
      });
      view.set('hidden', false);
      view.set('type', 'success');
      view.set('bar', 2);
      dom.defer(function(){
        assert(view.el.id === 'foo-2');
        assert(view.el.getAttribute('class') === 'success');
        assert(view.el.hasAttribute('hidden') === false);
        done();
      });
    });

  });

  describe('directives', function () {

    it('should add directives', function(){
      View = createView('<div data-text="name"></div>');
      View.directive('data-text', function(view, el, attr, value){
        el.innerHTML = view.get(value);
      });
      var view = new View({
        name: 'Tom'
      });
      assert(view.el.innerHTML === "Tom");
    });

  });


})