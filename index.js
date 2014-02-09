var Compiler = require('compiler');
var emitter = require('emitter');
var view = require('view');

/**
 * Constructor
 */
function Ripple() {
  if(!(this instanceof Ripple)) return new Ripple();
  this.compiler = new Compiler();
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
 * Compile a template into a View
 *
 * @param {String|Element} template
 *
 * @return {Function} View
 */
Ripple.prototype.compile = function(template) {
  var self = this;
  return view(template, function(obj){
    self.compiler.compile(obj);
  });
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
Ripple.prototype.attribute = function(name, fn) {
  this.compiler.addAttribute(name, fn);
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
Ripple.prototype.component = function(name, fn) {
  this.compiler.addComponent(name, fn);
  return this;
};

/**
 * Export
 *
 * @type {Function}
 */
module.exports = Ripple;