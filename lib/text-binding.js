var props = require('props');
var dom = require('fastdom');

function TextBinding(view, node) {
  this.update = this.update.bind(this);
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
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

TextBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    dom.clear(this.job);
  }
};

TextBinding.prototype.render = function(){
  var node = this.node;
  var val = this.view.interpolate(this.text);

  if(val && val.nodeType) {
    node.parentNode.replaceChild(val, node);
    this.node = val;
  }
  else {
    var newNode = document.createTextNode(typeof val === 'string' ? val : '');
    node.parentNode.replaceChild(newNode, node);
    this.node = newNode;
  }
};

TextBinding.prototype.update = function(){
  if(this.job) {
    dom.clear(this.job);
  }
  this.job = dom.write(this.render.bind(this));
};

module.exports = TextBinding;
