var emitter = require('emitter');
var model = require('./model');
var Compiler = require('./compiler');

/**
 * Get a node using element the element itself
 * or a CSS selector
 *
 * @param {Element|String} node
 *
 * @return {Element}
 */
function getNode(node) {
  if(typeof node === 'string') {
    node = document.querySelector(node);
    if(!node) throw new Error('DOM node doesn\'t exist');
  }
  return node;
}

module.exports = function(template) {

  /**
   * Stores all of the directives, views,
   * filters etc. that we might want to share
   * between views.
   *
   * @type {Compiler}
   */
  var compiler = new Compiler();

  /**
   * Stores the state of the view.
   *
   * @type {Function}
   */
  var Model = model();

  /**
   * The view controls the lifecycle of the
   * element that it creates from a template.
   * Each element can only have one view and
   * each view can only have one element.
   */
  function View(options) {
    View.emit('creating', this, options);
    this.root = this;
    this.template = template;
    this.owner(options.owner);
    this.model = new Model(this.getInitialState(options));
    this.data = this.model.props;
    this.el = this.render();
    View.emit('created', this);
  }

  /**
   * Mixins
   */
  emitter(View);
  emitter(View.prototype);

  /**
   * Set the compiler for this view class
   *
   * @param {Compiler} newCompiler
   *
   * @return {View}
   */
  View.compiler = function(newCompiler) {
    compiler = newCompiler;
    return this;
  };

  /**
   * Add a directive
   *
   * @param {String|Regex} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.directive = function(match, fn) {
    compiler.directive(match, fn);
    return this;
  };

  /**
   * Add a component
   *
   * @param {String} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.compose = function(match, Child) {
    compiler.compose(match, Child);
    return this;
  };

  /**
   * Add interpolation filter
   *
   * @param {String} name
   * @param {Function} fn
   *
   * @return {View}
   */
  View.filter = function(name, fn) {
    compiler.filter(name, fn);
    return this;
  };

  /**
   * Set the interpolation delimiters
   *
   * @param {Regex} match
   *
   * @return {View}
   */
  View.delimiters = function(match) {
    compiler.delimiters(match);
    return this;
  };

  /**
   * Use a plugin
   *
   * @return {View}
   */
  View.use = function(fn, options){
    fn(View, options);
    return this;
  };

  /**
   * Set the initial state of the view. Accepts
   * a function that should return an object
   * that will be used for the initial state.
   */
  View.prototype.getInitialState = function(options) {
    return options.data;
  };

  /**
   * Set the state off the view. This will trigger
   * refreshes to the UI
   *
   * @param {Object} obj
   */
  View.prototype.set = function(key, value) {
    this.model.set(key, value);
    return this;
  };

  /**
   * Get some data
   *
   * @param {String} key
   */
  View.prototype.get = function(key) {
    return this.model.get(key);
  };

  /**
   * Set the owner
   *
   * @param {View} newOwner
   *
   * @return {View}
   */
  View.prototype.owner = function(newOwner) {
    if(!newOwner) return this.$owner;
    this.$owner = newOwner;
    this.root = newOwner.root;
    return this;
  };

  /**
   * Remove the element from the DOM
   *
   * @return {View}
   */
  View.prototype.destroy = function() {
    View.emit('destroyed', this);
    this.remove();
    this.model.destroy();
    this.off();
    this.el = null;
    this.owner = null;
    this.root = null;
    this.data = null;
  };

  /**
   * Is the view mounted in the DOM
   *
   * @return {Boolean}
   */
  View.prototype.isMounted = function(){
    return this.el != null && this.el.parentNode != null;
  };

  /**
   * Render the view to an element. This should
   * only ever render the element once.
   *
   * @return {View}
   */
  View.prototype.render = function(){
    return compiler.render(this);
  };

  /**
   * Mount the view onto a node
   *
   * @param {Element|String} node An element or CSS selector
   *
   * @return {View}
   */
  View.prototype.appendTo = function(node) {
    getNode(node).appendChild(this.el);
    View.emit('mounted', this);
    return this;
  };

  /**
   * Replace an element in the DOM with this view
   *
   * @param {Element|String} node An element or CSS selector
   *
   * @return {View}
   */
  View.prototype.replace = function(node) {
    node.parentNode.replaceChild(this.el, getNode(node));
    View.emit('mounted', this);
    return this;
  };

  /**
   * Insert the view before a node
   *
   * @param {Element|String} node
   *
   * @return {View}
   */
  View.prototype.before = function(node) {
    node.parentNode.insertBefore(this.el, getNode(node));
    View.emit('mounted', this);
    return this;
  };

  /**
   * Insert the view after a node
   *
   * @param {Element|String} node
   *
   * @return {View}
   */
  View.prototype.after = function(node) {
    var target = getNode(node);
    if(target.nextSibling) {
      node.parentNode.insertBefore(this.el, target.nextSibling);
      View.emit('mounted', this);
    }
    else {
      this.mount(node.parentNode);
    }
    return this;
  };

  /**
   * Remove the view from the DOM
   *
   * @return {View}
   */
  View.prototype.remove = function(){
    if(this.isMounted() === false) return this;
    this.el.parentNode.removeChild(this.el);
    View.emit('unmounted', this);
    return this;
  };

  /**
   * Interpolate a string once
   *
   * @param {String} str
   */
  View.prototype.interpolate = function(str) {
    return compiler.interpolate(this, str, {
      context: this,
      scope: this.data
    });
  };

  /**
   * Watch a property for changes
   *
   * @param {Strign} prop
   * @param {Function} callback
   */
  View.prototype.watch = function(prop, callback) {
    if(Array.isArray(prop)) {
      prop.forEach(function(name){
        this.watch(name, callback);
      }, this);
      return;
    }
    return this.model.watch(prop, callback);
  };

  /**
   * Stop watching a property
   *
   * @param {Strign} prop
   * @param {Function} callback
   */
  View.prototype.unwatch = function(prop, callback) {
    if(Array.isArray(prop)) {
      prop.forEach(function(name){
        this.unwatch(name, callback);
      }, this);
      return;
    }
    return this.model.unwatch(prop, callback);
  };

  return View;
};