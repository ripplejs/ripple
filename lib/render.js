var walk = require('dom-walk');
var dom = require('fastdom');
var each = require('each');
var attrs = require('attributes');
var isBoolean = require('is-boolean-attribute');
var domify = require('domify');

module.exports = function(compiler, view) {
  var el = domify(view.template);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);

  walk(el, function(node, next){
    if(node.nodeType === 3) {
      return textBinding(node);
    }
    if(node.nodeType === 1) {
      var fn = compiler.getComponentBinding(node);
      if(!fn) return attributeBinding(node);
      componentBinding(node, fn);
    }
    next();
  });

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
  function attributeBinding(node) {
    each(attrs(node), function(attr, value){
      var binding = compiler.getAttributeBinding(attr);
      if(binding) {
        binding.call(compiler, view, node, value);
      }
      else {
        attributeTextBinding(node, attr, value);
      }
    });
  }

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
  function attributeTextBinding(node, attr, value) {
    view.createTextBinding(value, function(val){
      dom.write(function(){
        if(isBoolean(attr) && !val) {
          node.removeAttribute(attr);
        }
        else {
          node.setAttribute(attr, val);
        }
      });
    });
  }

  /**
   * Process a text node. Interpolate the text node
   * using the view if possible.
   *
   * @param {View} view
   * @param {Element} node
   *
   * @return {void}
   */
  function textBinding(node) {
    view.createTextBinding(node.data, function(val){
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
  }

  /**
   * Compose another view
   *
   * @param {Element} node
   * @param {View} Component
   *
   * @return {void}
   */
  function componentBinding(node, Child) {
    var child = new Child({
      '$content': node.innerHTML
    });

    each(attrs(node), function(name, value){
      view.createTextBinding(value, function(val){
        child.set(name, val);
      });
    });

    child
      .owner(view)
      .mount(node, { replace: true });

    view.on('destroyed', function(){
      child.destroy();
    });
  }

  return fragment.firstChild;
};