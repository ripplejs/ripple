var walk = require('dom-walk');
var each = require('each');
var attrs = require('attributes');
var domify = require('domify');
var TextBinding = require('./text-binding');
var AttrBinding = require('./attr-binding');
var ChildBinding = require('./child-binding');

module.exports = function(compiler, view) {
  var el = domify(view.template);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);

  // Walk down the newly created view element
  // and bind everything to the model
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      new TextBinding(view, node);
    }
    else if(node.nodeType === 1) {
      var View = compiler.view(node);
      if(View) {
        return new ChildBinding(view, node, View);
      }
      each(attrs(node), function(attr, value){
        var directive = compiler.directive(attr);
        if(directive) {
          directive(view, node, value);
        }
        else {
          new AttrBinding(view, node, attr);
        }
      });
    }
    next();
  });

  return fragment.firstChild;
};