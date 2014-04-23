;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function _require(path, parent, orig) {
  var resolved = _require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err._require = true;
    throw err;
  }

  var module = _require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, _require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

_require.modules = {};

/**
 * Registered aliases.
 */

_require.aliases = {};

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

_require.resolve = function(path) {
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
    if (_require.modules.hasOwnProperty(path)) return path;
    if (_require.aliases.hasOwnProperty(path)) return _require.aliases[path];
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

_require.normalize = function(curr, path) {
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

_require.register = function(path, definition) {
  _require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

_require.alias = function(from, to) {
  if (!_require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  _require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

_require.relative = function(parent) {
  var p = _require.normalize(parent, '..');

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
    return _require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return _require.normalize(p, path);

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
    return _require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
_require.register("anthonyshort-attributes/index.js", function(exports, _require, module){
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
_require.register("timoxley-to-array/index.js", function(exports, _require, module){
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
_require.register("jaycetde-dom-contains/index.js", function(exports, _require, module){
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
_require.register("anthonyshort-dom-walk/index.js", function(exports, _require, module){
var array = _require('to-array');
var contains = _require('dom-contains');

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
_require.register("anthonyshort-is-boolean-attribute/index.js", function(exports, _require, module){

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
_require.register("component-raf/index.js", function(exports, _require, module){
/**
 * Expose `requestAnimationFrame()`.
 */

exports = module.exports = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || fallback;

/**
 * Fallback implementation.
 */

var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  var req = setTimeout(fn, ms);
  prev = curr;
  return req;
}

/**
 * Cancel.
 */

var cancel = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.oCancelAnimationFrame
  || window.msCancelAnimationFrame
  || window.clearTimeout;

exports.cancel = function(id){
  cancel.call(window, id);
};

});
_require.register("anthonyshort-raf-queue/index.js", function(exports, _require, module){
var raf = _require('raf');
var queue = [];
var requestId;
var id = 0;

/**
 * Add a job to the queue passing in
 * an optional context to call the function in
 *
 * @param {Function} fn
 * @param {Object} cxt
 */

function frame (fn, cxt) {
  var frameId = id++;
  var length = queue.push({
    id: frameId,
    fn: fn,
    cxt: cxt
  });
  if(!requestId) requestId = raf(flush);
  return frameId;
};

/**
 * Remove a job from the queue using the
 * frameId returned when it was added
 *
 * @param {Number} id
 */

frame.cancel = function (id) {
  for (var i = queue.length - 1; i >= 0; i--) {
    if(queue[i].id === id) {
      queue.splice(i, 1);
      break;
    }
  }
};

/**
 * Add a function to the queue, but only once
 *
 * @param {Function} fn
 * @param {Object} cxt
 */

frame.once = function (fn, cxt) {
  for (var i = queue.length - 1; i >= 0; i--) {
    if(queue[i].fn === fn) return;
  }
  frame(fn, cxt);
};

/**
 * Get the current queue length
 */

frame.queued = function () {
  return queue.length;
};

/**
 * Clear the queue and remove all pending jobs
 */

frame.clear = function () {
  queue = [];
  if(requestId) raf.cancel(requestId);
  requestId = null;
};

/**
 * Fire a function after all of the jobs in the
 * current queue have fired. This is usually used
 * in testing.
 */

frame.defer = function (fn) {
  raf(raf.bind(null, fn));
};

/**
 * Flushes the queue and runs each job
 */

function flush () {
  while(queue.length) {
    var job = queue.shift();
    job.fn.call(job.cxt);
  }
  requestId = null;
}

module.exports = frame;
});
_require.register("component-domify/index.js", function(exports, _require, module){

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
_require.register("component-props/index.js", function(exports, _require, module){
/**
 * Global Names
 */

var globals = /\b(this|Array|Date|Object|Math|JSON)\b/g;

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
    .match(/[$a-zA-Z_]\w*/g)
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
_require.register("component-to-function/index.js", function(exports, _require, module){
/**
 * Module Dependencies
 */

var expr = _require('props');

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
_require.register("component-type/index.js", function(exports, _require, module){

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
_require.register("component-each/index.js", function(exports, _require, module){

/**
 * Module dependencies.
 */

var type = _require('type');
var toFunction = _require('to-function');

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
_require.register("component-emitter/index.js", function(exports, _require, module){

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
_require.register("ripplejs-expression/index.js", function(exports, _require, module){
var props = _require('props');
var unique = _require('uniq');
var cache = {};

function Expression(str) {
  this.str = str;
  this.props = unique(props(str));
  this.fn = compile(str, this.props);
}

Expression.prototype.exec = function(scope, context){
  scope = scope || {};
  var args = scope ? values(scope, this.props) : [];
  return this.fn.apply(context, args);
};

Expression.prototype.toString = function(){
  return this.str;
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
_require.register("component-format-parser/index.js", function(exports, _require, module){

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
_require.register("ripplejs-interpolate/index.js", function(exports, _require, module){
var Expression = _require('expression');
var parse = _require('format-parser');
var unique = _require('uniq');

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
 * @param  {Object} options
 * @return {String}
 */
Interpolate.prototype.exec = function(input, options){
  options = options || {};
  var parts = input.split('|');
  var expr = parts.shift();
  var fn = new Expression(expr);
  var val = fn.exec(options.scope, options.context);
  if(parts.length) {
    val = filter(val, parts, options.filters || this.filters);
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
Interpolate.prototype.replace = function(input, options){
  var self = this;
  return input.replace(this.match, function(_, match){
    var val = self.exec(match, options);
    return (val == null) ? '' : val;
  });
};


/**
 * Get the interpolated value from a string
 */
Interpolate.prototype.value = function(input, options){
  var matches = this.matches(input);
  if( matches.length === 0 ) return input;
  if( matches[0].length !== input.length ) return this.replace(input, options);
  return this.exec(matches[1], options);
};


/**
 * Get all the interpolated values from a string
 *
 * @return {Array} Array of values
 */
Interpolate.prototype.values = function(input, options){
  var self = this;
  return this.map(input, function(match){
    return self.value(match, options);
  });
};


/**
 * Find all the properties used in all expressions in a string
 * @param  {String} str
 * @return {Array}
 */
Interpolate.prototype.props = function(str) {
  var arr = [];
  this.each(str, function(match, expr, filters){
    var fn = new Expression(expr);
    arr = arr.concat(fn.props);
  });
  return unique(arr);
};


/**
 * Loop through each matched expression in a string
 *
 * @param {String} str
 *
 * @return {void}
 */
Interpolate.prototype.each = function(str, callback) {
  var m;
  var index = 0;
  var re = this.match;
  while (m = re.exec(str)) {
    var parts = m[1].split('|');
    var expr = parts.shift();
    var filters = parts.join('|');
    callback(m[0], expr, filters, index);
    index++;
  }
};


/**
 * Map the string
 *
 * @param {String} str
 * @param {Function} callback
 *
 * @return {Array}
 */
Interpolate.prototype.map = function(str, callback) {
  var ret = [];
  this.each(str, function(){
    ret.push(callback.apply(null, arguments));
  });
  return ret;
};


module.exports = Interpolate;
});
_require.register("ripplejs-keypath/index.js", function(exports, _require, module){
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
_require.register("jkroso-type/index.js", function(exports, _require, module){

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
_require.register("jkroso-equals/index.js", function(exports, _require, module){

var type = _require('type')

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
_require.register("component-clone/index.js", function(exports, _require, module){
/**
 * Module dependencies.
 */

var type;
try {
  type = _require('component-type');
} catch (_) {
  type = _require('type');
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
_require.register("ripplejs-path-observer/index.js", function(exports, _require, module){
var emitter = _require('emitter');
var equals = _require('equals');
var clone = _require('clone');
var keypath = _require('keypath');

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
_require.register("component-indexof/index.js", function(exports, _require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
_require.register("yields-uniq/index.js", function(exports, _require, module){

/**
 * dependencies
 */

try {
  var indexOf = _require('indexof');
} catch(e){
  var indexOf = _require('indexof-component');
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
_require.register("ripple/lib/index.js", function(exports, _require, module){
var view = _require('./view');

module.exports = function(template) {
  if(template.indexOf('#') === 0 || template.indexOf('.') === 0) {
    template = document.querySelector(template);
  }
  if(typeof template.innerHTML === 'string') {
    template = template.innerHTML;
  }
  return view(template);
};
});
_require.register("ripple/lib/view.js", function(exports, _require, module){
var emitter = _require('emitter');
var model = _require('./model');
var Bindings = _require('./bindings');
var each = _require('each');

/**
 * Each of the events that are called on the view
 * and have helper methods created for them.
 */

var lifecycleEvents = [
  'construct',
  'created',
  'ready',
  'mounted',
  'unmounted',
  'destroying',
  'destroyed'
];

/**
 * Get a node using element the element itself
 * or a CSS selector
 *
 * @param {Element|String} node
 *
 * @return {Element}
 */

function getNode(node) {
  if (typeof node === 'string') {
    node = document.querySelector(node);
    if (!node) throw new Error('DOM node doesn\'t exist');
  }
  return node;
}

module.exports = function(template) {

  /**
   * Stores all of the directives, views,
   * filters etc. that we might want to share
   * between views.
   *
   * @type {Bindings}
   */
  var bindings = new Bindings();

  /**
   * Stores the state of the view.
   *
   * @type {Function}
   */
  var Model = model();

  /**
   * The view controls the lifecycle of the
   * element that it creates from a template.
   * Each element can only have one view and
   * each view can only have one element.
   */
  function View(options) {
    options = options || {};
    View.emit('construct', this, [options]);
    this.options = options;
    this.children = [];
    this.template = options.template || template;
    this.owner = options.owner;
    this.bindings = options.bindings || bindings;
    this.root = this;
    if (this.owner) {
      this.owner.children.push(this);
      this.root = this.owner.root;
    }
    this.scope = options.scope;
    this.scopeWatchers = {};
    this.model = new Model(View.parse(options));
    this.data = this.model.props;
    View.emit('created', this);
    this.el = this.render();
    View.emit('ready', this);
  }

  /**
   * Mixins
   */
  emitter(View);
  emitter(View.prototype);

  /**
   * Add a directive
   *
   * @param {String|Regex} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.directive = function(match, fn) {
    bindings.directive(match, fn);
    return this;
  };

  /**
   * Add a component
   *
   * @param {String} match
   * @param {Function} fn
   *
   * @return {View}
   */
  View.compose = function(name, Child) {
    bindings.component(name, Child);
    return this;
  };

  /**
   * Add interpolation filter
   *
   * @param {String} name
   * @param {Function} fn
   *
   * @return {View}
   */
  View.filter = function(name, fn) {
    if (typeof name !== 'string') {
      for(var key in name) {
        View.filter(key, name[key]);
      }
      return;
    }
    bindings.filter(name, fn);
    return this;
  };

  /**
   * Use a plugin
   *
   * @return {View}
   */
  View.use = function(fn, options) {
    fn(View, options);
    return this;
  };

  /**
   * Create helper methods for binding to events
   */
  lifecycleEvents.forEach(function(name) {
    View[name] = function(fn){
      View.on(name, function(view, args){
        fn.apply(view, args);
      });
    };
  });

  /**
   * Parse the options for the initial data
   */
  View.parse = function(options) {
    return options.data;
  };

  /**
   * Set the state off the view. This will trigger
   * refreshes to the UI. If we were previously
   * watching the parent scope for changes to this
   * property, we will remove all of those watchers
   * and then bind them to our model instead.
   *
   * @param {Object} obj
   */
  View.prototype.set = function(key, value) {
    if ( typeof key !== 'string' ) {
      for(var name in key) this.set(name, key[name]);
      return this;
    }
    if (this.scope && this.scopeWatchers[key]) {
      var self = this;
      this.scopeWatchers[key].forEach(function(callback){
        self.scope.unwatch(key, callback);
        self.model.watch(key, callback);
      });
      delete this.scopeWatchers[key];
    }
    this.model.set(key, value);
    return this;
  };

  /**
   * Get some data
   *
   * @param {String} key
   */
  View.prototype.get = function(key) {
    var value = this.model.get(key);
    if (value === undefined && this.scope) {
      return this.scope.get(key);
    }
    return value;
  };

  /**
   * Remove the element from the DOM
   */
  View.prototype.destroy = function() {
    var self = this;
    this.emit('destroying');
    View.emit('destroying', this);
    this.remove();
    this.model.destroy();
    this.off();
    this.children.forEach(function(child){
      child.destroy();
    });
    if (this.owner) {
      var index = this.owner.children.indexOf(this);
      this.owner.children.splice(index, 1);
    }
    each(this.scopeWatchers, function(key, callbacks){
      callbacks.forEach(function(callback){
        self.scope.unwatch(key, callback);
      });
    });
    this.scopeWatchers = null;
    this.scope = null;
    this.el = null;
    this.owner = null;
    this.root = null;
    this.data = null;
    this.emit('destroyed');
    View.emit('destroyed', this);
  };

  /**
   * Is the view mounted in the DOM
   *
   * @return {Boolean}
   */
  View.prototype.isMounted = function() {
    return this.el != null && this.el.parentNode != null;
  };

  /**
   * Render the view to an element. This should
   * only ever render the element once.
   */
  View.prototype.render = function() {
    return this.bindings.bind(this);
  };

  /**
   * Mount the view onto a node
   *
   * @param {Element|String} node An element or CSS selector
   *
   * @return {View}
   */
  View.prototype.appendTo = function(node) {
    getNode(node).appendChild(this.el);
    this.emit('mounted');
    View.emit('mounted', this);
    return this;
  };

  /**
   * Replace an element in the DOM with this view
   *
   * @param {Element|String} node An element or CSS selector
   *
   * @return {View}
   */
  View.prototype.replace = function(node) {
    var target = getNode(node);
    target.parentNode.replaceChild(this.el, target);
    this.emit('mounted');
    View.emit('mounted', this);
    return this;
  };

  /**
   * Insert the view before a node
   *
   * @param {Element|String} node
   *
   * @return {View}
   */
  View.prototype.before = function(node) {
    var target = getNode(node);
    target.parentNode.insertBefore(this.el, target);
    this.emit('mounted');
    View.emit('mounted', this);
    return this;
  };

  /**
   * Insert the view after a node
   *
   * @param {Element|String} node
   *
   * @return {View}
   */
  View.prototype.after = function(node) {
    var target = getNode(node);
    target.parentNode.insertBefore(this.el, target.nextSibling);
    this.emit('mounted');
    View.emit('mounted', this);
    return this;
  };

  /**
   * Remove the view from the DOM
   *
   * @return {View}
   */
  View.prototype.remove = function() {
    if (this.isMounted() === false) return this;
    this.el.parentNode.removeChild(this.el);
    this.emit('unmounted');
    View.emit('unmounted', this);
    return this;
  };

  /**
   * Interpolate a string
   *
   * @param {String} str
   */
  View.prototype.interpolate = function(str) {
    var self = this;
    var data = {};
    var props = this.bindings.interpolator.props(str);
    props.forEach(function(prop){
      data[prop] = self.get(prop);
    });
    return this.bindings.interpolator.value(str, {
      context: this.scope || this,
      scope: data
    });
  };

  /**
   * Watch a property for changes
   *
   * @param {Strign} prop
   * @param {Function} callback
   */
  View.prototype.watch = function(prop, callback) {
    var self = this;
    if (Array.isArray(prop)) {
      return prop.forEach(function(name){
        self.watch(name, callback);
      });
    }
    var value = this.model.get(prop);
    if (value === undefined && this.scope) {
      this.scope.watch(prop, callback);
      if (!this.scopeWatchers[prop]) {
        this.scopeWatchers[prop] = [];
      }
      this.scopeWatchers[prop].push(callback);
      return;
    }
    return this.model.watch(prop, callback);
  };

  /**
   * Stop watching a property
   *
   * @param {Strign} prop
   * @param {Function} callback
   */
  View.prototype.unwatch = function(prop, callback) {
    var self = this;
    if (Array.isArray(prop)) {
      return prop.forEach(function(name){
        self.unwatch(name, callback);
      });
    }
    var value = this.model.get(prop);
    if (value === undefined && this.scope) {
      this.scope.unwatch(prop, callback);
      if (!this.scopeWatchers[prop]) return;
      var index = this.scopeWatchers[prop].indexOf(callback);
      this.scopeWatchers[prop].splice(index, 1);
      return;
    }
    return this.model.unwatch(prop, callback);
  };

  return View;
};
});
_require.register("ripple/lib/bindings.js", function(exports, _require, module){
var render = _require('./render');
var Interpolator = _require('interpolate');

/**
 * The compiler will take a set of views, an element and
 * a scope and process each node going down the tree. Whenever
 * it finds a node matching a directive it will process it.
 */
function Bindings() {
  this.components = {};
  this.directives = {};
  this.interpolator = new Interpolator();
}

/**
 * Add a component binding. This will be rendered as a separate
 * view and have it's own scope.
 *
 * @param {String|Regex} matches String or regex to match an element name
 * @param {Function} View
 * @param {Object} options
 */
Bindings.prototype.component = function(name, fn) {
  if(!fn) {
    return this.components[name.nodeName.toLowerCase()];
  }
  this.components[name.toLowerCase()] = fn;
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
Bindings.prototype.directive = function(attr, fn) {
  if(!fn) {
    return this.directives[attr];
  }
  this.directives[attr] = fn;
  return this;
};

/**
 * Add an interpolation filter
 *
 * @param {String} name
 * @param {Function} fn
 *
 * @return {Bindings}
 */
Bindings.prototype.filter = function(name, fn) {
  if(!fn) {
    return this.interpolator.filters[name];
  }
  this.interpolator.filter(name, fn);
  return this;
};

/**
 * Render a template and a view
 *
 * @param {View} view
 *
 * @return {Element}
 */
Bindings.prototype.bind = function(view) {
  return render(this, view);
};

module.exports = Bindings;
});
_require.register("ripple/lib/model.js", function(exports, _require, module){
var observer = _require('path-observer');
var emitter = _require('emitter');

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
   * @param {String} key
   * @param {Function} fn Function to call on event
   *
   * @return {Model}
   */
  Model.prototype.watch = function(key, callback) {
    this.observer(key).on('change', callback);
    return this;
  };

  /**
   * Stop watching a property for changes
   *
   * @param {String} key
   * @param {Function} fn
   *
   * @return {Model}
   */
  Model.prototype.unwatch = function(key, callback) {
    this.observer(key).off('change', callback);
    return this;
  };

  /**
   * Set a property using a keypath
   *
   * @param {String} key eg. 'foo.bar'
   * @param {Mixed} val
   */
  Model.prototype.set = function(key, val) {
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
    return this.observer(keypath).get();
  };

  /**
   * Destroy all observers
   *
   * @return {Model}
   */
  Model.prototype.destroy = function(){
    this.observer.dispose();
    return this;
  };

  return Model;
};
});
_require.register("ripple/lib/render.js", function(exports, _require, module){
var walk = _require('dom-walk');
var each = _require('each');
var attrs = _require('attributes');
var domify = _require('domify');
var TextBinding = _require('./text-binding');
var AttrBinding = _require('./attr-binding');
var ChildBinding = _require('./child-binding');
var Directive = _require('./directive');

module.exports = function(bindings, view) {
  var el = domify(view.template);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(el);

  var activeBindings = [];

  // Walk down the newly created view element
  // and bind everything to the model
  walk(el, function(node, next){
    if(node.nodeType === 3) {
      activeBindings.push(new TextBinding(view, node));
    }
    else if(node.nodeType === 1) {
      var View = bindings.component(node);
      if(View) {
        activeBindings.push(new ChildBinding(view, node, View));
        return next();
      }
      each(attrs(node), function(attr){
        var binding = bindings.directive(attr);
        if(binding) {
          activeBindings.push(new Directive(view, node, attr, binding));
        }
        else {
          activeBindings.push(new AttrBinding(view, node, attr));
        }
      });
    }
    next();
  });

  view.once('destroying', function(){
    while(activeBindings.length) {
      activeBindings.shift().unbind();
    }
  });

  view.activeBindings = activeBindings;

  return fragment.firstChild;
};

});
_require.register("ripple/lib/directive.js", function(exports, _require, module){
var raf = _require('raf-queue');

/**
 * Creates a new directive using a binding object.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 * @param {Object} binding
 */
function Directive(view, node, attr, binding) {
  this.queue = this.queue.bind(this);
  this.view = view;
  if(typeof binding === 'function') {
    this.binding = { update: binding };
  }
  else {
    this.binding = binding;
  }
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.bindings.interpolator.props(this.text);
  this.bind();
}

/**
 * Start watching the view for changes
 */
Directive.prototype.bind = function(){
  var view = this.view;
  var queue = this.queue;

  if(this.binding.bind) {
    this.binding.bind.call(this, this.node, this.view);
  }

  this.props.forEach(function(prop){
    view.watch(prop, queue);
  });

  this.update();
};

/**
 * Stop watching the view for changes
 */
Directive.prototype.unbind = function(){
  var view = this.view;
  var queue = this.queue;

  this.props.forEach(function(prop){
    view.unwatch(prop, queue);
  });

  if(this.job) {
    raf.cancel(this.job);
  }

  if(this.binding.unbind) {
    this.binding.unbind.call(this, this.node, this.view);
  }
};

/**
 * Update the attribute.
 */
Directive.prototype.update = function(){
  var value = this.view.interpolate(this.text);
  this.binding.update.call(this, value, this.node, this.view);
};

/**
 * Queue an update
 */
Directive.prototype.queue = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.update, this);
};

module.exports = Directive;
});
_require.register("ripple/lib/text-binding.js", function(exports, _require, module){
var raf = _require('raf-queue');

function TextBinding(view, node) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = view.bindings.interpolator.props(this.text);
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
    raf.cancel(this.job);
  }
};

TextBinding.prototype.render = function(){
  var node = this.node;
  var val = this.view.interpolate(this.text);

  if(val == null) {
    this.node.data = '';
  }
  else if(val instanceof Element) {
    node.parentNode.replaceChild(val, node);
    this.node = val;
  }
  else {
    var newNode = document.createTextNode(val);
    node.parentNode.replaceChild(newNode, node);
    this.node = newNode;
  }
};

TextBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = TextBinding;

});
_require.register("ripple/lib/attr-binding.js", function(exports, _require, module){
var isBoolean = _require('is-boolean-attribute');
var raf = _require('raf-queue');

/**
 * Creates a new attribute text binding for a view.
 * If the view attribute contains interpolation, the
 * attribute will be automatically updated whenever the
 * result of the expression changes.
 *
 * Updating will be called once per tick. So if there
 * are multiple changes to the view in a single tick,
 * this will only touch the DOM once.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 */
function AttrBinding(view, node, attr) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.bindings.interpolator.props(this.text);
  this.bind();
}

/**
 * Start watching the view for changes
 */
AttrBinding.prototype.bind = function(){
  if(!this.props.length) return;
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

/**
 * Stop watching the view for changes
 */
AttrBinding.prototype.unbind = function(){
  if(!this.props.length) return;
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Update the attribute
 *
 * @return {[type]}
 */
AttrBinding.prototype.render = function(){
  var val = this.view.interpolate(this.text);
  if(val == null) val = '';
  if(isBoolean(this.attr) && !val) {
    this.node.removeAttribute(this.attr);
  }
  else {
    this.node.setAttribute(this.attr, val);
  }
};

/**
 * Update the attribute.
 */
AttrBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = AttrBinding;
});
_require.register("ripple/lib/child-binding.js", function(exports, _require, module){
var attrs = _require('attributes');
var each = _require('each');
var unique = _require('uniq');
var raf = _require('raf-queue');

/**
 * Creates a new sub-view at a node and binds
 * it to the parent
 *
 * @param {View} view
 * @param {Element} node
 * @param {Function} View
 */
function ChildBinding(view, node, View) {
  this.update = this.update.bind(this);
  this.view = view;
  this.attrs = attrs(node);
  this.props = this.getProps();
  var data = this.values();
  data.yield = node.innerHTML;
  this.child = new View({
    owner: view,
    data: data
  });
  this.child.replace(node);
  this.child.on('destroyed', this.unbind.bind(this));
  this.node = this.child.el;
  this.bind();
}

/**
 * Get all of the properties used in all of the attributes
 *
 * @return {Array}
 */
ChildBinding.prototype.getProps = function(){
  var ret = [];
  var interpolator = this.view.bindings.interpolator;
  each(this.attrs, function(name, value){
    ret = ret.concat(interpolator.props(value));
  });
  return unique(ret);
};

/**
 * Bind to changes on the view. Whenever a property
 * changes we'll update the child with the new values.
 */
ChildBinding.prototype.bind = function(){
  var self = this;
  var view = this.view;

  this.props.forEach(function(prop){
    view.watch(prop, self.update);
  });

  this.send();
};

/**
 * Get all the data from the node
 *
 * @return {Object}
 */
ChildBinding.prototype.values = function(){
  var view = this.view;
  var ret = {};
  each(this.attrs, function(name, value){
    ret[name] = view.interpolate(value);
  });
  return ret;
};

/**
 * Send the data to the child
 */
ChildBinding.prototype.send = function(){
  this.child.set(this.values());
};

/**
 * Unbind this view from the parent
 */
ChildBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Update the child view will updated values from
 * the parent. This will batch changes together
 * and only fire once per tick.
 */
ChildBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.send, this);
};

module.exports = ChildBinding;

});






























_require.alias("anthonyshort-attributes/index.js", "ripple/deps/attributes/index.js");
_require.alias("anthonyshort-attributes/index.js", "attributes/index.js");

_require.alias("anthonyshort-dom-walk/index.js", "ripple/deps/dom-walk/index.js");
_require.alias("anthonyshort-dom-walk/index.js", "ripple/deps/dom-walk/index.js");
_require.alias("anthonyshort-dom-walk/index.js", "dom-walk/index.js");
_require.alias("timoxley-to-array/index.js", "anthonyshort-dom-walk/deps/to-array/index.js");

_require.alias("jaycetde-dom-contains/index.js", "anthonyshort-dom-walk/deps/dom-contains/index.js");

_require.alias("anthonyshort-dom-walk/index.js", "anthonyshort-dom-walk/index.js");
_require.alias("anthonyshort-is-boolean-attribute/index.js", "ripple/deps/is-boolean-attribute/index.js");
_require.alias("anthonyshort-is-boolean-attribute/index.js", "ripple/deps/is-boolean-attribute/index.js");
_require.alias("anthonyshort-is-boolean-attribute/index.js", "is-boolean-attribute/index.js");
_require.alias("anthonyshort-is-boolean-attribute/index.js", "anthonyshort-is-boolean-attribute/index.js");
_require.alias("anthonyshort-raf-queue/index.js", "ripple/deps/raf-queue/index.js");
_require.alias("anthonyshort-raf-queue/index.js", "raf-queue/index.js");
_require.alias("component-raf/index.js", "anthonyshort-raf-queue/deps/raf/index.js");

_require.alias("component-domify/index.js", "ripple/deps/domify/index.js");
_require.alias("component-domify/index.js", "domify/index.js");

_require.alias("component-each/index.js", "ripple/deps/each/index.js");
_require.alias("component-each/index.js", "each/index.js");
_require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
_require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

_require.alias("component-type/index.js", "component-each/deps/type/index.js");

_require.alias("component-emitter/index.js", "ripple/deps/emitter/index.js");
_require.alias("component-emitter/index.js", "emitter/index.js");

_require.alias("ripplejs-interpolate/index.js", "ripple/deps/interpolate/index.js");
_require.alias("ripplejs-interpolate/index.js", "ripple/deps/interpolate/index.js");
_require.alias("ripplejs-interpolate/index.js", "interpolate/index.js");
_require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
_require.alias("ripplejs-expression/index.js", "ripplejs-interpolate/deps/expression/index.js");
_require.alias("component-props/index.js", "ripplejs-expression/deps/props/index.js");

_require.alias("yields-uniq/index.js", "ripplejs-expression/deps/uniq/index.js");
_require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

_require.alias("ripplejs-expression/index.js", "ripplejs-expression/index.js");
_require.alias("component-format-parser/index.js", "ripplejs-interpolate/deps/format-parser/index.js");

_require.alias("yields-uniq/index.js", "ripplejs-interpolate/deps/uniq/index.js");
_require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

_require.alias("component-props/index.js", "ripplejs-interpolate/deps/props/index.js");

_require.alias("ripplejs-interpolate/index.js", "ripplejs-interpolate/index.js");
_require.alias("ripplejs-path-observer/index.js", "ripple/deps/path-observer/index.js");
_require.alias("ripplejs-path-observer/index.js", "ripple/deps/path-observer/index.js");
_require.alias("ripplejs-path-observer/index.js", "path-observer/index.js");
_require.alias("ripplejs-keypath/index.js", "ripplejs-path-observer/deps/keypath/index.js");
_require.alias("ripplejs-keypath/index.js", "ripplejs-path-observer/deps/keypath/index.js");
_require.alias("ripplejs-keypath/index.js", "ripplejs-keypath/index.js");
_require.alias("component-emitter/index.js", "ripplejs-path-observer/deps/emitter/index.js");

_require.alias("jkroso-equals/index.js", "ripplejs-path-observer/deps/equals/index.js");
_require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

_require.alias("component-clone/index.js", "ripplejs-path-observer/deps/clone/index.js");
_require.alias("component-type/index.js", "component-clone/deps/type/index.js");

_require.alias("ripplejs-path-observer/index.js", "ripplejs-path-observer/index.js");
_require.alias("yields-uniq/index.js", "ripple/deps/uniq/index.js");
_require.alias("yields-uniq/index.js", "uniq/index.js");
_require.alias("component-indexof/index.js", "yields-uniq/deps/indexof/index.js");

_require.alias("ripple/lib/index.js", "ripple/index.js");if (typeof exports == "object") {
  module.exports = _require("ripple");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return _require("ripple"); });
} else {
  this["ripple"] = _require("ripple");
}})();