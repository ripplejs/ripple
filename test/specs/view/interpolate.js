describe('view-interpolate', function(){
  var assert = require('assert');
  var createView = require('ripple/lib/view');
  var interpolate = require('ripple/lib/view/interpolate');

  var View;

  beforeEach(function () {
    View = createView('<div></div>');
    View.use(interpolate);
  });

  it('should have a different interpolator for each View', function () {
    var count = 0;
    var One = createView('<div></div>').use(interpolate);
    var Two = createView('<div></div>').use(interpolate);
    One.filter('foo', function(){
      count++;
    });
    var one = new One();
    var two = new Two();
    assert(one.hasFilter('foo'));
    assert(two.hasFilter('foo') === false);
  });

  it('should have the same interpolator for each view instance', function () {
    var count = 0;
    View.filter('foo', function(){
      count++;
    });
    var one = new View();
    var two = new View();
    assert(one.hasFilter('foo'));
    assert(two.hasFilter('foo'));
  });

  it('should interpolate once', function(){
    var view = new View();
    view.state.set('foo', 'bar');
    assert(view.interpolate('{{foo}}') === 'bar');
  });

  it('should throw an error if trying to interpolate with a property that does not exist', function(done){
    var view = new View();
    try {
      view.interpolate('{{name}}', function(){
        done(false);
      });
    }
    catch(e) {
      assert(e.message);
      return done();
    }
    done(false);
  });

  it('should change delimiters', function () {
    View.delimiters(/\<\%(.*?)\%\>/g);
    View.on('created', function(){
      this.set('foo', 'bar');
    });
    var view = new View();
    assert( view.interpolate('<% foo %>') === "bar");
  });

  it('should add filters', function () {
    View.filter('caps', function(val){
      return val.toUpperCase();
    });
    View.on('created', function(){
      this.set('foo', 'bar');
    });
    var view = new View();
    assert( view.interpolate('{{foo | caps}}') === "BAR");
  });

  describe('properties', function () {
    it('should interpolate a string using properties', function(done){
      var view = new View({
        'name': 'Fred'
      });
      view.interpolate('{{name}}', function(val){
        assert(val === 'Fred');
        done();
      });
    });
  });

  describe('state', function () {

    it('should interpolate a string using state', function(done){
      var view = new View();
      view.state.set('foo', 'bar');
      view.interpolate('{{foo}}', function(val){
        assert(val === "bar");
        done();
      });
    });

    it('should update when a state changes', function(){
      var name;
      var view = new View();
      view.state.set('name', 'Fred');
      view.interpolate('{{name}}', function(val){
        name = val;
      });
      view.state.set('name', 'Barney');
      assert(name === "Barney");
    });

    it('should remove the binding when the view is destroyed', function(){
      var name;
      var view = new View();
      view.state.set('name', 'Fred');
      view.interpolate('{{name}}', function(val){
        name = val;
      });
      assert(name === "Fred");
      view.destroy();
      view.state.set('name', 'Barney');
      assert(name === "Fred");
    });

    it('should return the raw value for simple expressions', function(done){
      var name;
      var view = new View();
      view.state.set('names', ['Fred']);
      view.interpolate('{{names}}', function(val){
        assert(Array.isArray(val));
        assert(val[0] === 'Fred');
        done();
      });
    });

  });

});