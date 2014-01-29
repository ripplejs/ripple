var domify = require('domify');
var Scope = require('scope');
var Compiler = require('compiler');
var emitter = require('emitter');
var clone = require('clone');
var Adapter = require('adapter');

/**
 * Constructor
 */
function Ripple() {
  if(!(this instanceof Ripple)) return new Ripple();
  this.directives = {};
  this.bindings = {};
}

/**
 * Mixin
 */
emitter(Ripple.prototype);

/**
 * Add a plugin
 *
 * @param {Function} fn
 *
 * @return {Ripple}
 */
Ripple.prototype.use = function(fn) {
  fn(this);
  return this;
};

/**
 * Compile a template into a function that can be used
 * to create element using data
 *
 * @param {String|Element} template
 *
 * @return {Function}
 */
Ripple.prototype.compile = function(template, model) {
  var self = this;
  if(typeof template === 'string') template = domify(template);
  var compiler = new Compiler(clone(self.directives), clone(self.bindings));
  self.emit('compile', compiler, model);
  return compiler.compile(template, model);
};

/**
 * Add a new attribute binding
 *
 * @param {String} name
 * @param {Function} fn
 * @param {Object} options
 *
 * @return {Ripple}
 */
Ripple.prototype.binding = function(name, fn, options) {
  this.binding[name] = {
    name: name,
    process: fn,
    options: options || {}
  };
  return this;
};

/**
 * Add a new custom view
 *
 * @param {Function} fn
 * @param {Object} options
 *
 * @return {Ripple}
 */
Ripple.prototype.view = function(fn, options) {
  var name = fn.name.toLowerCase();
  this.directives[name] = {
    name: name,
    process: fn,
    options: options || {}
  };
  return this;
};

/**
 * This wraps each of the objects passed in as scopes.
 * Override this function if you have custom objects
 *
 * @param {Object} obj
 *
 * @return {void}
 */
Ripple.prototype.adapter = function(obj) {
  return new Adapter(obj);
};

/**
 * Export
 *
 * @type {Function}
 */
module.exports = Ripple;