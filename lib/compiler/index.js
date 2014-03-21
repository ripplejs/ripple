var walk = require('dom-walk');
var emitter = require('emitter');
var isBoolean = require('is-boolean-attribute');
var dom = require('fastdom');
var domify = require('domify');
var each = require('each');
var attrs = require('attributes');

/**
 * Attach the view to a DocumentFragment
 *
 * @param {View} view
 *
 * @return {DocumentFragment}
 */
function attachToFragment(el) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);
  return fragment;
}


/**
 * The compiler will take a set of views, an element and
 * a scope and process each node going down the tree. Whenever
 * it finds a node matching a directive it will process it.
 */
function Compiler(options) {
  this.components = {};
  this.directives = {};
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
Compiler.prototype.component = function(matches, fn) {
  this.components[matches.toLowerCase()] = fn;
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
  return this.components[el.nodeName.toLowerCase()];
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
 * Compile a template into an element and
 * bind it to this view
 *
 * @return {Element}
 */
Compiler.prototype.render = function(template, view) {
  var self = this;
  this.view = view;
  var el = domify(template);
  var fragment = attachToFragment(el);
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      self.processTextNode(node);
    }
    else if(node.nodeType === 1) {
      self.processNode(node);
    }
    next();
  });
  return fragment.firstChild;
};


/**
 * Process a text node. Interpolate the text node
 * using the view if possible.
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {void}
 */
Compiler.prototype.processTextNode = function(node) {
  if(this.view.hasInterpolation(node.data) === false) {
    return;
  }
  this.view.interpolate(node.data, function(val){
    dom.write(function(){
      if(val && val.nodeType) {
        node.parentNode.replaceChild(val, node);
        node = val;
      }
      else {
        var text = document.createTextNode(typeof val === 'string' ? val : '');
        node.parentNode.replaceChild(text, node);
        node = text;
      }
    });
  });
};


/**
 * Process a single node on the view. If there is a Component
 * for this element, we'll create that view and replace the
 * placeholder element with that component.
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {boolean}
 */
Compiler.prototype.processNode = function(node) {
  var fn = this.getComponentBinding(node);
  if(!fn) return this.processAttributes(node);
  fn.call(this, node, this.view);
};


/**
 * Process the attributes on a node. If there is a binding for
 * an attribute it will run it, otherwise it will try to
 * interpolate the attributes value using the view
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {void}
 */
Compiler.prototype.processAttributes = function(node) {
  var view = this.view;
  var self = this;

  each(attrs(node), function(attr, value){
    var binding = self.getAttributeBinding(attr);
    if(binding) {
      binding.call(self, view, node, attr, value);
    }
    else {
      self.interpolateAttribute(node, attr, value);
    }
  });
};


/**
 * Interpolate an attribute on a node using the view
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 *
 * @api private
 * @return {void}
 */
Compiler.prototype.interpolateAttribute = function(node, attr, value) {
  this.view.interpolate(value, function(val){
    dom.write(function(){
      if(isBoolean(attr) && !val) {
        node.removeAttribute(attr);
      }
      else {
        node.setAttribute(attr, val);
      }
    });
  });
};

module.exports = Compiler;