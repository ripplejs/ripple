var domify = require('domify');
var emitter = require('emitter');
var toArray = require('to-array');
var model = require('../model');
var computed = require('../model/computed');
var accessors = require('../model/accessors');

function freeze(Model) {
  Model.on('construct', function(model){
    Object.freeze(model.props);
  });
}

module.exports = function() {

  /**
   * The view controls the lifecycle of the
   * element that it creates from a template.
   * Each element can only have one view and
   * each view can only have one element.
   *
   * @param {Object} data
   * @param {Object} options
   */
  function View(props, options) {
    options = options || {};
    View.emit('creating', this, props, options);
    this.options = options;
    this.props = new View.Props(props);
    this.state = new View.State();
    this.owner = options.owner;
    this.root = this.owner ? this.owner.root : this;
    View.emit('created', this, props, options);
  }


  /**
   * Mixins
   */
  emitter(View);
  emitter(View.prototype);


  /**
   * Stores the state of the view.
   *
   * @type {Function}
   */
  View.State = model()
    .use(accessors)
    .use(computed);


  /**
   * Stores the attributes of the view
   *
   * @type {Function}
   */
  View.Props = model()
    .use(accessors)
    .use(freeze);


  /**
   * Set the initial state of the view. Accepts
   * a function that should return an object
   * that will be used for the initial state.
   *
   * @param {Function} fn
   *
   * @return {View}
   */
  View.initialState = function(fn) {
    View.on('created', function(){
      this.state.set(fn.call(this));
    });
    return this;
  };


  /**
   * Fire a function whenever a property
   * changes. Fire the function immediately.
   *
   * @param {String} prop
   * @param {Function} fn
   *
   * @return {View}
   */
  View.change = function(prop, fn) {
    View.on('created', function(){
      var change = fn.bind(this);
      this.props.change(prop, change);
      change(this.props.get(prop));
    });
    return this;
  };


  /**
   * Use a plugin
   *
   * @return {View}
   */
  View.use = function(fn, options){
    fn(View, options);
    return this;
  };


  /**
   * Add a computed state property
   *
   * @return {View}
   */
  View.computed = function(key, deps, fn) {
    View.State.computed(key, deps, fn);
    return this;
  };


  /**
   * When calling View.on the function will
   * always be called in the context of the view instance
   *
   * @return {View}
   */
  View.on = function(event, fn) {
    emitter.prototype.on.call(this, event, function(){
      var args = toArray(arguments);
      var view = args.shift();
      fn.apply(view, args);
    });
    return this;
  };


  /**
   * Lookup a property on this view.
   *
   * @param {String} prop
   */
  View.prototype.lookup = function(prop) {
    if(this.state.get(prop) !== undefined) {
      return this.state;
    }
    if(this.props.get(prop) !== undefined) {
      return this.props;
    }
    if(this.owner) {
      return this.owner.lookup(prop);
    }
    return this.state;
  };


  /**
   * Get the value of a property on the view. If the
   * value is undefined it checks the owner view recursively
   * up to the root.
   *
   * @param  {String} key
   *
   * @return {Mixed}
   */
  View.prototype.get = function(key) {
    return this.lookup(key).get(key);
  };


  /**
   * Set the value of a property on the view
   *
   * @param  {String} key
   * @param  {Mixed}  value
   *
   * @return {void}
   */
  View.prototype.set = function(key, value) {
    this.state.set(key, value);
  };

  /**
   * Watch for a state change
   *
   * @param  {String|Array} key
   * @param  {Function} fn
   *
   * @return {Function} unbinder
   */
  View.prototype.change = function(key, fn) {
    var binding = this.lookup(key).change(key, fn);
    this.once('destroyed', binding);
    return binding;
  };

  /**
   * Remove the element from the DOM
   *
   * @return {View}
   */
  View.prototype.destroy = function() {
    View.emit('destroyed', this);
    this.emit('destroyed');
    this.off();
  };

  return View;
};
