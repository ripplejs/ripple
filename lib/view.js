var emitter = require('emitter');
var model = require('./model');
var Compiler = require('./compiler');

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
  function View(data) {
    View.emit('creating', this, data);
    this.root = this;
    this.template = template;
    this.compiler = compiler;
    this.model = new Model(this.getInitialState());
    this.model.set(data);
    this.data = this.model.props;
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
  View.prototype.getInitialState = function() {
    return;
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
    this.owner = null;
    this.compiler = null;
    this.root = null;
    this.data = null;
    this.unmount();
    this.model.destroy();
    this.off();
  };

  /**
   * Is the view mounted in the DOM
   *
   * @return {Boolean}
   */
  View.prototype.isMounted = function(){
    return this.el != null && this.el.parentNode;
  };

  /**
   * Mount the view onto a node
   *
   * @param {Element} node
   *
   * @return {View}
   */
  View.prototype.mount = function(node, options) {
    options = options || {};
    if(this.isMounted()) this.unmount();
    View.emit('mounting', this);
    this.el = this.compiler.render(this);
    if(typeof node === 'string') {
      node = document.querySelector(node);
    }
    if(options.replace) {
      node.parentNode.replaceChild(this.el, node);
    }
    else {
      node.appendChild(this.el);
    }
    View.emit('mounted', this);
    return this;
  };

  /**
   * Remove the element from the DOM
   *
   * @return {View}
   */
  View.prototype.unmount = function() {
    if(this.isMounted() === false) return this;
    View.emit('unmounting', this);
    this.el.parentNode.removeChild(this.el);
    this.el = null;
    View.emit('unmounted', this);
    return this;
  };

  /**
   * Interpolate a string using the views props and state.
   * Takes a callback that will be fired whenever the
   * attributes used in the string change.
   *
   * @param {String} str
   * @param {Function} callback
   *
   * @return {void}
   */
  View.prototype.createTextBinding = function(str, callback) {
    var self = this;
    var interpolator = this.compiler.interpolator;
    function render() {
      callback(self.interpolate(str));
    }
    interpolator.props(str).forEach(function(prop){
      self.watch(prop, render);
      self.on('unmounted', function(){
        self.unwatch(prop, render);
      });
    });
    render();
  };

  /**
   * Interpolate a string once
   *
   * @param {String} str
   */
  View.prototype.interpolate = function(str) {
    return this.compiler.interpolate(this, str, {
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