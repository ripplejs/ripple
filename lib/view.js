var emitter = require('emitter');
var model = require('./model');
var Bindings = require('./bindings');

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
   * @type {Bindings}
   */
  var bindings = new Bindings();

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
    options = options || {};
    View.emit('created', this, options);
    this.options = options;
    this.template = template;
    this.owner = options.owner;
    this.bindings = options.bindings || bindings;
    this.root = this.owner ? this.owner.root : this;
    this.model = new Model(this.initialize(options));
    this.data = this.model.props;
    this.el = this.render();
    View.emit('ready', this);
  }

  /**
   * Mixins
   */
  emitter(View);
  emitter(View.prototype);

  /**
   * Add a directive
   *
   * @param {String|Regex} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.directive = function(match, fn) {
    bindings.directive(match, fn);
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
    bindings.view(match, Child);
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
    bindings.filter(name, fn);
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
   * Create helper methods for binding to events
   */
  ['created', 'ready', 'mounted', 'unmounted', 'destroy'].forEach(function(name){
    View[name] = function(fn){
      View.on(name, function(view){
        fn.call(view);
      });
    };
  });

  /**
   * Set the initial state of the view. Accepts
   * a function that should return an object
   * that will be used for the initial state.
   */
  View.prototype.initialize = function(options) {
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
   * Remove the element from the DOM
   *
   * @return {View}
   */
  View.prototype.destroy = function() {
    this.remove();
    this.model.destroy();
    this.off();
    this.el = null;
    this.owner = null;
    this.root = null;
    this.data = null;
    View.emit('destroy', this);
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
    return this.bindings.bind(this);
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
    return this.bindings.interpolator.value(str, {
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
    return this.model.watch(prop, callback);
  };

  /**
   * Stop watching a property
   *
   * @param {Strign} prop
   * @param {Function} callback
   */
  View.prototype.unwatch = function(prop, callback) {
    return this.model.unwatch(prop, callback);
  };

  return View;
};