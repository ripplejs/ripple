var props = require('props');
var dom = require('fastdom');
var isBoolean = require('is-boolean-attribute');

/**
 * Creates a new attribute text binding for a view.
 * If the view attribute contains interpolation, the
 * attribute will be automatically updated whenever the
 * result of the expression changes.
 *
 * Updating will be called once per tick. So if there
 * are multiple changes to the view in a single tick,
 * this will only touch the DOM once.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 */
function AttrBinding(view, node, attr) {
  this.view = view;
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.isBoolean = isBoolean(attr);
  this.props = props(this.text);
  this.render = this.render.bind(this);
  this.bind();
}

/**
 * Start watching the view for changes
 */
AttrBinding.prototype.bind = function(){
  if(this.props.length) return;
  var view = this.view;
  var render = this.render;

  this.props.forEach(function(prop){
    view.watch(prop, render);
  });

  this.render();
};

/**
 * Stop watching the view for changes
 */
AttrBinding.prototype.unbind = function(){
  if(this.props.length) return;
  var view = this.view;
  var render = this.render;

  this.props.forEach(function(prop){
    view.unwatch(prop, render);
  });

  if(this.job) {
    dom.clear(this.job);
  }
};

/**
 * Update the attribute.
 */
AttrBinding.prototype.render = function(){
  var self = this;

  if(this.job) {
    dom.clear(this.job);
  }

  this.job = dom.write(function(){
    var val = self.view.interpolate(self.text);
    if(self.isBoolean && !val) {
      self.node.removeAttribute(self.attr);
    }
    else {
      self.node.setAttribute(self.attr, val);
    }
  });
};

module.exports = AttrBinding;