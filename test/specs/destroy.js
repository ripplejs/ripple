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
    view.change('foo', function(){
      done(false);
    });
    view.destroy();
    view.set('foo', 'baz');
    done();
  });

  it('should unmount when destroyed', function () {
    view = new View();
    view.mount(document.body);
    view.destroy();
    assert(view.isMounted() === false);
  });

});