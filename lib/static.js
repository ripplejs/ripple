var type = require('type');

/**
 * Add an attribute. This allows attributes to be created
 * and set with attributes. It also creates getters and
 * setters for the attributes on the view.
 *
 * @param {String} name
 * @param {Object} options
 *
 * @return {View}
 */

exports.attr = function(name, options) {
  options = options || {};
  this.attrs[name] = options;
  this.on('construct', function(view, attrs){
    if (attrs[name] == null) {
      attrs[name] = options.default;
    }
    if (options.required && attrs[name] == null) {
      throw new Error(name + ' is a required attribute');
    }
    if (options.type && attrs[name] != null && type(attrs[name]) !== options.type) {
      throw new Error(name + ' should be type "' + options.type + '"');
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

exports.directive = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.directive(key, name[key]);
    }
    return;
  }
  this.directives[name] = fn;
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

exports.compose = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.compose(key, name[key]);
    }
    return;
  }
  this.components[name.toLowerCase()] = fn;
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

exports.filter = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.filter(key, name[key]);
    }
    return;
  }
  this.filters[name] = fn;
  return this;
};

/**
 * Use a plugin
 *
 * @return {View}
 */

exports.use = function(fn, options) {
  fn(this, options);
  return this;
};
