var emitter = require('emitter');
var render = require('./render');
var Interpolator = require('interpolate');

/**
 * The compiler will take a set of views, an element and
 * a scope and process each node going down the tree. Whenever
 * it finds a node matching a directive it will process it.
 */
function Compiler(options) {
  this.views = {};
  this.directives = {};
  this.interpolator = new Interpolator();
  this.options = options;
}

/**
 * Mixins
 */
emitter(Compiler.prototype);

/**
 * For plugins
 *
 * @param {Function} fn
 *
 * @return {Compiler}
 */
Compiler.prototype.use = function(fn) {
  fn(this);
  return this;
};

/**
 * Add a component binding. This will be rendered as a separate
 * view and have it's own scope.
 *
 * @param {String|Regex} matches String or regex to match an element name
 * @param {Function} View
 * @param {Object} options
 */
Compiler.prototype.compose = function(matches, fn) {
  this.views[matches.toLowerCase()] = fn;
  return this;
};

/**
 * Add an attribute binding. Whenever this attribute is matched
 * in the DOM the function will be code with the current view
 * and the element.
 *
 * @param {String|Regex} matches String or regex to match an attribute name
 * @param {Function} process
 * @param {Object} options
 */
Compiler.prototype.directive = function(matches, fn) {
  this.directives[matches] = fn;
  return this;
};

/**
 * Check if there's a component for this element
 *
 * @param {Element} el
 *
 * @return {Mixed}
 */
Compiler.prototype.getComponentBinding = function(el) {
  return this.views[el.nodeName.toLowerCase()];
};

/**
 * Get the attribute binding for an attribute
 *
 * @param {String} attr
 *
 * @return {Mixed}
 */
Compiler.prototype.getAttributeBinding = function(attr) {
  return this.directives[attr];
};

/**
 * Add an interpolation filter
 *
 * @param {String} name
 * @param {Function} fn
 *
 * @return {Compiler}
 */
Compiler.prototype.filter = function(name, fn) {
  this.interpolator.filter(name, fn);
  return this;
};

/**
 * Set the expression delimiters
 *
 * @param {Regex} match
 *
 * @return {Compiler}
 */
Compiler.prototype.delimiters = function(match) {
  this.interpolator.delimiters(match);
  return this;
};

/**
 * Check if a filter is available
 *
 * @param {String} name
 *
 * @return {Boolean}
 */
Compiler.prototype.hasFilter = function(name) {
  return this.interpolator.filters[name] != null;
};

/**
 * Render a template and a view
 *
 * @param {View} view
 *
 * @return {Element}
 */
Compiler.prototype.render = function(view) {
  return render(this, view);
};

/**
 * Interpolate a string using a view
 *
 * @param {View} view
 * @param {String} str
 * @param {Object} options
 */
Compiler.prototype.interpolate = function(view, str, options) {
  return this.interpolator.value(str, options);
};


Compiler.prototype.node = function(view, str, callback) {
  var interpolator = this.interpolator;
  function render() {
    callback(view.interpolate(str));
  }
  interpolator.props(str).forEach(function(prop){
    view.watch(prop, render);
    view.on('unmounted', function(){
      view.unwatch(prop, render);
    });
  });
  render();
};

module.exports = Compiler;