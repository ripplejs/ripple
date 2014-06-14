describe('owners', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var View, parent, grandchild, child;

  beforeEach(function () {
    var Parent = ripple('<div>Parent</div>');
    var Child = ripple('<div>Child</div>');
    var GrandChild = ripple('<div>GrandChild</div>');
    parent = new Parent();
    child = new Child(null, {
      owner: parent
    });
    grandchild = new GrandChild(null, {
      owner: child
    });
  });

  it('should be able to have an owner', function () {
    assert(child.owner === parent, 'child owner should be the parent');
    assert(grandchild.owner == child, 'grandchild owner should be the child');
  });

  it('should set the root', function () {
    assert(grandchild.root == parent);
    assert(child.root == parent);
  });

  it('should remove children when destroyed', function (done) {
    grandchild.on('destroying', function(){
      done();
    });
    parent.destroy();
  });

});