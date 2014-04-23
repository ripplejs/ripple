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
    view.appendTo(document.body);
    view.remove();
  })

  it('should mount using a selector', function (done) {
    View.on('mounted', function(){
      assert(document.body.contains(view.el));
      done();
    });
    view = new View();
    view.appendTo('body');
    view.remove();
  });

  it('should unmount', function(){
    view = new View();
    view.appendTo(document.body);
    var el = view.el;
    view.remove();
    assert(document.body.contains(el) === false);
  })

  it('should not unmount when mounting another element', function () {
    var test = document.createElement('div');
    document.body.appendChild(test);
    var count = 0;
    View.on('unmounted', function(){
      count++;
    });
    view = new View();
    view.appendTo('body');
    view.appendTo(test);
    assert(count === 0);
    view.remove();
  });

  it('should replace an element', function(){
    var test = document.createElement('div');
    document.body.appendChild(test);
    view = new View();
    view.replace(test);
    assert( test.parentNode == null );
    view.remove();
  });

  it('should insert before an element', function(){
    var test = document.createElement('div');
    document.body.appendChild(test);
    view = new View();
    view.before(test);
    assert( test.previousSibling === view.el );
    view.remove();
  });

  it('should insert after an element', function(){
    var test = document.createElement('div');
    test.classList.add('parentEl');
    document.body.appendChild(test);
    view = new View();
    view.after(".parentEl");
    assert( test.nextSibling === view.el );
    view.remove();
  });

  it('should not unmount if not mounted', function () {
    var count = 0;
    View.on('unmounted', function(){
      count += 1;
    });
    view = new View();
    view
      .appendTo('body')
      .remove()
      .remove();
    assert(count === 1);
  });
});