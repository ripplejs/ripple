var emitter = require('emitter');
var observer = require('path-observer');
var assert = require('assert');
var Bindings = require('./bindings');
var render = require('./render');

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
    if (!node) throw new Error('DOM node doesn\'t exist');
  }
  return node;
}

/**
 * Create a new view from a template string
 *
 * @param {String} template
 *
 * @return {View}
 */

function createView(template) {
  assert(template, 'Template is required');

  /**
   * Allow for a selector or an element to be passed in
   * as the template for the view
   */

  if (template.indexOf('#') === 0 || template.indexOf('.') === 0) {
    template = document.querySelector(template);
  }

  if (typeof template.innerHTML === 'string') {
    template = template.innerHTML;
  }

  /**
   * The view controls the lifecycle of the
   * element that it creates from a template.
   * Each element can only have one view and
   * each view can only have one element.
   */

  function View(attrs, options) {
    attrs = attrs || {};
    options = options || {};
    View.emit('construct', this, attrs, options);
    this.options = options;
    this.children = [];
    this.owner = options.owner;
    this.template = options.template || template;
    this.root = this;
    if (this.owner) {
      this.owner.children.push(this);
      this.root = this.owner.root;
    }
    this.attrs = attrs;
    this.observer = observer(attrs);
    View.emit('created', this);
    this.el = this.render();
    View.emit('ready', this);
  }

  /**
   * Mixins
   */

  emitter(View);
  emitter(View.prototype);

  /**
   * Stores all of the directives, views,
   * filters etc. that we might want to share
   * between views.
   *
   * @type {Bindings}
   */

  View.bindings = new Bindings();

  /**
   * Stores the attribute properties
   *
   * @type {Object}
   */

  View.attrs = {};

  /**
   * Add an attribute
   *
   * @param {String} name
   * @param {Object} options
   *
   * @return {View}
   */

  View.attr = function(name, options) {
    this.attrs[name] = options || {};

    this.on('construct', function(view, attrs){
      if (attrs[name] == null) {
        attrs[name] = options.default;
      }
      if(options.required) {
        assert(attrs[name] != null, name + ' is a required attribute');
      }
    });

    Object.defineProperty(this.prototype, name, {
      set: function(value) {
        this.set(name, value);
      },
      get: function() {
        return this.get(name);
      }
    });

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
    this.bindings.directive(match, fn);
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

  View.compose = function(name, Child) {
    this.bindings.component(name, Child);
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
    if (typeof name !== 'string') {
      for(var key in name) {
        View.filter(key, name[key]);
      }
      return;
    }
    this.bindings.filter(name, fn);
    return this;
  };

  /**
   * Use a plugin
   *
   * @return {View}
   */

  View.use = function(fn, options) {
    fn(View, options);
    return this;
  };

  /**
   * Access to this view constructor
   *
   * @type {View}
   */

  View.prototype.view = View;

  /**
   * Set the state off the view. This will trigger
   * refreshes to the UI. If we were previously
   * watching the parent scope for changes to this
   * property, we will remove all of those watchers
   * and then bind them to our model instead.
   *
   * @param {Object} obj
   */

  View.prototype.set = function(path, value) {
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

  View.prototype.get = function(path) {
    return this.observer(path).get();
  };

  /**
   * Get all the properties used in a string
   *
   * @param {String} str
   *
   * @return {Array}
   */

  View.prototype.props = function(str) {
    return View.bindings.interpolator.props(str);
  };

  /**
   * Remove the element from the DOM
   */

  View.prototype.destroy = function() {
    this.emit('destroying');
    View.emit('destroying', this);
    this.remove();
    this.observer.dispose();
    this.off();
    this.children.forEach(function(child){
      child.destroy();
    });
    if (this.owner) {
      var index = this.owner.children.indexOf(this);
      this.owner.children.splice(index, 1);
    }
    this.el = null;
    this.owner = null;
    this.root = null;
    this.data = null;
    this.emit('destroyed');
    View.emit('destroyed', this);
  };

  /**
   * Is the view mounted in the DOM
   *
   * @return {Boolean}
   */

  View.prototype.isMounted = function() {
    return this.el != null && this.el.parentNode != null;
  };

  /**
   * Render the view to an element. This should
   * only ever render the element once.
   */

  View.prototype.render = function() {
    return render({
      view: this,
      template: this.template,
      bindings: View.bindings
    });
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
    this.emit('mounted');
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
    var target = getNode(node);
    target.parentNode.replaceChild(this.el, target);
    this.emit('mounted');
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
    var target = getNode(node);
    target.parentNode.insertBefore(this.el, target);
    this.emit('mounted');
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
    target.parentNode.insertBefore(this.el, target.nextSibling);
    this.emit('mounted');
    View.emit('mounted', this);
    return this;
  };

  /**
   * Remove the view from the DOM
   *
   * @return {View}
   */

  View.prototype.remove = function() {
    if (this.isMounted() === false) return this;
    this.el.parentNode.removeChild(this.el);
    this.emit('unmounted');
    View.emit('unmounted', this);
    return this;
  };

  /**
   * Interpolate a string
   *
   * @param {String} str
   */

  View.prototype.interpolate = function(str) {
    var self = this;
    var data = {};
    var props = this.props(str);
    props.forEach(function(prop){
      data[prop] = self.get(prop);
    });
    return View.bindings.interpolator.value(str, {
      context: this,
      scope: data
    });
  };

  /**
   * Watch a property for changes
   *
   * @param {Strign} prop
   * @param {Function} callback
   */

  View.prototype.watch = function(prop, callback) {
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

  View.prototype.unwatch = function(prop, callback) {
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

  return View;
}


/**
 * Exports
 */

module.exports = createView;