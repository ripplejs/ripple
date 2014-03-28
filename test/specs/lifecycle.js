describe('lifecycle events', function () {
  var ripple = require('ripple');
  var assert = require('assert');

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should fire a construct event', function (done) {
    View.on('construct', function(){
      done();
    });
    new View();
  });

  it('should have a construct method', function (done) {
    View.construct(function(options){
      assert(options.foo === 'bar');
      assert( this instanceof View );
      done();
    });
    new View({
      foo: 'bar'
    });
  });

  it('should fire a created event', function (done) {
    View.on('created', function(){
      done();
    });
    new View();
  });

  it('should have a created method', function (done) {
    View.created(function(){
      assert( this instanceof View );
      done();
    });
    new View();
  });

  it('should fire a ready event', function (done) {
    View.on('ready', function(){
      done();
    });
    new View();
  });

  it('should have a ready method', function (done) {
    View.ready(function(){
      assert( this instanceof View );
      done();
    });
    new View();
  });

  it('should fire a mounted event', function (done) {
    View.on('mounted', function(){
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('should have a mounted method', function (done) {
    View.mounted(function(){
      assert( this instanceof View );
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('should fire an unmounted event', function (done) {
    View.on('unmounted', function(){
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('should have an unmounted method', function (done) {
    View.unmounted(function(){
      assert( this instanceof View );
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('should fire a destroy event', function (done) {
    View.on('destroy', function(){
      done();
    });
    new View()
      .destroy()
  });

  it('should have an destroy method', function (done) {
    View.destroy(function(){
      assert( this instanceof View );
      done();
    });
    new View()
      .destroy();
  });

});
