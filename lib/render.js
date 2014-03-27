var walk = require('dom-walk');
var each = require('each');
var attrs = require('attributes');
var domify = require('domify');
var TextBinding = require('./text-binding');
var AttrBinding = require('./attr-binding');
var ChildBinding = require('./child-binding');
var Directive = require('./directive');

module.exports = function(compiler, view) {
  var el = domify(view.template);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);

  var bindings = [];

  // Walk down the newly created view element
  // and bind everything to the model
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      bindings.push(new TextBinding(view, node));
    }
    else if(node.nodeType === 1) {
      var View = compiler.view(node);
      if(View) {
        return bindings.push(new ChildBinding(view, node, View));
      }
      each(attrs(node), function(attr){
        var binding = compiler.directive(attr);
        if(binding) {
          bindings.push(new Directive(view, node, attr, binding));
        }
        else {
          bindings.push(new AttrBinding(view, node, attr));
        }
      });
    }
    next();
  });

  return fragment.firstChild;
};