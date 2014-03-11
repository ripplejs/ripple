;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return document.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = document.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("ripplejs-keypath/index.js", function(exports, require, module){
exports.get = function(obj, path) {
  var parts = path.split('.');
  var value = obj;
  while(parts.length) {
    var part = parts.shift();
    value = value[part];
    if(value === undefined) parts.length = 0;
  }
  return value;
};

exports.set = function(obj, path, value) {
  var parts = path.split('.');
  var target = obj;
  var last = parts.pop();
  while(parts.length) {
    part = parts.shift();
    if(!target[part]) target[part] = {};
    target = target[part];
  }
  target[last] = value;
};
});
require.register("jkroso-type/index.js", function(exports, require, module){

var toString = {}.toString
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function(x){
  var type = typeof x
  if (type != 'object') return type
  type = types[toString.call(x)]
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
}

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
}

});
require.register("jkroso-equals/index.js", function(exports, require, module){

var type = require('type')

/**
 * expose equals
 */

module.exports = equals
equals.compare = compare

/**
 * assert all values are equal
 *
 * @param {Any} [...]
 * @return {Boolean}
 */

 function equals(){
  var i = arguments.length - 1
  while (i > 0) {
    if (!compare(arguments[i], arguments[--i])) return false
  }
  return true
}

// (any, any, [array]) -> boolean
function compare(a, b, memos){
  // All identical values are equivalent
  if (a === b) return true
  var fnA = types[type(a)]
  var fnB = types[type(b)]
  return fnA && fnA === fnB
    ? fnA(a, b, memos)
    : false
}

var types = {}

// (Number) -> boolean
types.number = function(a){
  // NaN check
  return a !== a
}

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
  return a.toString() === b.toString()
    // Functions can act as objects
    && types.object(a, b, memos)
    && compare(a.prototype, b.prototype)
}

// (date, date) -> boolean
types.date = function(a, b){
  return +a === +b
}

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
  return a.toString() === b.toString()
}

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
  return a.outerHTML === b.outerHTML
}

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
  return a.textContent === b.textContent
}

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
  return function(a, b, memos){
    if (!memos) return fn(a, b, [])
    var i = memos.length, memo
    while (memo = memos[--i]) {
      if (memo[0] === a && memo[1] === b) return true
    }
    return fn(a, b, memos)
  }
}

types['arguments'] =
types.array = memoGaurd(compareArrays)

// (array, array, array) -> boolean
function compareArrays(a, b, memos){
  var i = a.length
  if (i !== b.length) return false
  memos.push([a, b])
  while (i--) {
    if (!compare(a[i], b[i], memos)) return false
  }
  return true
}

types.object = memoGaurd(compareObjects)

// (object, object, array) -> boolean
function compareObjects(a, b, memos) {
  var ka = getEnumerableProperties(a)
  var kb = getEnumerableProperties(b)
  var i = ka.length

  // same number of properties
  if (i !== kb.length) return false

  // although not necessarily the same order
  ka.sort()
  kb.sort()

  // cheap key test
  while (i--) if (ka[i] !== kb[i]) return false

  // remember
  memos.push([a, b])

  // iterate again this time doing a thorough check
  i = ka.length
  while (i--) {
    var key = ka[i]
    if (!compare(a[key], b[key], memos)) return false
  }

  return true
}

// (object) -> array
function getEnumerableProperties (object) {
  var result = []
  for (var k in object) if (k !== 'constructor') {
    result.push(k)
  }
  return result
}

});
require.register("component-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("component-clone/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var type;
try {
  type = require('component-type');
} catch (_) {
  type = require('type');
}

/**
 * Module exports.
 */

module.exports = clone;

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

function clone(obj){
  switch (type(obj)) {
    case 'object':
      var copy = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = clone(obj[key]);
        }
      }
      return copy;

    case 'array':
      var copy = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default: // string, number, boolean, …
      return obj;
  }
}

});
require.register("ripplejs-path-observer/index.js", function(exports, require, module){
var emitter = require('emitter');
var equals = require('equals');
var clone = require('clone');
var keypath = require('keypath');

/**
 * Takes a path like ‘foo.bar.baz’ and returns
 * an array we can iterate over for all parts.
 * eg. [‘foo’, ‘foo.bar’, ‘foo.bar.baz’]
 *
 * @param {String} key
 *
 * @return {Array}
 */
function resolvePaths(key) {
  var used = [];
  var paths = key.split('.').map(function(path){
    used.push(path);
    return used.join('.');
  });
  paths.pop();
  return paths;
}

module.exports = function(obj) {

  /**
   * Stores each observer created for each
   * path so they're singletons. This allows us to
   * fire change events on all related paths.
   *
   * @type {Object}
   */
  var cache = {};

  /**
   * Takes a path and announces whenever
   * the value at that path changes.
   *
   * @param {String} path The keypath to the value 'foo.bar.baz'
   */
  function PathObserver(path) {
    if(!(this instanceof PathObserver)) return new PathObserver(path);
    if(cache[path]) return cache[path];

    this.path = path;
    this.paths = resolvePaths(path);
    this.previous = clone(this.get());
    this.check();

    // Whenever a parent path changes we should
    // check to see if this path has changed
    this.changes = this.paths.map(function(name){
      var observer = new PathObserver(name);
      return observer.change(this.check.bind(this));
    }, this);

    cache[path] = this;
  }

  /**
   * Remove all path observers
   */
  PathObserver.dispose = function(){
    for(var path in cache) {
      cache[path].dispose();
    }
  };

  /**
   * Mixin
   */
  emitter(PathObserver.prototype);

  /**
   * Has the path changed?
   *
   * @return {Boolean}
   */
  PathObserver.prototype.dirty = function() {
    return equals(this.previous, this.get()) === false;
  };

  /**
   * Get the value of the path
   *
   * @return {Mixed}
   */
  PathObserver.prototype.get = function(){
    return keypath.get(obj, this.path);
  };

  /**
   * Set the value of the keypath
   *
   * @return {PathObserver}
   */
  PathObserver.prototype.set = function(val) {
    keypath.set(obj, this.path, val);
    this.check(); // This will be automatic with object.observe
    return this;
  };

  /**
   * Announce changes. It won't do anything
   * if the value hasn't actually changed
   *
   * @param {Mixed} value
   *
   * @api public
   * @return {void}
   */
  PathObserver.prototype.check = function() {
    var current = this.get();
    var previous = this.previous;
    if(!this.dirty()) return;
    this.previous = clone(current);
    this.notify(current, previous);
  };

  /**
   * Emits the change event that triggers callback
   * events in object watching for changes
   *
   * @api public
   * @return {void}
   */
  PathObserver.prototype.notify = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('change');
    this.emit.apply(this, args);
    this.paths.forEach(function(name){
      if(cache[name]) cache[name].check();
    });
  };

  /**
   * Bind to changes on this path
   *
   * @param {Function} fn
   *
   * @return {Function}
   */
  PathObserver.prototype.change = function(fn){
    var self = this;
    self.on('change', fn);
    return function(){
      self.off('change', fn);
    };
  };

  /**
   * Clean up and remove all event bindings
   */
  PathObserver.prototype.dispose = function(){
    this.emit('dispose');
    this.off('change');
    this.previous = null;
    this.changes.forEach(function(unbind){
      unbind();
    });
    cache[this.path] = null;
  };

  return PathObserver;
};
});
require.register("ripplejs-model/index.js", function(exports, require, module){
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
});
require.register("ripplejs-computed/index.js", function(exports, require, module){
module.exports = function(Model) {

  /**
   * Stores dependencies being tracked
   */
  var tracking;


  /**
   * Store the previous get method. We'll
   * override it so we can track the dependencies
   *
   * @type {Function}
   */
  var get = Model.prototype.get;


  /**
   * Start tracking calls to .get
   *
   * @return {Array}
   */
  function track(){
    tracking = [];
    return tracking;
  }


  /**
   * Stop tracking calls to .get
   *
   * @return {void}
   */
  function stopTracking(){
    tracking = null;
  }


  /**
   * Set an attribute to be computed and automatically
   * update when other keys are updated
   *
   * @param {String} key
   * @param {Array} dependencies
   * @param {Function} fn
   *
   * @return {Model}
   */
  Model.computed = function(name, dependencies, fn) {
    var args = arguments;
    Model.on('construct', function(self){
      if(args.length === 2) {
        fn = args[1];
        dependencies = track();
        fn.call(self);
        stopTracking();
        var update = function() {
          self.set(name, fn.call(self));
        };
      }
      else {
        var update = function() {
          var values = dependencies.map(self.get.bind(self));
          self.set(name, fn.apply(self, values));
        };
      }
      self.change(dependencies, update);
      update();
    });
    return this;
  };


  /**
   * Override the get method to track dependecies
   * so we can guess what the computed property needs.
   *
   * @param {String} prop
   */
  Model.prototype.get = function(prop){
    if(tracking) tracking.push(prop);
    return get.apply(this, arguments);
  };

}
});
require.register("ripplejs-accessors/index.js", function(exports, require, module){
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
});
require.register("timoxley-to-array/index.js", function(exports, require, module){
/**
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api public
 */

module.exports = function toArray(collection) {
  if (typeof collection === 'undefined') return []
  if (collection === null) return [null]
  if (collection === window) return [window]
  if (typeof collection === 'string') return [collection]
  if (isArray(collection)) return collection
  if (typeof collection.length != 'number') return [collection]
  if (typeof collection === 'function' && collection instanceof Function) return [collection]

  var arr = []
  for (var i = 0; i < collection.length; i++) {
    if (Object.prototype.hasOwnProperty.call(collection, i) || i in collection) {
      arr.push(collection[i])
    }
  }
  if (!arr.length) return []
  return arr
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

});
require.register("ripplejs-view/index.js", function(exports, require, module){
var domify = require('domify');
var emitter = require('emitter');
var model = require('model');
var toArray = require('to-array');
var computed = require('computed');
var accessors = require('accessors');

function freeze(Model) {
  Model.on('construct', function(model){
    Object.freeze(model.props);
  });
}

module.exports = function() {

  /**
   * Stores the state of the view.
   *
   * @type {Function}
   */
  var State = model()
    .use(accessors)
    .use(computed);

  /**
   * Stores the properties of the view
   *
   * @type {Function}
   */
  var Props = model()
    .use(accessors)
    .use(freeze);

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
    this.props = new Props(props);
    this.state = new State(options.state);
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
   * Alternate create method so that we can
   * keep the API for normal views nice
   *
   * @param {Object} options
   *
   * @return {View}
   */
  View.create = function(options) {
    return new View(options.props, {
      template: options.template,
      owner: options.owner,
      state: options.state
    });
  };


  /**
   * Use a plugin
   *
   * @return {View}
   */
  View.use = function(fn, options){
    fn(this, options);
    return this;
  };


  /**
   * Add a computed state property
   *
   * @return {View}
   */
  View.computed = function(key, deps, fn) {
    State.computed(key, deps, fn);
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
    this.once('destroy', binding);
    return binding;
  };

  /**
   * Remove the element from the DOM
   *
   * @return {View}
   */
  View.prototype.destroy = function() {
    View.emit('destroy', this);
    this.emit('destroy');
    this.off();
  };

  return View;
};

});
require.register("component-stack/index.js", function(exports, require, module){

/**
 * Expose `stack()`.
 */

module.exports = stack;

/**
 * Return the stack.
 *
 * @return {Array}
 * @api public
 */

function stack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}
});
require.register("component-assert/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var stack = require('stack');
var equals = require('equals');

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

module.exports = exports = function (expr, msg) {
  if (expr) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.equal = function (actual, expected, msg) {
  if (actual == expected) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is not weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notEqual = function (actual, expected, msg) {
  if (actual != expected) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.deepEqual = function (actual, expected, msg) {
  if (equals(actual, expected)) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is not deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notDeepEqual = function (actual, expected, msg) {
  if (!equals(actual, expected)) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.strictEqual = function (actual, expected, msg) {
  if (actual === expected) return;
  throw new Error(msg || message());
};

/**
 * Assert `actual` is not strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notStrictEqual = function (actual, expected, msg) {
  if (actual !== expected) return;
  throw new Error(msg || message());
};

/**
 * Assert `block` throws an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.throws = function (block, error, msg) {
  var err;
  try {
    block();
  } catch (e) {
    err = e;
  }
  if (!err) throw new Error(msg || message());
  if (error && !(err instanceof error)) throw new Error(msg || message());
};

/**
 * Assert `block` doesn't throw an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.doesNotThrow = function (block, error, msg) {
  var err;
  try {
    block();
  } catch (e) {
    err = e;
  }
  if (error && (err instanceof error)) throw new Error(msg || message());
  if (err) throw new Error(msg || message());
};

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message() {
  if (!Error.captureStackTrace) return 'assertion failed';
  var callsite = stack()[2];
  var fn = callsite.getFunctionName();
  var file = callsite.getFileName();
  var line = callsite.getLineNumber() - 1;
  var col = callsite.getColumnNumber() - 1;
  var src = getScript(file);
  line = src.split('\n')[line].slice(col);
  var m = line.match(/assert\((.*)\)/);
  return m && m[1].trim();
}

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

function getScript(script) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', script, false);
  xhr.send(null);
  return xhr.responseText;
}

});
require.register("ripplejs-expression/index.js", function(exports, require, module){
var props = require('props');
var unique = require('uniq');
var cache = {};

function Expression(str) {
  this.props = unique(props(str));
  this.fn = compile(str, this.props);
}

Expression.prototype.exec = function(obj){
  var args = obj ? values(obj, this.props) : [];
  return this.fn.apply(null, args);
};

function values(obj, keys) {
  return keys.map(function(key){
    return obj[key];
  });
}

function compile(str, props){
  if(cache[str]) return cache[str];
  var args = props.slice();
  args.push('return ' + str);
  var fn = Function.apply(null, args);
  cache[str] = fn;
  return fn;
}

module.exports = Expression;
});
require.register("component-format-parser/index.js", function(exports, require, module){

/**
 * Parse the given format `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

module.exports = function(str){
	return str.split(/ *\| */).map(function(call){
		var parts = call.split(':');
		var name = parts.shift();
		var args = parseArgs(parts.join(':'));

		return {
			name: name,
			args: args
		};
	});
};

/**
 * Parse args `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parseArgs(str) {
	var args = [];
	var re = /"([^"]*)"|'([^']*)'|([^ \t,]+)/g;
	var m;
	
	while (m = re.exec(str)) {
		args.push(m[2] || m[1] || m[0]);
	}
	
	return args;
}

});
require.register("component-indexof/index.js", function(exports, require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("yields-uniq/index.js", function(exports, require, module){

/**
 * dependencies
 */

try {
  var indexOf = require('indexof');
} catch(e){
  var indexOf = require('indexof-component');
}

/**
 * Create duplicate free array
 * from the provided `arr`.
 *
 * @param {Array} arr
 * @param {Array} select
 * @return {Array}
 */

module.exports = function (arr, select) {
  var len = arr.length, ret = [], v;
  select = select ? (select instanceof Array ? select : [select]) : false;

  for (var i = 0; i < len; i++) {
    v = arr[i];
    if (select && !~indexOf(select, v)) {
      ret.push(v);
    } else if (!~indexOf(ret, v)) {
      ret.push(v);
    }
  }
  return ret;
};

});
require.register("component-props/index.js", function(exports, require, module){
/**
 * Global Names
 */

var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @param {String|Function} map function or prefix
 * @return {Array}
 * @api public
 */

module.exports = function(str, fn){
  var p = unique(props(str));
  if (fn && 'string' == typeof fn) fn = prefixed(fn);
  if (fn) return map(str, p, fn);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(globals, '')
    .match(/[a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` mapped with `fn`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {Function} fn
 * @return {String}
 * @api private
 */

function map(str, props, fn) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~props.indexOf(_)) return _;
    return fn(_);
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

/**
 * Map with prefix `str`.
 */

function prefixed(str) {
  return function(_){
    return str + _;
  };
}

});
require.register("ripplejs-interpolate/index.js", function(exports, require, module){
var Expression = require('expression');
var parse = require('format-parser');
var unique = require('uniq');
var props = require('props');

/**
 * Run a value through all filters
 *
 * @param  {Mixed}  val    Any value returned from an expression
 * @param  {Array}  types  The filters eg. currency | float | floor
 * @param  {Object} fns     Mapping of filter names, eg. currency, to functions
 * @return {Mixed}
 */
function filter(val, types, fns) {
  fns = fns || {};
  var filters = parse(types.join('|'));
  filters.forEach(function(f){
    var name = f.name.trim();
    var fn = fns[name];
    var args = f.args.slice();
    args.unshift(val);
    if(!fn) throw new Error('Missing filter named "' + name + '"');
    val = fn.apply(null, args);
  });
  return val;
}

/**
 * Create a new interpolator
 */
function Interpolate() {
  this.match = /\{\{([^}]+)\}\}/g;
  this.filters = {};
}

/**
 * Hook for plugins
 *
 * @param {Function} fn
 *
 * @return {Interpolate}
 */
Interpolate.prototype.use = function(fn) {
  fn(this);
  return this;
};

/**
 * Set the delimiters
 *
 * @param {Regex} match
 *
 * @return {Interpolate}
 */
Interpolate.prototype.delimiters = function(match) {
  this.match = match;
  return this;
};

/**
 * Check if a string matches the delimiters
 *
 * @param {String} input
 *
 * @return {Array}
 */
Interpolate.prototype.matches = function(input) {
  var test = new RegExp(this.match.source);
  var matches = test.exec(input);
  if(!matches) return [];
  return matches;
};

/**
 * Add a new filter
 *
 * @param {String} name
 * @param {Function} fn
 *
 * @return {Interpolate}
 */
Interpolate.prototype.filter = function(name, fn){
  this.filters[name] = fn;
  return this;
};

/**
 * Interpolate a string using the contents
 * inside of the delimiters
 *
 * @param  {String} input
 * @param  {Object} data    Data to pass to the expressions
 * @param  {Object} filters Mapping of filters
 * @return {String}
 */
Interpolate.prototype.exec = function(input, data){
  var parts = input.split('|');
  var expr = parts.shift();
  var fn = new Expression(expr);
  var val = fn.exec(data);
  if(parts.length) {
    val = filter(val, parts, this.filters);
  }
  return val;
};


/**
 * Check if a string has interpolation
 *
 * @param {String} input
 *
 * @return {Boolean}
 */
Interpolate.prototype.has = function(input) {
  return input.search(this.match) > -1;
};


/**
 * Interpolate as a string and replace each
 * match with the interpolated value
 *
 * @return {String}
 */
Interpolate.prototype.replace = function(input, data){
  var self = this;
  return input.replace(this.match, function(_, match){
    var val = self.exec(match, data);
    return (val == null) ? '' : val;
  });
};


/**
 * Get the interpolated value from a string
 */
Interpolate.prototype.value = function(input, data){
  var matches = this.matches(input);
  if( matches.length === 0 ) return input;
  if( matches[0].length !== input.length ) return this.replace(input, data);
  return this.exec(matches[1], data);
};


/**
 * Get all the interpolated values from a string
 *
 * @return {Array} Array of values
 */
Interpolate.prototype.values = function(input, data){
  var self = this;
  var matches = input.match(this.match);
  if( !matches ) return [];
  return matches.map(function(val){
    return self.value(val, data);
  });
};


/**
 * Find all the properties used in all expressions in a string
 * @param  {String} str
 * @return {Array}
 */
Interpolate.prototype.props = function(str) {
  var m;
  var arr = [];
  var re = this.match;
  while (m = re.exec(str)) {
    var expr = m[1].split('|')[0];
    arr = arr.concat(props(expr));
  }
  return unique(arr);
};


module.exports = Interpolate;
});
require.register("ripplejs-view-interpolate/index.js", function(exports, require, module){
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
});
require.register("anthonyshort-attributes/index.js", function(exports, require, module){
module.exports = function(el) {
  var attrs = el.attributes,
      ret = {},
      attr,
      i;

  for (i = attrs.length - 1; i >= 0; i--) {
    attr = attrs.item(i);
    ret[attr.nodeName] = attr.nodeValue;
  }

  return ret;
};
});
require.register("component-to-function/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var expr = require('props');

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val;
  for(var i = 0, prop; prop = props[i]; i++) {
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";
    str = str.replace(new RegExp(prop, 'g'), val);
  }

  return str;
}

});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type = require('type');
var toFunction = require('to-function');

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`
 * in optional context `ctx`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @param {Object} [ctx]
 * @api public
 */

module.exports = function(obj, fn, ctx){
  fn = toFunction(fn);
  ctx = ctx || this;
  switch (type(obj)) {
    case 'array':
      return array(obj, fn, ctx);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn, ctx);
      return object(obj, fn, ctx);
    case 'string':
      return string(obj, fn, ctx);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function string(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function object(obj, fn, ctx) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn.call(ctx, key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function array(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj[i], i);
  }
}

});
require.register("jaycetde-dom-contains/index.js", function(exports, require, module){
'use strict';

var containsFn
	, node = window.Node
;

if (node && node.prototype) {
	if (node.prototype.contains) {
		containsFn = node.prototype.contains;
	} else if (node.prototype.compareDocumentPosition) {
		containsFn = function (arg) {
			return !!(node.prototype.compareDocumentPosition.call(this, arg) & 16);
		};
	}
}

if (!containsFn) {
	containsFn = function (arg) {
		if (arg) {
			while ((arg = arg.parentNode)) {
				if (arg === this) {
					return true;
				}
			}
		}
		return false;
	};
}

module.exports = function (a, b) {
	var adown = a.nodeType === 9 ? a.documentElement : a
		, bup = b && b.parentNode
	;

	return a === bup || !!(bup && bup.nodeType === 1 && containsFn.call(adown, bup));
};

});
require.register("anthonyshort-dom-walk/index.js", function(exports, require, module){
var array = require('to-array');
var contains = require('dom-contains');

function walk(el, process, done, root) {
  root = root || el;
  var end = done || function(){};
  var nodes = array(el.childNodes);

  function next(){
    if(nodes.length === 0) return end();
    var nextNode = nodes.shift();
    if(!contains(root, nextNode)) return next();
    walk(nextNode, process, next, root);
  }

  process(el, next);
}

module.exports = walk;
});
require.register("component-find/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');

/**
 * Find the first value in `arr` with when `fn(val, i)` is truthy.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

module.exports = function(arr, fn){
  // callback
  if ('function' != typeof fn) {
    if (Object(fn) === fn) fn = objectToFunction(fn);
    else fn = toFunction(fn);
  }

  // filter
  for (var i = 0, len = arr.length; i < len; ++i) {
    if (fn(arr[i], i)) return arr[i];
  }
};

/**
 * Convert `obj` into a match function.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  return function(o){
    for (var key in obj) {
      if (o[key] != obj[key]) return false;
    }
    return true;
  }
}
});
require.register("anthonyshort-is-boolean-attribute/index.js", function(exports, require, module){

/**
 * https://github.com/kangax/html-minifier/issues/63#issuecomment-18634279
 */

var attrs = [
  "allowfullscreen",
  "async",
  "autofocus",
  "checked",
  "compact",
  "declare",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "multiple",
  "multiple",
  "muted",
  "nohref",
  "noresize",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "sortable",
  "truespeed",
  "typemustmatch",
  "contenteditable",
  "spellcheck"
];

module.exports = function(attr){
  return attrs.indexOf(attr) > -1;
};
});
require.register("wilsonpage-fastdom/index.js", function(exports, require, module){

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 */

;(function(fastdom){

  'use strict';

  // Normalize rAF
  var raf = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(cb) { return window.setTimeout(cb, 1000 / 60); };

  // Normalize cAF
  var caf = window.cancelAnimationFrame
    || window.cancelRequestAnimationFrame
    || window.mozCancelAnimationFrame
    || window.mozCancelRequestAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || window.msCancelAnimationFrame
    || window.msCancelRequestAnimationFrame
    || function(id) { window.clearTimeout(id); };

  /**
   * Creates a fresh
   * FastDom instance.
   *
   * @constructor
   */
  function FastDom() {
    this.frames = [];
    this.lastId = 0;

    // Placing the rAF method
    // on the instance allows
    // us to replace it with
    // a stub for testing.
    this.raf = raf;

    this.batch = {
      hash: {},
      read: [],
      write: [],
      mode: null
    };
  }

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @api public
   */
  FastDom.prototype.read = function(fn, ctx) {
    var job = this.add('read', fn, ctx);
    var id = job.id;

    // Add this job to the read queue
    this.batch.read.push(job.id);

    // We should *not* schedule a new frame if:
    // 1. We're 'reading'
    // 2. A frame is already scheduled
    var doesntNeedFrame = this.batch.mode === 'reading'
      || this.batch.scheduled;

    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;

    // Schedule a new
    // frame, then return
    this.scheduleBatch();
    return id;
  };

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @api public
   */
  FastDom.prototype.write = function(fn, ctx) {
    var job = this.add('write', fn, ctx);
    var mode = this.batch.mode;
    var id = job.id;

    // Push the job id into the queue
    this.batch.write.push(job.id);

    // We should *not* schedule a new frame if:
    // 1. We are 'writing'
    // 2. We are 'reading'
    // 3. A frame is already scheduled.
    var doesntNeedFrame = mode === 'writing'
      || mode === 'reading'
      || this.batch.scheduled;

    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;

    // Schedule a new
    // frame, then return
    this.scheduleBatch();
    return id;
  };

  /**
   * Defers the given job
   * by the number of frames
   * specified.
   *
   * If no frames are given
   * then the job is run in
   * the next free frame.
   *
   * @param  {Number}   frame
   * @param  {Function} fn
   * @api public
   */
  FastDom.prototype.defer = function(frame, fn, ctx) {

    // Accepts two arguments
    if (typeof frame === 'function') {
      ctx = fn;
      fn = frame;
      frame = 1;
    }

    var self = this;
    var index = frame - 1;

    return this.schedule(index, function() {
      self.run({
        fn: fn,
        ctx: ctx
      });
    });
  };

  /**
   * Clears a scheduled 'read',
   * 'write' or 'defer' job.
   *
   * @param  {Number} id
   * @api public
   */
  FastDom.prototype.clear = function(id) {

    // Defer jobs are cleared differently
    if (typeof id === 'function') {
      return this.clearFrame(id);
    }

    var job = this.batch.hash[id];
    if (!job) return;

    var list = this.batch[job.type];
    var index = list.indexOf(id);

    // Clear references
    delete this.batch.hash[id];
    if (~index) list.splice(index, 1);
  };

  /**
   * Clears a scheduled frame.
   *
   * @param  {Function} frame
   * @api private
   */
  FastDom.prototype.clearFrame = function(frame) {
    var index = this.frames.indexOf(frame);
    if (~index) this.frames.splice(index, 1);
  };

  /**
   * Schedules a new read/write
   * batch if one isn't pending.
   *
   * @api private
   */
  FastDom.prototype.scheduleBatch = function() {
    var self = this;

    // Schedule batch for next frame
    this.schedule(0, function() {
      self.batch.scheduled = false;
      self.runBatch();
    });

    // Set flag to indicate
    // a frame has been scheduled
    this.batch.scheduled = true;
  };

  /**
   * Generates a unique
   * id for a job.
   *
   * @return {Number}
   * @api private
   */
  FastDom.prototype.uniqueId = function() {
    return ++this.lastId;
  };

  /**
   * Calls each job in
   * the list passed.
   *
   * If a context has been
   * stored on the function
   * then it is used, else the
   * current `this` is used.
   *
   * @param  {Array} list
   * @api private
   */
  FastDom.prototype.flush = function(list) {
    var id;

    while (id = list.shift()) {
      this.run(this.batch.hash[id]);
    }
  };

  /**
   * Runs any 'read' jobs followed
   * by any 'write' jobs.
   *
   * We run this inside a try catch
   * so that if any jobs error, we
   * are able to recover and continue
   * to flush the batch until it's empty.
   *
   * @api private
   */
  FastDom.prototype.runBatch = function() {
    try {

      // Set the mode to 'reading',
      // then empty all read jobs
      this.batch.mode = 'reading';
      this.flush(this.batch.read);

      // Set the mode to 'writing'
      // then empty all write jobs
      this.batch.mode = 'writing';
      this.flush(this.batch.write);

      this.batch.mode = null;

    } catch (e) {
      this.runBatch();
      throw e;
    }
  };

  /**
   * Adds a new job to
   * the given batch.
   *
   * @param {Array}   list
   * @param {Function} fn
   * @param {Object}   ctx
   * @returns {Number} id
   * @api private
   */
  FastDom.prototype.add = function(type, fn, ctx) {
    var id = this.uniqueId();
    return this.batch.hash[id] = {
      id: id,
      fn: fn,
      ctx: ctx,
      type: type
    };
  };

  /**
   * Runs a given job.
   *
   * Applications using FastDom
   * have the options of setting
   * `fastdom.onError`.
   *
   * This will catch any
   * errors that may throw
   * inside callbacks, which
   * is useful as often DOM
   * nodes have been removed
   * since a job was scheduled.
   *
   * Example:
   *
   *   fastdom.onError = function(e) {
   *     // Runs when jobs error
   *   };
   *
   * @param  {Object} job
   * @api private
   */
  FastDom.prototype.run = function(job){
    var ctx = job.ctx || this;
    var fn = job.fn;

    // Clear reference to the job
    delete this.batch.hash[job.id];

    // If no `onError` handler
    // has been registered, just
    // run the job normally.
    if (!this.onError) {
      return fn.call(ctx);
    }

    // If an `onError` handler
    // has been registered, catch
    // errors that throw inside
    // callbacks, and run the
    // handler instead.
    try { fn.call(ctx); } catch (e) {
      this.onError(e);
    }
  };

  /**
   * Starts of a rAF loop
   * to empty the frame queue.
   *
   * @api private
   */
  FastDom.prototype.loop = function() {
    var self = this;
    var raf = this.raf;

    // Don't start more than one loop
    if (this.looping) return;

    raf(function frame() {
      var fn = self.frames.shift();

      // If no more frames,
      // stop looping
      if (!self.frames.length) {
        self.looping = false;

      // Otherwise, schedule the
      // next frame
      } else {
        raf(frame);
      }

      // Run the frame.  Note that
      // this may throw an error
      // in user code, but all
      // fastdom tasks are dealt
      // with already so the code
      // will continue to iterate
      if (fn) fn();
    });

    this.looping = true;
  };

  /**
   * Adds a function to
   * a specified index
   * of the frame queue.
   *
   * @param  {Number}   index
   * @param  {Function} fn
   * @return {Function}
   */
  FastDom.prototype.schedule = function(index, fn) {

    // Make sure this slot
    // hasn't already been
    // taken. If it has, try
    // re-scheduling for the next slot
    if (this.frames[index]) {
      return this.schedule(index + 1, fn);
    }

    // Start the rAF
    // loop to empty
    // the frame queue
    this.loop();

    // Insert this function into
    // the frames queue and return
    return this.frames[index] = fn;
  };

  // We only ever want there to be
  // one instance of FastDom in an app
  fastdom = fastdom || new FastDom();

  /**
   * Expose 'fastdom'
   */

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fastdom;
  } else if (typeof define === 'function' && define.amd) {
    define(function(){ return fastdom; });
  } else {
    window['fastdom'] = fastdom;
  }

})(window.fastdom);

});
require.register("ripplejs-compiler/index.js", function(exports, require, module){
var walk = require('dom-walk');
var emitter = require('emitter');
var find = require('find');
var isBoolean = require('is-boolean-attribute');
var dom = require('fastdom');
var domify = require('domify');
var each = require('each');
var attrs = require('attributes');

/**
 * Attach the view to a DocumentFragment
 *
 * @param {View} view
 *
 * @return {DocumentFragment}
 */
function attachToFragment(el) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);
  return fragment;
}


/**
 * The compiler will take a set of views, an element and
 * a scope and process each node going down the tree. Whenever
 * it finds a node matching a directive it will process it.
 */
function Compiler(options) {
  this.components = [];
  this.directives = [];
  this.options = options;
}


/**
 * Mixins
 */
emitter(Compiler.prototype);


/**
 * For plugins
 *
 * @param {Function} fn
 *
 * @return {Compiler}
 */
Compiler.prototype.use = function(fn) {
  fn(this);
  return this;
};


/**
 * Add a component binding. This will be rendered as a separate
 * view and have it's own scope.
 *
 * @param {String|Regex} matches String or regex to match an element name
 * @param {Function} View
 * @param {Object} options
 */
Compiler.prototype.component = function(matches, fn) {
  this.components.push({
    matches: matches,
    fn: fn
  });
  return this;
};


/**
 * Add an attribute binding. Whenever this attribute is matched
 * in the DOM the function will be code with the current view
 * and the element.
 *
 * @param {String|Regex} matches String or regex to match an attribute name
 * @param {Function} process
 * @param {Object} options
 */
Compiler.prototype.directive = function(matches, fn) {
  this.directives.push({
    matches: matches,
    fn: fn
  });
  return this;
};

/**
 * Check if there's a component for this element
 *
 * @param {Element} el
 *
 * @return {Mixed}
 */
Compiler.prototype.getComponentBinding = function(el) {
  return this.getBinding(el.nodeName.toLowerCase(), this.components);
};


/**
 * Get the attribute binding for an attribute
 *
 * @param {String} attr
 *
 * @return {Mixed}
 */
Compiler.prototype.getAttributeBinding = function(attr) {
  return this.getBinding(attr, this.directives);
};


/**
 * Get the attribute binding for an attribute
 *
 * @param {String} attr
 *
 * @return {Mixed}
 */
Compiler.prototype.getBinding = function(name, bindings) {
  var matched = find(bindings, function(binding){
    if(typeof binding.matches === 'string') {
      if(name === binding.matches.toLowerCase()) return binding;
      return;
    }
    if(binding.matches.test(name)){
      return binding;
    }
  });
  if(!matched) return undefined;
  return matched.fn;
};


/**
 * Compile a template into an element and
 * bind it to this view
 *
 * @return {Element}
 */
Compiler.prototype.render = function(template, view) {
  var self = this;
  this.view = view;
  var el = domify(template);
  var fragment = attachToFragment(el);
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      self.processTextNode(node);
    }
    else if(node.nodeType === 1) {
      self.processNode(node);
    }
    next();
  });
  return fragment.firstChild;
};


/**
 * Process a text node. Interpolate the text node
 * using the view if possible.
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {void}
 */
Compiler.prototype.processTextNode = function(node) {
  this.view.interpolate(node.data, function(val){
    dom.write(function(){
      if(val && val.nodeType) {
        node.parentNode.replaceChild(val, node);
        node = val;
      }
      else {
        var text = document.createTextNode(typeof val === 'string' ? val : '');
        node.parentNode.replaceChild(text, node);
        node = text;
      }
    });
  });
};


/**
 * Process a single node on the view. If there is a Component
 * for this element, we'll create that view and replace the
 * placeholder element with that component.
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {boolean}
 */
Compiler.prototype.processNode = function(node) {
  var fn = this.getComponentBinding(node);
  if(!fn) return this.processAttributes(node);
  fn.call(this, node, this.view);
};


/**
 * Process the attributes on a node. If there is a binding for
 * an attribute it will run it, otherwise it will try to
 * interpolate the attributes value using the view
 *
 * @param {View} view
 * @param {Element} node
 *
 * @return {void}
 */
Compiler.prototype.processAttributes = function(node) {
  var view = this.view;
  var self = this;

  each(attrs(node), function(attr, value){
    var binding = self.getAttributeBinding(attr);
    if(binding) {
      binding.call(self, view, node, attr, value);
    }
    else {
      self.interpolateAttribute(node, attr, value);
    }
  });
};


/**
 * Interpolate an attribute on a node using the view
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 *
 * @api private
 * @return {void}
 */
Compiler.prototype.interpolateAttribute = function(node, attr, value) {
  this.view.interpolate(value, function(val){
    dom.write(function(){
      if(isBoolean(attr) && !val) {
        node.removeAttribute(attr);
      }
      else {
        node.setAttribute(attr, val);
      }
    });
  });
};

module.exports = Compiler;
});
require.register("ripplejs-view-compiler/index.js", function(exports, require, module){
var Compiler = require('compiler');
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
    View.on('destroy', function(){
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

        var props = {};
        each(attrs(node), function(name, value){
          props[name] = view.interpolate(value);
        });

        var component = Component.create({
          owner: view,
          props: props
        });

        each(attrs(node), function(name, value){
          view.interpolate(value, function(val){
            component.props.set(name, val);
          });
        });

        component.mount(node, {
          replace: true,
          template: (node.innerHTML !== "") ? node.innerHTML : null
        });

        view.on('destroy', function(){
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
      View.emit('before mount', this, node, options);
      this.emit('before mount', node, options);
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
      View.emit('mount', this, node, options);
      this.emit('mount', node, options);
      return this;
    };

    /**
     * Remove the element from the DOM
     *
     * @return {View}
     */
    View.prototype.unmount = function() {
      if(!this.el || !this.el.parentNode) return this;
      this.el.parentNode.removeChild(this.el);
      this.el = null;
      View.emit('unmount', this);
      this.emit('unmount');
      return this;
    };

  };
};
});
require.register("ripple/index.js", function(exports, require, module){
var view = require('view');
var interpolate = require('view-interpolate');
var compiler = require('view-compiler');

module.exports = function(template) {
  return view()
    .use(interpolate)
    .use(compiler(template));
};


});






































require.alias("ripplejs-view/index.js", "ripple/deps/view/index.js");
require.alias("ripplejs-view/index.js", "ripple/deps/view/index.js");
require.alias("ripplejs-view/index.js", "view/index.js");
require.alias("component-domify/index.js", "ripplejs-view/deps/domify/index.js");

require.alias("component-emitter/index.js", "ripplejs-view/deps/emitter/index.js");

require.alias("ripplejs-model/index.js", "ripplejs-view/deps/model/index.js");
require.alias("component-emitter/index.js", "ripplejs-model/deps/emitter/index.js");

require.alias("ripplejs-path-observer/index.js", "ripplejs-model/deps/path-observer/index.js");
require.alias("ripplejs-path-observer/index.js", "ripplejs-model/deps/path-observer/index.js");
require.alias("ripplejs-keypath/index.js", "ripplejs-path-observer/deps/keypath/index.js");
require.alias("ripplejs-keypath/index.js", "ripplejs-path-observer/deps/keypath/index.js");
require.alias("ripplejs-keypath/index.js", "ripplejs-keypath/index.js");
require.alias("component-emitter/index.js", "ripplejs-path-observer/deps/emitter/index.js");

require.alias("jkroso-equals/index.js", "ripplejs-path-observer/deps/equals/index.js");
require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

require.alias("component-clone/index.js", "ripplejs-path-observer/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("ripplejs-path-observer/index.js", "ripplejs-path-observer/index.js");
require.alias("ripplejs-computed/index.js", "ripplejs-view/deps/computed/index.js");

require.alias("ripplejs-accessors/index.js", "ripplejs-view/deps/accessors/index.js");

require.alias("timoxley-to-array/index.js", "ripplejs-view/deps/to-array/index.js");

require.alias("ripplejs-view/index.js", "ripplejs-view/index.js");
require.alias("ripplejs-view-interpolate/index.js", "ripple/deps/view-interpolate/index.js");
require.alias("ripplejs-view-interpolate/index.js", "view-interpolate/index.js");
require.alias("ripplejs-interpolate/index.js", "ripplejs-view-interpolate/deps/interpolate/index.js");
require.alias("ripplejs-interpolate/index.js", "ripplejs-view-interpolate/deps/interpolate/index.js");
require.alias("component-assert/index.js", "ripplejs-interpolate/deps/assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

require.alias("jkroso-equals/index.js", "component-assert/deps/equals/index.js");
require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
require.alias("component-props/index.js", "ripplejs-expression/deps/props/index.js");

require.alias("yields-uniq/index.js", "ripplejs-expression/deps/uniq/index.js");
require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

require.alias("ripplejs-expression/index.js", "ripplejs-expression/index.js");
require.alias("component-format-parser/index.js", "ripplejs-interpolate/deps/format-parser/index.js");

require.alias("yields-uniq/index.js", "ripplejs-interpolate/deps/uniq/index.js");
require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

require.alias("component-props/index.js", "ripplejs-interpolate/deps/props/index.js");

require.alias("ripplejs-interpolate/index.js", "ripplejs-interpolate/index.js");
require.alias("ripplejs-view-compiler/index.js", "ripple/deps/view-compiler/index.js");
require.alias("ripplejs-view-compiler/index.js", "view-compiler/index.js");
require.alias("anthonyshort-attributes/index.js", "ripplejs-view-compiler/deps/attributes/index.js");

require.alias("component-each/index.js", "ripplejs-view-compiler/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("ripplejs-compiler/index.js", "ripplejs-view-compiler/deps/compiler/index.js");
require.alias("anthonyshort-dom-walk/index.js", "ripplejs-compiler/deps/dom-walk/index.js");
require.alias("anthonyshort-dom-walk/index.js", "ripplejs-compiler/deps/dom-walk/index.js");
require.alias("timoxley-to-array/index.js", "anthonyshort-dom-walk/deps/to-array/index.js");

require.alias("jaycetde-dom-contains/index.js", "anthonyshort-dom-walk/deps/dom-contains/index.js");

require.alias("anthonyshort-dom-walk/index.js", "anthonyshort-dom-walk/index.js");
require.alias("anthonyshort-attributes/index.js", "ripplejs-compiler/deps/attributes/index.js");

require.alias("component-emitter/index.js", "ripplejs-compiler/deps/emitter/index.js");

require.alias("component-find/index.js", "ripplejs-compiler/deps/find/index.js");
require.alias("component-to-function/index.js", "component-find/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

require.alias("anthonyshort-is-boolean-attribute/index.js", "ripplejs-compiler/deps/is-boolean-attribute/index.js");
require.alias("anthonyshort-is-boolean-attribute/index.js", "ripplejs-compiler/deps/is-boolean-attribute/index.js");
require.alias("anthonyshort-is-boolean-attribute/index.js", "anthonyshort-is-boolean-attribute/index.js");
require.alias("wilsonpage-fastdom/index.js", "ripplejs-compiler/deps/fastdom/index.js");
require.alias("wilsonpage-fastdom/index.js", "ripplejs-compiler/deps/fastdom/index.js");
require.alias("wilsonpage-fastdom/index.js", "wilsonpage-fastdom/index.js");
require.alias("ripplejs-interpolate/index.js", "ripplejs-compiler/deps/interpolate/index.js");
require.alias("ripplejs-interpolate/index.js", "ripplejs-compiler/deps/interpolate/index.js");
require.alias("component-assert/index.js", "ripplejs-interpolate/deps/assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

require.alias("jkroso-equals/index.js", "component-assert/deps/equals/index.js");
require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
require.alias("component-props/index.js", "ripplejs-expression/deps/props/index.js");

require.alias("yields-uniq/index.js", "ripplejs-expression/deps/uniq/index.js");
require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

require.alias("ripplejs-expression/index.js", "ripplejs-expression/index.js");
require.alias("component-format-parser/index.js", "ripplejs-interpolate/deps/format-parser/index.js");

require.alias("yields-uniq/index.js", "ripplejs-interpolate/deps/uniq/index.js");
require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

require.alias("component-props/index.js", "ripplejs-interpolate/deps/props/index.js");

require.alias("ripplejs-interpolate/index.js", "ripplejs-interpolate/index.js");
require.alias("component-domify/index.js", "ripplejs-compiler/deps/domify/index.js");

require.alias("component-each/index.js", "ripplejs-compiler/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");
if (typeof exports == "object") {
  module.exports = require("ripple");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("ripple"); });
} else {
  this["ripple"] = require("ripple");
}})();