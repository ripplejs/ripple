var Compiler = require('compiler');
var view = require('view');
var interpolate = require('interpolate');

/**
 * Returns a function that creates a view
 * and adds a ripple-compiler to it
 *
 * @type {Function}
 */
module.exports = function(template) {
  var compiler = new Compiler();
  var View = view(template);
  var filters = {};

  /**
   * Add a component
   *
   * @param {String} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.component = function(match, fn) {
    compiler.addComponent(match, fn);
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
    compiler.addAttribute(match, fn);
    return this;
  };

  /**
   * Add an interpolation filter
   *
   * @param {String} name
   * @param {Function} fn
   *
   * @return {View}
   */
  View.filter = function(name, fn) {
    filters[name] = fn;
    return this;
  };

  /**
   * Run an interpolation on the string using the state. Whenever
   * the model changes it will render the string again
   *
   * @param {String} str
   * @param {Function} callback
   *
   * @return {Function} a function to unbind the interpolation
   */
  View.prototype.interpolate = function(str, callback) {
    var self = this;
    var attrs = interpolate.props(str);
    if(attrs.length === 0) return;
    function render() {
      return interpolate(str, self.get(attrs), filters);
    }
    if(!callback) return render();
    callback(render());
    return this.change(attrs, function(){
      callback(render());
    });
  };

  /**
   * Causes all bindings that are watching
   * this view to attach themselves
   *
   * @return {View}
   */
  View.prototype.bind = function(){
    if(this.bound) return this;
    this.bound = true;
    this.emit('bind', this);
    return this;
  };

  /**
   * Unbind all events and binding from the view,
   * leaving just the element in place
   * @return {View}
   */
  View.prototype.unbind = function(){
    if(!this.bound) return this;
    this.bound = false;
    this.emit('unbind', this);
    return this;
  };

  /**
   * When the view renders the compiler
   * will run over element and bind it
   *
   * @param {View} view
   *
   * @return {void}
   */
  View.prototype.render = function(){
    compiler.compile(this);
  };

  return View;
};