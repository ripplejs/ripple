var ripple = require('ripple');
var assert = require('assert');

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

  it('should accept elements instead of a template', function(){
    var div = document.createElement('div');
    var View = ripple(div);
    var view = new View();
    assert(view.el.nodeName === 'DIV');
  });

  it('should add directives', function(){
    View = ripple('<div data-text="name"></div>');
    View.directive('data-text', function(view, el, attr, value){
      el.innerHTML = view.get(value);
    });
    var view = new View({
      name: 'Tom'
    });
    assert(view.el.innerHTML === "Tom");
  });

})