describe('destroying', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should remove all event listeners', function (done) {
    var view = new View();
    view.on('foo', function(){
      done(false);
    });
    view.destroy();
    view.emit('foo');
    done();
  });

  it('should remove all change listeners', function (done) {
    var view = new View({
      foo: 'bar'
    });
    view.watch('foo', function(){
      done(false);
    });
    view.destroy();
    view.set('foo', 'baz');
    done();
  });

  it('should unmount when destroyed', function (done) {
    View.on('unmounted', function(){
      done();
    });
    view = new View();
    view.appendTo(document.body);
    view.destroy();
  });

});