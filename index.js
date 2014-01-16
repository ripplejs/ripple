var domify = require('domify');
var Scope = require('scope');
var Compiler = require('compiler');
var emitter = require('emitter');
var toArray = require('to-array');
var clone = require('clone');
var Adapter = require('adapter');

/**
 * Constructor
 */
function Ripple() {
  if(!(this instanceof Ripple)) return new Ripple();
  this.directives = {};
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
Ripple.prototype.compile = function(template) {
  var self = this;
  if(typeof template === 'string') template = domify(template);
  return function() {
    var scopes = toArray(arguments).map(self.adapter);
    var scope = new Scope(scopes);
    var compiler = new Compiler(clone(self.directives));
    self.emit('compile', compiler, scope);
    return compiler.compile(template, scope);
  };
};

/**
 * Create a new directive
 *
 * Function is in the form fn(scope, el, value)
 *   - The current scope
 *   - The element
 *   - The value of the directive attribute
 *
 * Options available:
 *   - processChildren (boolean) Keep processing children
 *   - terminal (boolean) Stop processing entirely
 *
 * @param {String} name
 * @param {Function} fn
 * @param {Object} [options]
 *
 * @return {Ripple}
 */
Ripple.prototype.directive = function(name, fn, options) {
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