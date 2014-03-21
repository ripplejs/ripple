module.exports = function(Model) {
  var set = Model.prototype.set;

  /**
   * Add a single accessor for a property.
   *
   * @param {String} prop
   */
  Model.prototype.addAccessor = function(prop) {
    if(prop in this) return this;
    Object.defineProperty(this, prop, {
      get: function(){
        return this.get(prop);
      },
      set: function(val) {
        this.set(prop, val);
      }
    });
    return this;
  };

  /**
   * Update all accessors
   */
  Model.prototype.updateAccessors = function(){
    for(var prop in this.props) {
      this.addAccessor(prop);
    }
    return this;
  };

  /**
   * Whenever a property is set, it should
   * add an accessor for that property.
   */
  Model.prototype.set = function(prop){
    if(typeof prop === 'string') {
      this.addAccessor(prop);
    }
    else {
      for(var key in prop) this.addAccessor(key);
    }
    return set.apply(this, arguments);
  };

  /**
   * When the model is created we need
   * to create accessors for all properties
   */
  Model.on('construct', function(model){
    model.updateAccessors();
  });

};