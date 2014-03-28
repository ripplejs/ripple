var walk = require('dom-walk');
var each = require('each');
var attrs = require('attributes');
var domify = require('domify');
var TextBinding = require('./text-binding');
var AttrBinding = require('./attr-binding');
var ChildBinding = require('./child-binding');
var Directive = require('./directive');

module.exports = function(bindings, view) {
  var el = domify(view.template);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);

  var attached = [];

  // Walk down the newly created view element
  // and bind everything to the model
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      attached.push(new TextBinding(view, node));
    }
    else if(node.nodeType === 1) {
      var View = bindings.component(node);
      if(View) {
        return attached.push(new ChildBinding(view, node, View));
      }
      each(attrs(node), function(attr){
        var binding = bindings.directive(attr);
        if(binding) {
          attached.push(new Directive(view, node, attr, binding));
        }
        else {
          attached.push(new AttrBinding(view, node, attr));
        }
      });
    }
    next();
  });

  return fragment.firstChild;
};