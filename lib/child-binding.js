var attrs = require('attributes');
var each = require('each');
var unique = require('uniq');
var dom = require('fastdom');

/**
 * Creates a new sub-view at a node and binds
 * it to the parent
 *
 * @param {View} view
 * @param {Element} node
 * @param {Function} View
 */
function ChildBinding(view, node, View) {
  this.view = view;
  this.node = node;
  this.attrs = attrs(node);
  this.update = this.update.bind(this);
  this.child = new View({
    owner: view,
    data: {
      '$content': node.innerHTML
    }
  });
  this.child.replace(node);
  this.child.on('destroy', this.unbind.bind(this));
  this.props = this.getProps();
  this.bind();
}

/**
 * Get all of the properties used in all of the attributes
 *
 * @return {Array}
 */
ChildBinding.prototype.getProps = function(){
  var ret = [];
  var interpolator = this.view.compiler.interpolator;
  each(this.attrs).forEach(function(name, value){
    ret.concat(interpolator.props(value));
  });
  return unique(ret);
};

/**
 * Bind to changes on the view. Whenever a property
 * changes we'll update the child with the new values.
 */
ChildBinding.prototype.bind = function(){
  var self = this;
  var view = this.view;

  this.props.forEach(function(prop){
    view.watch(prop, self.update);
  });

  this.update();
};

/**
 * Unbind this view from the parent
 */
ChildBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });
};

/**
 * Update the child view will updated values from
 * the parent. This will batch changes together
 * and only fire once per tick.
 */
ChildBinding.prototype.update = function(){
  var child = this.child;
  var view = this.view;
  var attrs = this.attrs;

  if(this.job) {
    dom.clear(this.job);
  }

  this.job = dom.write(function(){
    each(attrs, function(name, value){
      child.set(name, view.interpolate(value));
    });
  });
};

module.exports = ChildBinding;
