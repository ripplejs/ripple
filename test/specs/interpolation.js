describe('interpolation', function(){
  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var View;

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should change delimiters', function () {
    View.delimiters(/\<\%(.*?)\%\>/g);
    var view = new View({ foo: 'bar' });
    assert( view.interpolate('<% foo %>') === "bar");
  });

  it('should add filters', function () {
    View.filter('caps', function(val){
      return val.toUpperCase();
    });
    var view = new View({ foo: 'bar' });
    assert( view.interpolate('{{foo | caps}}') === "BAR");
  });

  it('should update when the view changes', function(){
    var name;
    var view = new View();
    view.set('name', 'Fred');
    view.templateBinding('{{name}}', function(val){
      name = val;
    });
    view.set('name', 'Barney');
    assert(name === "Barney");
  });

  it('should remove the binding when the view is destroyed', function(){
    var name;
    var view = new View();
    view.set('name', 'Fred');
    view.createTextBinding('{{name}}', function(val){
      name = val;
    });
    assert(name === "Fred");
    view.destroy();
    view.set('name', 'Barney');
    assert(name === "Fred");
  });

  it('should return the raw value for simple expressions', function(done){
    var name;
    var view = new View();
    view.set('names', ['Fred']);
    view.createTextBinding('{{names}}', function(val){
      assert(Array.isArray(val));
      assert(val[0] === 'Fred');
      done();
    });
  });

});