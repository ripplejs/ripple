var ripple = require('ripple');
var assert = require('assert');
var dom = require('fastdom');

describe('Ripple', function(){
  var View;

  it('should create a function that returns an View', function(){
    View = ripple('<div></div>');
    var view = new View();
    assert(view.state);
  });

  it('should add attributes', function (done) {
    View = ripple('<div data-text="foo"></div>');
    View.directive('data-text', function(view, node, attr, value){
      done();
    });
    var view = new View();
    view.mount(document.body);
    view.unmount();
  });

  it.skip('should add components', function (done) {

  });

})