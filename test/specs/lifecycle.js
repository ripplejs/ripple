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

  it('should fire a created event', function (done) {
    View.on('created', function(){
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

  it('should fire a mounted event', function (done) {
    View.on('mounted', function(){
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

  it('should fire a destroy event', function (done) {
    View.on('destroying', function(){
      done();
    });
    new View()
      .destroy()
  });

});
