
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function _require(name) {
  var module = _require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

_require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

_require.register = function (name, definition) {
  _require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

_require.define = function (name, exports) {
  _require.modules[name] = {
    exports: exports
  };
};
_require.register("anthonyshort~attributes@0.0.1", function (exports, module) {
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

_require.register("anthonyshort~is-boolean-attribute@0.0.1", function (exports, module) {

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

_require.register("component~domify@1.2.2", function (exports, module) {

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

_require.register("component~type@1.0.0", function (exports, module) {

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

_require.register("component~props@1.1.2", function (exports, module) {
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

_require.register("component~to-function@2.0.5", function (exports, module) {

/**
 * Module Dependencies
 */

var expr;
try {
  expr = _require("component~props@1.1.2");
} catch(e) {
  expr = _require("component~props@1.1.2");
}

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
  };
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
  };
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
  var match = {};
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key]);
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  };
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

  var val, i, prop;
  for (i = 0; i < props.length; i++) {
    prop = props[i];
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

    // mimic negative lookbehind to avoid problems with nested properties
    str = stripNested(prop, str, val);
  }

  return str;
}

/**
 * Mimic negative lookbehind to avoid problems with nested properties.
 *
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
 *
 * @param {String} prop
 * @param {String} str
 * @param {String} val
 * @return {String}
 * @api private
 */

function stripNested (prop, str, val) {
  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
    return $1 ? $0 : val;
  });
}

});

_require.register("component~each@0.2.4", function (exports, module) {

/**
 * Module dependencies.
 */

var type = _require("component~type@1.0.0");
var toFunction = _require("component~to-function@2.0.5");

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

_require.register("component~emitter@1.1.2", function (exports, module) {

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

_require.register("timoxley~to-array@0.2.1", function (exports, module) {
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

_require.register("jaycetde~dom-contains@master", function (exports, module) {
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

_require.register("anthonyshort~dom-walk@0.1.0", function (exports, module) {
var array = _require("timoxley~to-array@0.2.1");
var contains = _require("jaycetde~dom-contains@master");

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

_require.register("component~raf@1.1.3", function (exports, module) {
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

_require.register("anthonyshort~raf-queue@0.2.0", function (exports, module) {
var raf = _require("component~raf@1.1.3");
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

_require.register("component~indexof@0.0.1", function (exports, module) {

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});

_require.register("yields~uniq@master", function (exports, module) {

/**
 * dependencies
 */

try {
  var indexOf = _require("component~indexof@0.0.1");
} catch(e){
  var indexOf = _require("indexof-component");
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

_require.register("guille~ms.js@0.6.1", function (exports, module) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

});

_require.register("visionmedia~debug@1.0.4", function (exports, module) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _require("visionmedia~debug@1.0.4/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // This hackery is required for IE8,
  // where the `console.log` function doesn't have 'apply'
  return 'object' == typeof console
    && 'function' == typeof console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      localStorage.removeItem('debug');
    } else {
      localStorage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = localStorage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

});

_require.register("visionmedia~debug@1.0.4/debug.js", function (exports, module) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _require("guille~ms.js@0.6.1");

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

});

_require.register("ripplejs~expression@0.2.0", function (exports, module) {
var props = _require("component~props@1.1.2");
var unique = _require("yields~uniq@master");
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

_require.register("component~format-parser@0.0.2", function (exports, module) {

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

_require.register("ripplejs~interpolate@0.4.5", function (exports, module) {
var Expression = _require("ripplejs~expression@0.2.0");
var parse = _require("component~format-parser@0.0.2");
var unique = _require("yields~uniq@master");
var debug = _require("visionmedia~debug@1.0.4")('ripplejs/interpolate');

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
  var val;

  try {
    val = fn.exec(options.scope, options.context);
  }
  catch (e) {
    debug(e.message);
  }

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
  if( matches[0].trim().length !== input.trim().length ) return this.replace(input, options);
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

/**
 * Export the constructor
 *
 * @type {Function}
 */

module.exports = Interpolate;
});

_require.register("ripplejs~keypath@0.0.1", function (exports, module) {
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

_require.register("ripplejs~path-observer@0.2.0", function (exports, module) {
var emitter = _require("component~emitter@1.1.2");
var keypath = _require("ripplejs~keypath@0.0.1");
var type = _require("component~type@1.0.0");
var raf = _require("anthonyshort~raf-queue@0.2.0");

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
    Object.defineProperty(this, 'value', {
      get: function() {
        return keypath.get(obj, this.path);
      },
      set: function(val) {
        keypath.set(obj, this.path, val);
      }
    });
    cache[path] = this;
  }

  /**
   * Remove all path observers
   */
  PathObserver.dispose = function() {
    for(var path in cache) {
      cache[path].dispose();
    }
    this.off();
  };

  /**
   * Emit a change event next tick
   */
  PathObserver.change = function() {
    raf.once(this.notify, this);
  };

  /**
   * Notify observers of a change
   */
  PathObserver.notify = function() {
    this.emit('change');
  };

  /**
   * Mixin
   */
  emitter(PathObserver);
  emitter(PathObserver.prototype);

  /**
   * Get the value of the path.
   *
   * @return {Mixed}
   */
  PathObserver.prototype.get = function() {
    return this.value;
  };

  /**
   * Set the value of the keypath
   *
   * @return {PathObserver}
   */
  PathObserver.prototype.set = function(val) {
    var current = this.value;

    if (type(val) === 'object') {
      var changes = 0;
      for (var key in val) {
        var path = new PathObserver(this.path + '.' + key);
        path.once('change', function(){
          changes += 1;
        });
        path.set(val[key]);
      }
      if (changes > 0) {
        this.emit('change', this.value, current);
      }
      return;
    }

    // no change
    if(current === val) return this;

    this.value = val;
    this.emit('change', this.value, current);
    PathObserver.change();
    return this;
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
    this.off('change');
    delete cache[this.path];
  };

  return PathObserver;
};
});

_require.register("ripple", function (exports, module) {
var emitter = _require("component~emitter@1.1.2");
var observer = _require("ripplejs~path-observer@0.2.0");
var proto = _require("ripple/lib/proto.js");
var statics = _require("ripple/lib/static.js");
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

});

_require.register("ripple/lib/proto.js", function (exports, module) {
var render = _require("ripple/lib/bindings/index.js");
var Interpolator = _require("ripplejs~interpolate@0.4.5");

/**
 * Run expressions
 *
 * @type {Interpolator}
 */

var interpolator = new Interpolator();

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
    if (node === null) throw new Error('node does not exist');
  }
  return node;
}

/**
 * Set the state off the view. This will trigger
 * refreshes to the UI. If we were previously
 * watching the parent scope for changes to this
 * property, we will remove all of those watchers
 * and then bind them to our model instead.
 *
 * @param {Object} obj
 */

exports.set = function(path, value) {
  if (typeof path !== 'string') {
    for(var name in path) this.set(name, path[name]);
    return this;
  }
  this.observer(path).set(value);
  return this;
};

/**
 * Get some data
 *
 * @param {String} path
 */

exports.get = function(path) {
  return this.observer(path).get();
};

/**
 * Get all the properties used in a string
 *
 * @param {String} str
 *
 * @return {Array}
 */

exports.props = function(str) {
  return interpolator.props(str);
};

/**
 * Remove the element from the DOM
 */

exports.destroy = function() {
  this.emit('destroying');
  this.view.emit('destroying', this);
  this.remove();
  this.observer.dispose();
  this.off();
};

/**
 * Is the view mounted in the DOM
 *
 * @return {Boolean}
 */

exports.isMounted = function() {
  return this.el != null && this.el.parentNode != null;
};

/**
 * Render the view to an element. This should
 * only ever render the element once.
 */

exports.render = function() {
  return render({
    view: this,
    template: this.template,
    directives: this.view.directives,
    components: this.view.components
  });
};

/**
 * Mount the view onto a node
 *
 * @param {Element|String} node An element or CSS selector
 *
 * @return {View}
 */

exports.appendTo = function(node) {
  getNode(node).appendChild(this.el);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Replace an element in the DOM with this view
 *
 * @param {Element|String} node An element or CSS selector
 *
 * @return {View}
 */

exports.replace = function(node) {
  var target = getNode(node);
  target.parentNode.replaceChild(this.el, target);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Insert the view before a node
 *
 * @param {Element|String} node
 *
 * @return {View}
 */

exports.before = function(node) {
  var target = getNode(node);
  target.parentNode.insertBefore(this.el, target);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Insert the view after a node
 *
 * @param {Element|String} node
 *
 * @return {View}
 */

exports.after = function(node) {
  var target = getNode(node);
  target.parentNode.insertBefore(this.el, target.nextSibling);
  this.emit('mounted');
  this.view.emit('mounted', this);
  return this;
};

/**
 * Remove the view from the DOM
 *
 * @return {View}
 */

exports.remove = function() {
  if (this.isMounted() === false) return this;
  this.el.parentNode.removeChild(this.el);
  this.emit('unmounted');
  this.view.emit('unmounted', this);
  return this;
};

/**
 * Interpolate a string
 *
 * @param {String} str
 */

exports.interpolate = function(str) {
  var self = this;
  var data = {};
  var props = this.props(str);
  props.forEach(function(prop){
    data[prop] = self.get(prop);
  });
  return interpolator.value(str, {
    context: this,
    scope: data,
    filters: this.view.filters
  });
};

/**
 * Watch a property for changes
 *
 * @param {Strign} prop
 * @param {Function} callback
 */

exports.watch = function(prop, callback) {
  var self = this;
  if (Array.isArray(prop)) {
    return prop.forEach(function(name){
      self.watch(name, callback);
    });
  }
  if (typeof prop === 'function') {
    this.observer.on('change', prop);
  }
  else {
    this.observer(prop).on('change', callback);
  }
  return this;
};

/**
 * Stop watching a property
 *
 * @param {Strign} prop
 * @param {Function} callback
 */

exports.unwatch = function(prop, callback) {
  var self = this;
  if (Array.isArray(prop)) {
    return prop.forEach(function(name){
      self.unwatch(name, callback);
    });
  }
  if (typeof prop === 'function') {
    this.observer.off('change', prop);
  }
  else {
    this.observer(prop).off('change', callback);
  }
  return this;
};
});

_require.register("ripple/lib/static.js", function (exports, module) {
var type = _require("component~type@1.0.0");

/**
 * Add an attribute. This allows attributes to be created
 * and set with attributes. It also creates getters and
 * setters for the attributes on the view.
 *
 * @param {String} name
 * @param {Object} options
 *
 * @return {View}
 */

exports.attr = function(name, options) {
  options = options || {};
  this.attrs[name] = options;
  this.on('construct', function(view, attrs){
    if (attrs[name] == null) {
      attrs[name] = options.default;
    }
    if (options.required && attrs[name] == null) {
      throw new Error(name + ' is a required attribute');
    }
    if (options.type && attrs[name] != null && type(attrs[name]) !== options.type) {
      throw new Error(name + ' should be type "' + options.type + '"');
    }
  });
  Object.defineProperty(this.prototype, name, {
    set: function(value) {
      this.set(name, value);
    },
    get: function() {
      return this.get(name);
    }
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

exports.directive = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.directive(key, name[key]);
    }
    return;
  }
  this.directives[name] = fn;
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

exports.compose = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.compose(key, name[key]);
    }
    return;
  }
  this.components[name.toLowerCase()] = fn;
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

exports.filter = function(name, fn) {
  if (typeof name !== 'string') {
    for(var key in name) {
      this.filter(key, name[key]);
    }
    return;
  }
  this.filters[name] = fn;
  return this;
};

/**
 * Use a plugin
 *
 * @return {View}
 */

exports.use = function(fn, options) {
  fn(this, options);
  return this;
};

});

_require.register("ripple/lib/bindings/index.js", function (exports, module) {
var walk = _require("anthonyshort~dom-walk@0.1.0");
var each = _require("component~each@0.2.4");
var attrs = _require("anthonyshort~attributes@0.0.1");
var domify = _require("component~domify@1.2.2");
var TextBinding = _require("ripple/lib/bindings/text.js");
var AttrBinding = _require("ripple/lib/bindings/attribute.js");
var ChildBinding = _require("ripple/lib/bindings/child.js");
var Directive = _require("ripple/lib/bindings/directive.js");

module.exports = function(options) {
  var view = options.view;
  var el = domify(options.template);
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
      var View = options.components[node.nodeName.toLowerCase()];
      if(View) {
        activeBindings.push(new ChildBinding(view, node, View));
        return next();
      }
      each(attrs(node), function(attr){
        var binding = options.directives[attr];
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
    while (activeBindings.length) {
      activeBindings.shift().unbind();
    }
  });

  view.activeBindings = activeBindings;

  return fragment.firstChild;
};

});

_require.register("ripple/lib/bindings/directive.js", function (exports, module) {
var raf = _require("anthonyshort~raf-queue@0.2.0");

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
  if (typeof binding === 'function') {
    this.binding = { update: binding };
  }
  else {
    this.binding = binding;
  }
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.props(this.text);
  node.removeAttribute(attr);
  this.bind();
}

/**
 * Start watching the view for changes
 */

Directive.prototype.bind = function(){
  var view = this.view;
  var queue = this.queue;

  if (this.binding.bind) {
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

  if (this.job) {
    raf.cancel(this.job);
  }

  if (this.binding.unbind) {
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
  if (this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.update, this);
};

module.exports = Directive;
});

_require.register("ripple/lib/bindings/text.js", function (exports, module) {
var raf = _require("anthonyshort~raf-queue@0.2.0");

/**
 * Create a new text binding on a node
 *
 * @param {View} view
 * @param {Element} node
 */

function TextBinding(view, node) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = view.props(this.text);
  this.render = this.render.bind(this);
  if (this.props.length) {
    this.bind();
  }
}

/**
 * Bind changes in the expression to the view
 */

TextBinding.prototype.bind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

/**
 * Stop watching the expression for changes
 */

TextBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if (this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Render the expression value to the DOM
 */

TextBinding.prototype.render = function(){
  var node = this.node;
  var val = this.view.interpolate(this.text);

  if (val == null) {
    this.node.data = '';
  }
  else if (val instanceof Element) {
    node.parentNode.replaceChild(val, node);
    this.node = val;
  }
  else if (val.el instanceof Element) {
    node.parentNode.replaceChild(val.el, node);
    this.node = val.el;
  }
  else {
    var newNode = document.createTextNode(val);
    node.parentNode.replaceChild(newNode, node);
    this.node = newNode;
  }
};

/**
 * Schedule an update to the text element on the next frame.
 * This will only ever trigger one render no matter how
 * many times it is called
 */

TextBinding.prototype.update = function(){
  if (this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = TextBinding;

});

_require.register("ripple/lib/bindings/attribute.js", function (exports, module) {
var isBoolean = _require("anthonyshort~is-boolean-attribute@0.0.1");
var raf = _require("anthonyshort~raf-queue@0.2.0");

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
  this.props = view.props(this.text);
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

  if (this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Update the attribute
 */

AttrBinding.prototype.render = function(){
  var val = this.view.interpolate(this.text);
  if (val == null) val = '';
  if (isBoolean(this.attr) && !val) {
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
  if (this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = AttrBinding;
});

_require.register("ripple/lib/bindings/child.js", function (exports, module) {
var attrs = _require("anthonyshort~attributes@0.0.1");
var each = _require("component~each@0.2.4");
var unique = _require("yields~uniq@master");
var raf = _require("anthonyshort~raf-queue@0.2.0");

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
  this.child = new View(data, {
    owner: view
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
  var view = this.view;
  each(this.attrs, function(name, value){
    ret = ret.concat(view.props(value));
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

  if (this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Update the child view will updated values from
 * the parent. This will batch changes together
 * and only fire once per tick.
 */

ChildBinding.prototype.update = function(){
  if (this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.send, this);
};

module.exports = ChildBinding;

});

if (typeof exports == "object") {
  module.exports = _require("ripple");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return _require("ripple"); });
} else {
  this["ripple"] = _require("ripple");
}
})()
