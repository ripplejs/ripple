describe('lifecycle events', function () {
  var ripple = require('ripple');
  var assert = require('assert');

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should have an event after it is created', function (done) {
    View.on('created', function(){
      done();
    });
    new View();
  });

  it('should have an event before it is created', function (done) {
    View.on('creating', function(){
      done();
    });
    new View();
  });

  it('should have an event before it is mounted', function (done) {
    View.on('mounting', function(){
      done();
    });
    new View()
      .mount(document.body)
      .unmount();
  });

  it('should have an event after it is mounted', function (done) {
    View.on('mounted', function(){
      done();
    });
    new View()
      .mount(document.body)
      .unmount();
  });

  it('should have an event before it is unmounted', function (done) {
    View.on('unmounting', function(){
      done();
    });
    new View()
      .mount(document.body)
      .unmount();
  });

  it('should have an event after it is unmounted', function (done) {
    View.on('unmounted', function(){
      done();
    });
    new View()
      .mount(document.body)
      .unmount();
  });

  it('should have an event after it is destroyed', function (done) {
    View.on('destroyed', function(){
      done();
    });
    new View()
      .destroy()
  });

});
