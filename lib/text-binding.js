var props = require('props');
var dom = require('fastdom');

function TextBinding(view, node) {
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = props(this.text);
  this.render = this.render.bind(this);
  if(this.props.length) {
    this.bind();
  }
}

TextBinding.prototype.bind = function(){
  var view = this.view;
  var render = this.render;

  this.props.forEach(function(prop){
    view.watch(prop, render);
  });

  this.render();
};

TextBinding.prototype.unbind = function(){
  var view = this.view;
  var render = this.render;

  this.props.forEach(function(prop){
    view.unwatch(prop, render);
  });

  if(this.job) {
    dom.clear(this.job);
  }
};

TextBinding.prototype.render = function(){
  var self = this;
  var node = this.node;
  var text = this.text;
  var view = this.view;

  if(this.job) {
    dom.clear(this.job);
  }

  this.job = dom.write(function(){
    var val = view.interpolate(text);
    if(val && val.nodeType) {
      node.parentNode.replaceChild(val, node);
      self.node = val;
    }
    else {
      var newNode = document.createTextNode(typeof val === 'string' ? val : '');
      node.parentNode.replaceChild(newNode, node);
      self.node = newNode;
    }
  });
};

module.exports = TextBinding;
