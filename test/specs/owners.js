describe('owners', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var View, parent, grandchild, child;

  beforeEach(function () {
    View = ripple('<div></div>');
    parent = new View();
    child = new View(null, {
      owner: parent
    });
    grandchild = new View(null, {
      owner: child
    });
  });

  it('should be able to have an owner', function () {
    assert(child.owner === parent);
    assert(grandchild.owner == child);
  });

  it('should set the root', function () {
    assert(grandchild.root == parent);
    assert(child.root == parent);
  });

  it('should store the children', function () {
    assert(parent.children[0] === child);
    assert(child.children[0] === grandchild);
  });

  it('should remove when a child is destroyed', function () {
    child.destroy();
    assert(parent.children.length === 0);
  });

  it('should remove children when destroyed', function () {
    parent.destroy();
    assert(parent.children.length === 0);
    assert(child.children.length === 0);
  });

});