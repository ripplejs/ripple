var Interpolator = require('interpolate');

module.exports = function(View){

  /**
   * Interpolation engine
   *
   * @type {Interpolator}
   */
  var interpolator = new Interpolator();

  /**
   * Add an interpolation filter
   *
   * @param {String} name
   * @param {Function} fn
   *
   * @return {View}
   */
  View.filter = function(name, fn) {
    interpolator.filter(name, fn);
    return this;
  };

  /**
   * Set the expression delimiters
   *
   * @param {Regex} match
   *
   * @return {View}
   */
  View.delimiters = function(match) {
    interpolator.delimiters(match);
    return this;
  };

  /**
   * Check if a filter is available
   *
   * @param {String} name
   *
   * @return {Boolean}
   */
  View.prototype.hasFilter = function(name) {
    return interpolator.filters[name] != null;
  };

  /**
   * Check if a string has expressions
   *
   * @param {String} str
   *
   * @return {Boolean}
   */
  View.prototype.hasInterpolation = function(str) {
    return interpolator.has(str);
  };

  /**
   * Interpolate a string using the views props and state.
   * Takes a callback that will be fired whenever the
   * attributes used in the string change.
   *
   * @param {String} str
   * @param {Function} callback
   *
   * @return {void}
   */
  View.prototype.interpolate = function(str, callback) {
    var self = this;

    // If the string has no expressions, we can just return
    // the string one, since it never needs to change.
    if(this.hasInterpolation(str) === false) {
      return callback ? callback(str) : str;
    }

    // Get all of the properties used withing the string
    // in all expressions it can find
    var attrs = interpolator.props(str);

    function render() {
      var data = {};
      attrs.forEach(function(attr){
        var value = self.get(attr);
        if(value === undefined) {
          throw new Error('Can\'t find interpolation property named "' + attr + '"');
        }
        data[attr] = value;
      });
      return interpolator.value(str, data);
    }

    if(callback) {
      // Whenever any of the properties used in the
      // expression changes, we render it again
      attrs.map(function(attr){
        return self.change(attr, function(){
          callback(render());
        });
      });
      // Immediately render the string
      callback(render());
      return;
    }

    return render();
  };

};