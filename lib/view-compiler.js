var Compiler = require('./compiler');
var each = require('each');
var attrs = require('attributes');

module.exports = function(template) {

  /**
   * Return a plugin
   *
   * @param {View} View
   */
  return function(View) {

    /**
     * Compiler that renders binds the view to
     * the DOM and manages the bindings
     *
     * @type {Compiler}
     */
    var compiler = new Compiler();

    /**
     * Set the compiler on the view when it
     * is created. This means the instances will
     * have a reference to the compiler
     */
    View.on('created', function(){
      this.compiler = compiler;
    });

    /**
     * Unmount when the view is destroyed
     */
    View.on('destroyed', function(){
      this.unmount();
    });

    /**
     * Add a component
     *
     * @param {String} match
     * @param {Function} fn
     *
     * @return {View}
     */
    View.compose = function(match, Component) {
      compiler.component(match, function(node, view){

        var component = new Component();

        each(attrs(node), function(name, value){
          view.interpolate(value, function(val){
            component.props.set(name, val);
          });
        });

        component.mount(node, {
          replace: true,
          template: (node.innerHTML !== "") ? node.innerHTML : null
        });

        view.on('destroyed', function(){
          component.destroy();
        });

      });
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
      compiler.directive(match, fn);
      return this;
    };

    /**
     * Append this view to an element
     *
     * @param {Element} node
     *
     * @return {View}
     */
    View.prototype.mount = function(node, options) {
      options = options || {};
      View.emit('mounting', this, node, options);
      this.emit('mounting', node, options);
      var comp = options.compiler || compiler;
      var html = options.template || template;
      if(!this.el) {
        this.el = comp.render(html, this);
      }
      if(options.replace) {
        node.parentNode.replaceChild(this.el, node);
      }
      else {
        node.appendChild(this.el);
      }
      View.emit('mounted', this, node, options);
      this.emit('mounted', node, options);
      return this;
    };

    /**
     * Remove the element from the DOM
     *
     * @return {View}
     */
    View.prototype.unmount = function() {
      if(!this.el || !this.el.parentNode) return this;
      View.emit('unmounting', this);
      this.emit('unmounting');
      this.el.parentNode.removeChild(this.el);
      this.el = null;
      View.emit('unmounted', this);
      this.emit('unmounted');
      return this;
    };

  };
};