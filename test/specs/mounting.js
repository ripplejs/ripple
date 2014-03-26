describe('mounting', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should mount to an element', function(done){
    View.on('mounted', function(){
      assert(document.body.contains(view.el));
      done();
    });
    view = new View();
    view.mount(document.body);
    view.unmount();
  })

  it('should mount using a selector', function (done) {
    View.on('mounted', function(){
      assert(document.body.contains(view.el));
      done();
    });
    view = new View();
    view.mount('body');
    view.unmount();
  });

  it('should unmount', function(){
    view = new View();
    view.mount(document.body);
    var el = view.el;
    view.unmount();
    assert(document.body.contains(el) === false);
  })

  it('should unmount when mounting another element', function () {
    var count = 0;
    View.on('unmounted', function(){
      count++;
    });
    view = new View();
    view.mount('body');
    view.mount('#mocha');
    assert(count === 1);
    view.unmount();
  });

  it('should replace an element', function(){
    var test = document.createElement('div');
    document.body.appendChild(test);
    view = new View();
    view.mount(test, {
      replace: true
    });
    assert( test.parentNode == null );
    view.unmount();
  });

  it('should not unmount if not mounted', function () {
    var count = 0;
    view = new View();
    view.on('unmounted', function(){
      count += 1;
    });
    View
      .mount('body')
      .unmount()
      .unmount();
    assert(count === 1);
  });
});