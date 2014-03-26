describe.skip('text interpolation', function () {
  var assert = require('assert');
  var ripple = require('ripple');
  var dom = require('fastdom');
  var View, view, el;

  beforeEach(function () {
    View = ripple('<div>{{text}}</div>');
    view = new View({
      text: 'Ted'
    });
    view.mount('body');
  });

  afterEach(function(){
    view.unmount();
  });

  it('should interpolate text nodes', function(done){
    dom.defer(function(){
      assert(el.innerHTML === 'Ted');
      done();
    });
  })

  it('should batch text node interpolation', function(){
    var view = new View();
    assert(el.innerHTML !== 'Ted');
  })

  it('should update interpolated text nodes', function(done){
    view.set('text', 'Fred');
    dom.defer(function(){
      assert(el.innerHTML === 'Fred');
      done();
    });
  })

  it('should handle elements as values', function(done){
    var test = document.createElement('div');
    view.set('text', test);
    dom.defer(function(){
      assert(el.firstChild === test);
      done();
    });
  })

  it('should update elements as values', function(done){
    var test = document.createElement('div');
    var test2 = document.createElement('ul');
    view.set('text', test);
    dom.defer(function(){
      view.set('text', test2);
      dom.defer(function(){
        assert(el.firstChild === test2);
        done();
      });
    });
  })

  it('should handle when the value is no longer an element', function(done){
    var test = document.createElement('div');
    view.set('text', test);
    dom.defer(function(){
      view.set('text', 'bar');
      dom.defer(function(){
        assert(el.innerHTML === 'bar');
        done();
      });
    });
  });

  it('should throw errors for undefined variables', function(done){
    View = ripple('<div>{{text}}</div>');
    view = new View();
    try {
      view.mount('body');
    }
    catch(e) {
      done();
    }
  });

  it('should update from an non-string value', function(done){
    view.set('text', null);
    dom.defer(function(){
      view.set('text', 'bar');
      dom.defer(function(){
        assert(el.innerHTML === 'bar');
        done();
      });
    });
  });

  describe('rendering empty strings', function () {
    afterEach(function (done) {
      dom.defer(function(){
        assert(el.innerHTML === '');
        done();
      });
    });
    it('should render null', function(){
      view.set('text', null);
    });
    it('should render false', function(){
      view.set('text', false);
    });
    it('should render true', function(){
      view.set('text', true);
    });
  });
});