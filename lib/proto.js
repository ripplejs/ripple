var render = require('./bindings');
var Interpolator = require('interpolate');

/**
 * Run expressions
 *
 * @type {Interpolator}
 */

var interpolator = new Interpolator();

/**
 * Get a node using element the element itself
 * or a CSS selector
 *
 * @param {Element|String} node
 *
 * @return {Element}
 */

function getNode(node) {
  if (typeof node === 'string') {
    node = document.querySelector(node);
    if (node === null) throw new Error('node does not exist');
  }
  return node;
}

/**
 * Set the state off the view. This will trigger
 * refreshes to the UI. If we were previously
 * watching the parent scope for changes to this
 * property, we will remove all of those watchers
 * and then bind them to our model instead.
 *
 * @param {Object} obj
 */

exports.set = function(path, value) {
  if (typeof path !== 'string') {
    for(var name in path) this.set(name, path[name]);
    return this;
  }
  this.observer(path).set(value);
  return this;
};

/**
 * Get some data
 *
 * @param {String} path
 */

exports.get = function(path) {
  return this.observer(path).get();
};

/**
 * Get all the properties used in a string
 *
 * @param {String} str
 *
 * @return {Array}
 */

exports.props = function(str) {
  return interpolator.props(str);
};

/**
 * Remove the element from the DOM
 */

exports.destroy = function() {
  this.emit('destroying');
  this.view.emit('destroying', this);
  this.remove();
  this.observer.dispose();
  this.off();
};

/**
 * Is the view mounted in the DOM
 *
 * @return {Boolean}
 */

exports.isMounted = function() {
  return this.el != null && this.el.parentNode != null;
};

/**
 * Render the view to an element. This should
 * only ever render the element once.
 */

exports.render = function() {
  return render({
    view: this,
    template: this.template,
    directives: this.view.directives,
    components: this.view.components
  });
};

/**
 * Mount the view onto a node
 *
 * @param {Element|String} node An element or CSS selector
 *
 * @return {View}
 */

exports.appendTo = function(node) {
  getNode(node).appendChild(this.el);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Replace an element in the DOM with this view
 *
 * @param {Element|String} node An element or CSS selector
 *
 * @return {View}
 */

exports.replace = function(node) {
  var target = getNode(node);
  target.parentNode.replaceChild(this.el, target);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Insert the view before a node
 *
 * @param {Element|String} node
 *
 * @return {View}
 */

exports.before = function(node) {
  var target = getNode(node);
  target.parentNode.insertBefore(this.el, target);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Insert the view after a node
 *
 * @param {Element|String} node
 *
 * @return {View}
 */

exports.after = function(node) {
  var target = getNode(node);
  target.parentNode.insertBefore(this.el, target.nextSibling);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Remove the view from the DOM
 *
 * @return {View}
 */

exports.remove = function() {
  if (this.isMounted() === false) return this;
  this.el.parentNode.removeChild(this.el);
  this.emit('unmounted');
  this.view.emit('unmounted', this);
  return this;
};

/**
 * Interpolate a string
 *
 * @param {String} str
 */

exports.interpolate = function(str) {
  var self = this;
  var data = {};
  var props = this.props(str);
  props.forEach(function(prop){
    data[prop] = self.get(prop);
  });
  return interpolator.value(str, {
    context: this,
    scope: data,
    filters: this.view.filters
  });
};

/**
 * Watch a property for changes
 *
 * @param {Strign} prop
 * @param {Function} callback
 */

exports.watch = function(prop, callback) {
  var self = this;
  if (Array.isArray(prop)) {
    return prop.forEach(function(name){
      self.watch(name, callback);
    });
  }
  if (typeof prop === 'function') {
    this.observer.on('change', prop);
  }
  else {
    this.observer(prop).on('change', callback);
  }
  return this;
};

/**
 * Stop watching a property
 *
 * @param {Strign} prop
 * @param {Function} callback
 */

exports.unwatch = function(prop, callback) {
  var self = this;
  if (Array.isArray(prop)) {
    return prop.forEach(function(name){
      self.unwatch(name, callback);
    });
  }
  if (typeof prop === 'function') {
    this.observer.off('change', prop);
  }
  else {
    this.observer(prop).off('change', callback);
  }
  return this;
};