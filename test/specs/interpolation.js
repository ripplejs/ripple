describe('interpolation', function(){
  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var View, view;

  beforeEach(function () {
    View = ripple('<div></div>');
    View.filter('caps', function(val){
      return val.toUpperCase();
    });
    view = new View();
  });

  it('should add filters', function () {
    view.set('foo', 'bar');
    assert( view.interpolate('{{foo | caps}}') === "BAR");
  });

  it('should return the raw value for simple expressions', function(){
    view.set('names', ['Fred']);
    var val = view.interpolate('{{names}}');
    assert(Array.isArray(val));
    assert(val[0] === 'Fred');
  });

});