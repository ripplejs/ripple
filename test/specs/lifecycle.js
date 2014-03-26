describe('lifecycle events', function () {
  var ripple = require('ripple');
  var assert = require('assert');

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('created', function (done) {
    View.on('created', function(){
      done();
    });
    new View();
  });

  it('creating', function (done) {
    View.on('creating', function(){
      done();
    });
    new View();
  });

  it('mounted', function (done) {
    View.on('mounted', function(){
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('unmounted', function (done) {
    View.on('unmounted', function(){
      done();
    });
    new View()
      .appendTo(document.body)
      .remove();
  });

  it('destroyed', function (done) {
    View.on('destroyed', function(){
      done();
    });
    new View()
      .destroy()
  });

});
