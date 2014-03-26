describe.skip('attribute interpolation', function () {
  var el, View, view;

  beforeEach(function () {
    View = ripple('<div id="{{foo}}" hidden="{{hidden}}"></div>');
    view = new View({
      foo: 'bar',
      hidden: true
    });
    view.mount(document.body);
  });

  afterEach(function () {
    view.unmount();
  });

  it('should interpolate attributes', function(done){
    dom.defer(function(){
      assert(el.id === 'bar');
      done();
    });
  })

  it('should update interpolated attributes', function(){
    view.set('foo', 'baz');
    dom.defer(function(){
      assert(el.id === 'baz');
    });
  })

  it('should toggle boolean attributes', function(){
    dom.defer(function(){
      assert(el.hasAttribute('hidden'));
      view.set('hidden', false);
      dom.defer(function(){
        assert(el.hasAttribute('hidden') === false);
      });
    });
  })

});