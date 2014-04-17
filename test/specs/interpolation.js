describe('interpolation', function(){
  var assert = require('assert');
  var ripple = require('ripple');
  var frame = require('raf-queue');
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

  it('should add filters as objects', function () {
    var View = ripple('<div></div>');
    View.filter({
      caps: function(val){
        return val.toUpperCase();
      },
      lower: function(val){
        return val.toLowerCase();
      }
    });
    view = new View();
    view.set('foo', 'bar');
    assert( view.interpolate('{{foo | caps | lower}}') === "bar");
  });

  it('should return the raw value for simple expressions', function(){
    view.set('names', ['Fred']);
    var val = view.interpolate('{{names}}');
    assert(Array.isArray(val));
    assert(val[0] === 'Fred');
  });

  it('should interpolate properties with a $', function () {
    view.set('$value', 'Fred');
    var val = view.interpolate('{{$value}}');
    assert(val === 'Fred');
  });

  it('should not interpolate properties named this', function () {
    view.set('this', 'Fred');
    var val = view.interpolate('{{this}}');
    assert(val === view);
  });

});