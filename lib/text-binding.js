var raf = require('raf-queue');

/**
 * Create a new text binding on a node
 *
 * @param {View} view
 * @param {Element} node
 */

function TextBinding(view, node) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = view.props(this.text);
  this.render = this.render.bind(this);
  if (this.props.length) {
    this.bind();
  }
}

/**
 * Bind changes in the expression to the view
 */

TextBinding.prototype.bind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

/**
 * Stop watching the expression for changes
 */

TextBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if (this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Render the expression value to the DOM
 */

TextBinding.prototype.render = function(){
  var node = this.node;
  var val = this.view.interpolate(this.text);

  if (val == null) {
    this.node.data = '';
  }
  else if (val instanceof Element) {
    node.parentNode.replaceChild(val, node);
    this.node = val;
  }
  else if (val.el instanceof Element) {
    node.parentNode.replaceChild(val.el, node);
    this.node = val.el;
  }
  else {
    var newNode = document.createTextNode(val);
    node.parentNode.replaceChild(newNode, node);
    this.node = newNode;
  }
};

/**
 * Schedule an update to the text element on the next frame.
 * This will only ever trigger one render no matter how
 * many times it is called
 */

TextBinding.prototype.update = function(){
  if (this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = TextBinding;
