describe('View', function(){
  var assert = require('assert');
  var createView = require('ripple/lib/view');

  var View;

  beforeEach(function(){
    View = createView('<div></div>');
  });

  it('should construct', function(){
    var view = new View();
  })

  it('should construct with properties', function(){
    var view = new View({
      foo: 'bar'
    });
    assert(view.props.foo === 'bar');
  })

  describe('getting values', function () {

    it('should get values from the state first', function () {
      var view = new View({
        foo: 'bar'
      });
      view.state.set('foo', 'baz');
      assert( view.get('foo') === 'baz' );
    });

    it('should get values from the props', function () {
      var view = new View({
        one: 'prop'
      });
      assert( view.get('one') === 'prop' );
    });

    it('should get state from the owner', function () {
      var parent = new View();
      parent.state.set('one', 'one');
      var child = new View(null, {
        owner: parent
      });
      child.state.set('foo', 'bar');
      assert( child.get('foo') === 'bar' );
      assert( child.get('one') === 'one' );
    });

  });

  describe('state', function () {

    it('should set state', function(){
      var view = new View();
      view.state.set('foo', 'bar');
      assert(view.state.get('foo') === 'bar');
    })

    it.skip('should get state with accessors', function () {
      var view = new View();
      view.state.set('foo', 'bar');
      assert(view.state.foo === 'bar');
    });

    it('should set state with accessors', function () {
      var view = new View();
      view.set('foo', 'baz');
      view.state.foo = 'bar';
      assert(view.state.foo === 'bar');
    });

    it('should have computed properties', function(){
      View.computed('fullname', ['firstname', 'lastname'], function(first, last){
        return [first,last].join(' ');
      });
      var view = new View();
      view.set({
        'firstname': 'Bruce',
        'lastname': 'Willis'
      });
      assert(view.state.get('fullname') === 'Bruce Willis');
      view.state.set('firstname', 'Danny');
      assert(view.state.get('fullname') === 'Danny Willis');
    })

    it('should have computed properties with nested dependencies', function(){
      View.computed('fullname', ['names.first', 'names.last'], function(first, last){
        return [first,last].join(' ');
      });
      var view = new View();
      view.set({
        names: {
          first: 'Bruce',
          last: 'Willis'
        }
      });
      assert(view.get('fullname') === 'Bruce Willis');
      view.set({
        names: {
          first: 'Jet',
          last: 'Li'
        }
      });
      assert(view.get('fullname') === 'Jet Li');
    })

    it('should watch for changes', function(done){
      var view = new View();
      view.change('foo', function(){
        done();
      })
      view.set('foo', 'bar');
    })

    it('should be able to set default properties', function () {
      View.on('created', function(){
        this.state.set({
          first: 'Fred',
          last: 'Flintstone'
        });
      });
      var view = new View();
      view.set('first', 'Wilma');
      assert(view.get('first') === 'Wilma');
      assert(view.get('last') === 'Flintstone');
    });

  });

  describe('props', function () {

    it('should set props when created', function () {
      var view = new View({
        foo: 'bar'
      });
      assert(view.props.get('foo') === 'bar');
    });

    it('should not allow setting new props', function(){
      var view = new View({
        foo: 'bar'
      });
      view.props.set('bar', 'foo');
      assert( view.props.get('bar') === undefined )
    })

  });

  describe('having an owner', function () {

    it('should be able to have an owner', function () {
      var parent = new View();
      var child = new View(null, { owner: parent });
      var grandchild = new View(null, { owner: child });
      assert(child.owner === parent);
      assert(child.root == parent);
      assert(grandchild.owner == child);
      assert(grandchild.root == parent);
    });

    it('should get state from the owner', function () {
      var parent = new View();
      parent.state.set('foo', 'bar');
      var child = new View(null, { owner: parent });
      var grandchild = new View(null, { owner: child });
      assert(grandchild.get('foo') === 'bar');
    });

  });

  describe('lifecycle events', function () {

    it('should bind created callback to the instance', function () {
      View.on('created', function(){
        this.set('foo', 'bar');
      })
      var view = new View();
      assert(view.get('foo') === 'bar');
    });

  });

  describe('using plugins', function () {

    it('should expose a use method', function () {
      View.use(function(Child){
        Child.on('created', function(){
          this.set('foo', 'bar');
        });
      });
      var view = new View();
      assert(view.get('foo') === 'bar');
    });

  });

  describe('destroying the view', function () {

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

  });

})