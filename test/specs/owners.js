describe('owners', function () {
  var ripple = require('ripple');
  var assert = require('assert');
  var View;

  beforeEach(function () {
    View = ripple('<div></div>');
  });

  it('should be able to have an owner', function () {
    var parent = new View();
    var child = new View().owner(parent);
    var grandchild = new View().owner(child);
    assert(child.owner() === parent);
    assert(child.root == parent);
    assert(grandchild.owner() == child);
    assert(grandchild.root == parent);
  });

});