var emitter = require('emitter');
var observer = require('path-observer');
var proto = require('./proto');
var statics = require('./static');
var id = 0;

/**
 * Allow for a selector or an element to be passed in
 * as the template for the view
 */

function getTemplate(template) {
  if (template.indexOf('#') === 0 || template.indexOf('.') === 0) {
    template = document.querySelector(template);
  }
  if (typeof template.innerHTML === 'string') {
    template = template.innerHTML;
  }
  return template;
}

/**
 * Create a new view from a template string
 *
 * @param {String} template
 *
 * @return {View}
 */

module.exports = function(template) {
  if (!template) throw new Error('template is required');
  template = getTemplate(template);

  function View (attrs, options) {
    if (!(this instanceof View)) return new View(attrs, options);
    attrs = attrs || {};
    options = options || {};
    View.emit('construct', this, attrs, options);
    this.options = options;
    this.id = id++;
    this.root = this;
    this.attrs = attrs;
    this.observer = observer(attrs);
    this.template = options.template || template;
    if (options.owner) {
      this.owner = options.owner;
      this.root = this.owner.root;
      this.owner.on('destroying', this.destroy.bind(this));
    }
    View.emit('created', this);
    if (this.initialize) this.initialize();
    this.el = this.render();
    View.emit('ready', this);
  }

  // mixins

  emitter(View);
  emitter(View.prototype);

  // statics

  View.attrs = {};
  View.components = {};
  View.directives = {};
  View.filters = {};
  for (var staticKey in statics) View[staticKey] = statics[staticKey];

  // prototype

  View.prototype.view = View;
  for (var protoKey in proto) View.prototype[protoKey] = proto[protoKey];

  return View;
};
