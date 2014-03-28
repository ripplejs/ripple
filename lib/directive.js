var dom = require('fastdom');

/**
 * Creates a new directive using a binding object.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 * @param {Object} binding
 */
function Directive(view, node, attr, binding) {
  this.view = view;
  if(typeof binding === 'function') {
    this.binding = { update: binding };
  }
  else {
    this.binding = binding;
  }
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.bindings.interpolator.props(this.text);
  this.bind();
}

/**
 * Start watching the view for changes
 */
Directive.prototype.bind = function(){
  var view = this.view;
  var update = this.update;

  if(this.binding.bind) {
    this.binding.bind.call(this);
  }

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.binding.update.call(this, view.interpolate(this.text));
};

/**
 * Stop watching the view for changes
 */
Directive.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    dom.clear(this.job);
  }

  if(this.binding.unbind) {
    this.binding.unbind.call(this);
  }
};

/**
 * Update the attribute.
 */
Directive.prototype.update = function(){
  var self = this;
  var view = this.view;
  var binding = this.binding;
  var text = this.text;

  if(this.job) {
    dom.clear(this.job);
  }

  this.job = dom.write(function(){
    binding.update.call(self, view.interpolate(text));
  });
};

module.exports = Directive;