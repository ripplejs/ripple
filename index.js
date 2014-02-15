var Compiler = require('compiler');
var view = require('view');

/**
 * Returns a function that creates a view
 * and adds a ripple-compiler to it
 *
 * @type {Function}
 */
module.exports = function(template) {
  if(template.nodeType) template = template.outerHTML;

  var compiler = new Compiler();
  var View = view(template);

  View.component = function(name, fn) {
    compiler.addComponent(name, fn);
    return this;
  };

  View.directive = function(name, fn) {
    compiler.addAttribute(name, fn);
    return this;
  };

  View.render(function(view){
    compiler.compile(view);
  });

  return View;
};