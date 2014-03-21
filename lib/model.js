var observer = require('path-observer');
var emitter = require('emitter');

module.exports = function(){

  /**
   * Model.
   *
   * Watch an objects properties for changes.
   *
   * Properties must be set using the `set` method for
   * changes to fire events.
   *
   * @param {Object}
   */
  function Model(props){
    if(!(this instanceof Model)) return new Model(props);
    this.props = props || {};
    this.observer = observer(this.props);
    Model.emit('construct', this);
  }

  /**
   * Mixins
   */
  emitter(Model);

  /**
   * Use a plugin
   *
   * @return {Model}
   */
  Model.use = function(fn, options){
    fn(this, options);
    return this;
  };

  /**
   * Add a function to fire whenever a keypath changes.
   *
   * @param {String|Array} keys
   * @param {Function} fn Function to call on event
   *
   * @return {Function} Function to remove the change event
   */
  Model.prototype.change = function(key, fn) {
    var self = this;
    if(Array.isArray(key)) {
      var changes = key.map(function(k){
        return self.change(k, fn);
      });
      return function() {
        changes.forEach(function(change){
          change();
        });
      };
    }
    return this.observer(key).change(fn.bind(this));
  };

  /**
   * Set a property using a keypath
   *
   * @param {String} key eg. 'foo.bar'
   * @param {Mixed} val
   */
  Model.prototype.set = function(key, val) {
    if( typeof key !== 'string' ) {
      for(var name in key) this.set(name, key[name]);
      return this;
    }
    this.observer(key).set(val);
    return this;
  };

  /**
   * Get an attribute using a keypath. If an array
   * of keys is passed in an object is returned with
   * those keys
   *
   * @param {String|Array} key
   *
   * @api public
   * @return {Mixed}
   */
  Model.prototype.get = function(keypath) {
    if(Array.isArray(keypath)) {
      var values = {};
      var self = this;
      keypath.forEach(function(key){
        values[key] = self.get(key);
      });
      return values;
    }
    return this.observer(keypath).get();
  };

  return Model;
};