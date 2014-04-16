describe('destroying', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var frame = require('raf-queue');
  var View;

  beforeEach(function () {
    View = ripple('<div>{{text}}</div>');
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

  it('should unbind all bindings', function () {
    view = new View();
    view.appendTo(document.body);
    assert(view.activeBindings.length !== 0);
    view.destroy();
    assert(view.activeBindings.length === 0);
  });

  it('should not run text changes after it has been destroyed', function (done) {
    view = new View();
    var el = view.el;
    view.appendTo(document.body);
    view.set('text', 'foo');
    view.destroy();
    frame.defer(function(){
      assert(el.innerHTML === '');
      done();
    });
  });

  it('should not run attribute changes after it has been destroyed', function (done) {
    var View = ripple('<div id="{{text}}"></div>');
    view = new View();
    var el = view.el;
    view.appendTo(document.body);
    view.set('text', 'foo');
    view.destroy();
    frame.defer(function(){
      assert(el.id === '');
      done();
    });
  });

});