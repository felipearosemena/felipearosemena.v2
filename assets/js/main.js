(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _pubsubJs = require('pubsub-js');

var PubSub = _interopRequireWildcard(_pubsubJs);

var _page = require('page');

var _page2 = _interopRequireDefault(_page);

var _utils = require('./modules/utils');

var _polyfills = require('./modules/polyfills');

var _video = require('./modules/video');

var _pageSections = require('./views/pageSections');

var _pageSections2 = _interopRequireDefault(_pageSections);

var _header = require('./views/header');

var _header2 = _interopRequireDefault(_header);

var _nav = require('./views/nav');

var _nav2 = _interopRequireDefault(_nav);

var _contact = require('./views/contact');

var _contact2 = _interopRequireDefault(_contact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Polyfills
(0, _polyfills.classList)();
(0, _polyfills.dataset)();
(0, _polyfills.vu)();

var sections = document.querySelectorAll('[data-scroll-section]');
var sectionViews = (0, _pageSections2.default)(sections);

(0, _utils.map)(sections, function (section) {

  var player = (0, _video.videoController)(section.querySelector('[data-video-player]'));
  var images = section.querySelectorAll('img');

  if (player) {
    section.player = player;
  }
});

function handleSection(eventName, sectionView) {
  var isInView = sectionView.isInView;
  var el = sectionView.el;
  var images = el.images;
  var player = el.player;

  if (player) {
    if (isInView) {
      if (!player.isLoaded) {
        player.load();
      }

      player.play();
    } else {
      player.pause();
    }
  }
}

var header = (0, _header2.default)(document.getElementById('site-header'));
var nav = (0, _nav2.default)(document.getElementById('navigation'));

PubSub.subscribe('section-view:enter', handleSection);
PubSub.subscribe('section-view:leave', handleSection);
PubSub.subscribe('header-view:open', function () {
  nav.init();
});

(0, _page2.default)('/contact', function () {
  var formFields = data.formFields.length ? data.formFields : [0];
  var contactForm = (0, _contact2.default)(document.getElementById('contact-form'), {
    fields: formFields
  });

  contactForm.render();
});

(0, _page2.default)({
  click: false,
  popstate: false
});

// page.show(location.pathname)

},{"./modules/polyfills":7,"./modules/utils":9,"./modules/video":10,"./views/contact":11,"./views/header":12,"./views/nav":13,"./views/pageSections":14,"page":3,"pubsub-js":17}],2:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],3:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */
  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    // use shadow dom when available
    var el = e.path ? e.path[0] : e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))

},{"_process":15,"path-to-regexp":4}],4:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

},{"isarray":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSelection = updateSelection;
exports.toggleNavigation = toggleNavigation;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.toggleActive = toggleActive;
/*
 * action types
 */

var UPDATE_SELECTION = exports.UPDATE_SELECTION = 'UPDATE_SELECTION';
var TOGGLE_NAVIGATION = exports.TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION';
var ADD_ITEM = exports.ADD_ITEM = 'ADD_ITEM';
var REMOVE_ITEM = exports.REMOVE_ITEM = 'REMOVE_ITEM';
var TOGGLE_ACTIVE = exports.TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';

function updateSelection(tax, value) {
  return {
    type: UPDATE_SELECTION,
    value: value,
    tax: tax
  };
}

function toggleNavigation(isOpen) {
  return {
    type: TOGGLE_NAVIGATION,
    isOpen: isOpen
  };
}

function addItem() {
  return {
    type: ADD_ITEM
  };
}

function removeItem() {
  return {
    type: REMOVE_ITEM
  };
}

function toggleActive(index) {
  return {
    type: TOGGLE_ACTIVE,
    index: index
  };
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = componentFactory;

var _diffhtml = require('diffhtml');

var diff = _interopRequireWildcard(_diffhtml);

var _utils = require('../modules/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function componentFactory(config) {

  var component = (0, _utils.extend)({}, config, {
    render: function render(state) {
      var markup = this.markup(state);
      diff.innerHTML(this.rootEl, markup);
    }
  });

  (0, _utils.map)(component.events, function (eventConfig) {

    var opts = (0, _utils.extend)({}, {
      type: '',
      selector: '',
      handler: function handler() {}
    }, eventConfig);

    var selector = '[' + opts.selector.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ']';

    (0, _utils.delegateEvent)(component.rootEl, opts.type, selector, opts.handler);
  });

  return component;
}

},{"../modules/utils":9,"diffhtml":16}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domParser = exports.dataset = exports.classList = exports.vu = undefined;

var _viewportUnitsBuggyfill = require("viewport-units-buggyfill");

var _viewportUnitsBuggyfill2 = _interopRequireDefault(_viewportUnitsBuggyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vu = exports.vu = _viewportUnitsBuggyfill2.default.init;

// console.log(vuBuggyfill.init)

var classList = exports.classList = function classList() {

  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }

  DOMTokenList.prototype = {
    add: function add(token) {
      if (this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains: function contains(token) {
      return this.el.className.indexOf(token) != -1;
    },
    item: function item(index) {
      return this[index] || null;
    },
    remove: function remove(token) {
      if (!this.contains(token)) return;
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString: function toString() {
      return join.call(this, ' ');
    },
    toggle: function toggle(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      });
    } else {
      obj.__defineGetter__(prop, getter);
    }
  }

  defineElementGetter(Element.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });
};

var dataset = exports.dataset = function dataset() {

  var forEach = [].forEach,
      regex = /^data-(.+)/,
      dashChar = /\-([a-z])/ig,
      el = document.createElement('div'),
      mutationSupported = false,
      match;

  function detectMutation() {
    mutationSupported = true;
    this.removeEventListener('DOMAttrModified', detectMutation, false);
  }

  function toCamelCase(s) {
    return s.replace(dashChar, function (m, l) {
      return l.toUpperCase();
    });
  }

  function updateDataset() {
    var dataset = {};
    forEach.call(this.attributes, function (attr) {
      if (match = attr.name.match(regex)) dataset[toCamelCase(match[1])] = attr.value;
    });
    return dataset;
  }

  // only add support if the browser doesn't support data-* natively
  if (el.dataset != undefined) return;

  el.addEventListener('DOMAttrModified', detectMutation, false);
  el.setAttribute('foo', 'bar');

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      });
    } else {
      obj.__defineGetter__(prop, getter);
    }
  }

  defineElementGetter(Element.prototype, 'dataset', mutationSupported ? function () {
    if (!this._datasetCache) {
      this._datasetCache = updateDataset.call(this);
    }
    return this._datasetCache;
  } : updateDataset);

  document.addEventListener('DOMAttrModified', function (event) {
    delete event.target._datasetCache;
  }, false);
};

var domParser = exports.domParser = function domParser() {

  /*
   * DOMParser HTML extension
   * 2012-09-04
   * 
   * By Eli Grey, http://eligrey.com
   * Public domain.
   * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
   */

  /*! @source https://gist.github.com/1129031 */
  /*global document, DOMParser*/

  (function (DOMParser) {
    "use strict";

    var DOMParser_proto = DOMParser.prototype,
        real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
      // WebKit returns null on unsupported types
      if (new DOMParser().parseFromString("", "text/html")) {
        // text/html parsing is natively supported
        return;
      }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function (markup, type) {
      if (/^\s*text\/html\s*(?:|$)/i.test(type)) {
        var doc = document.implementation.createHTMLDocument("");

        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
          doc.documentElement.innerHTML = markup;
        } else {
          doc.body.innerHTML = markup;
        }
        return doc;
      } else {
        return real_parseFromString.apply(this, arguments);
      }
    };
  })(window.DOMParser);
};

},{"viewport-units-buggyfill":28}],8:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contactReducer = exports.componentReducer = exports.headerReducer = exports.filterApp = undefined;

var _redux = require('redux');

var _utils = require('./utils');

var _actions = require('./actions');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function item(state, action) {
  switch (action.type) {
    case _actions.UPDATE_SELECTION:
      var item = state.item;
      var selection = state.selection;

      var isFiltered = item.taxonomies.reduce(function (bool, tax) {
        return bool ? bool : selection[tax.taxonomy_name] && selection[tax.taxonomy_name] !== tax.value ? true : false;
      }, false);

      return _extends({}, item, {
        isFiltered: isFiltered
      });

    default:
      return state;
  }
}

function filter(state, action) {
  switch (action.type) {
    case _actions.UPDATE_SELECTION:
      var filter = state.filter;
      var items = state.items;
      var selection = state.selection;

      var updatedOptions = filter.options.map(function (option) {

        var newSelection = _extends({}, selection, _defineProperty({}, filter.taxonomy_name, option.option_name));

        var filteredItems = items.map(function (i) {
          return item({ item: i, selection: newSelection }, action);
        }).map(function (item) {
          return item.isFiltered;
        });

        return _extends({}, option, {
          isValid: (0, _utils.inArray)(false, filteredItems)
        });
      });

      return _extends({}, filter, {
        options: updatedOptions
      });

    default:
      return state;
  }
}

function appliedFilters() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.UPDATE_SELECTION:
      var items = state.items;
      var filters = state.filters;

      var newSelection = _extends({}, state.selection, _defineProperty({}, action.tax, action.value));
      var filteredItems = items.map(function (i) {
        return item({ item: i, selection: newSelection }, action);
      });
      var updatedFilters = filters.map(function (f) {
        return filter({
          filter: f,
          items: filteredItems,
          selection: newSelection
        }, action);
      });

      return _extends({}, state, {
        items: filteredItems,
        selection: newSelection,
        filters: updatedFilters
      });

    default:
      return state;

  }
}

function header() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.TOGGLE_NAVIGATION:

      return _extends({}, state, {
        isOpen: !state.isOpen
      });

    default:
      return state;

  }
}

function componentReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_ITEM:

      state.items.push({
        title: 'New Item'
      });

      return _extends({}, state, {
        items: [].concat(_toConsumableArray(state.items))
      });

    case _actions.REMOVE_ITEM:

      state.items.splice(-1, 1);
      return _extends({}, state, {
        items: [].concat(_toConsumableArray(state.items))
      });

    case _actions.TOGGLE_ACTIVE:

      return _extends({}, state, {
        items: (0, _utils.map)(state.items, function (item, i) {

          if (i == action.index) {
            item.isActive = !item.isActive;
          }

          return item;
        })
      });

    default:
      return state;
  }
}

function contactReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    default:
      return _extends({}, state);
  }
}

var filterApp = (0, _redux.combineReducers)({
  appliedFilters: appliedFilters
});

var headerReducer = (0, _redux.combineReducers)({
  header: header, appliedFilters: appliedFilters
});

exports.filterApp = filterApp;
exports.headerReducer = headerReducer;
exports.componentReducer = componentReducer;
exports.contactReducer = contactReducer;

},{"./actions":5,"./utils":9,"redux":23}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inRange = inRange;
exports.inCanvas = inCanvas;
exports.randomInt = randomInt;
exports.randomNum = randomNum;
exports.coords = coords;
exports.inArray = inArray;
exports.vw = vw;
exports.vh = vh;
exports.recur = recur;
exports.selectorMatches = selectorMatches;
exports.createElement = createElement;
exports.delegateEvent = delegateEvent;
exports.map = map;
exports.mapJoin = mapJoin;
exports.filter = filter;
exports.reduce = reduce;
exports.extend = extend;
exports.equalsAny = equalsAny;
function inRange(val, range) {
  return val > range[0] && val < range[1];
}

function inCanvas(x, y, r, canvas) {
  var w = canvas.width,
      h = canvas.height;

  return inRange(x, [-r, w + r]) && inRange(y, [-r, h + r]);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function coords(x, y, canvas) {
  return {
    x: x * canvas.width / canvas.clientWidth,
    y: y * canvas.height / canvas.clientHeight
  };
}

function inArray(item, array) {
  return array.indexOf(item) > -1;
}

function vw() {
  var ratio = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  return window.innerWidth * ratio;
}

function vh() {
  var ratio = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  return window.innerHeight * ratio;
}

function recur(fn, seed) {
  var result = fn(seed);
  if (!!result) {
    recur(fn, result);
  }
}

function selectorMatches(el, selector) {
  var p = Element.prototype;
  var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return f.call(el, selector);
}

/**
 *
 * Create a new DOM element
 *
 * @param {string} tagname - Element tagname ('iframe', 'div')
 * @param {object} attributes - Object of attributes to be assigned to the object.
 * @returns {HTMLElement} The DOM element
 *
 */

function createElement(tagname) {
  var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var el = document.createElement(tagname);

  if (el.setAttribute) {
    map(attributes, function (k, v) {
      el.setAttribute(k, v);
    });

    map(data, function (k, v) {
      el.setAttribute('data-' + k, v);
    });
  }

  return el;
}

/**
 *
 *  Element.addEventListener with event delegation
 *
 *  @param {HTMLElement} el - DOM element to which to append the eventListener
 *  @param {string} eventName - Name of the DOM event to be attached.
 *  @param {string} delegate - Selector string to use for delegation
 *  @param {function} handler - Event handler function
 *
 * @returns {undefined}
 * 
 */

function delegateEvent(el, eventName, delegate, handler) {

  if (typeof handler !== 'function') return;
  if (el.addEventListener) {
    el.addEventListener(eventName, function (e) {
      if (selectorMatches(e.target, delegate)) {
        handler(e);
      }
    });
  }
}

function map(arrLike, cb) {

  if (!arrLike) {
    return false;
  }

  if (arrLike.length) {

    return Array.prototype.map.call(arrLike, cb);
  } else if (arrLike.length !== 'undefined' && arrLike.length == 0) {

    return [];
  } else if ((typeof arrLike === 'undefined' ? 'undefined' : _typeof(arrLike)) == 'object' && arrLike.constructor == Object) {

    var newArrLike = {};
    for (var k in arrLike) {
      if (arrLike.hasOwnProperty(k)) {
        newArrLike[k] = cb(k, arrLike[k]);
      }
    }
    return newArrLike;
  } else if (arrLike) {
    return Array.prototype.map.call([arrLike], cb);
  }
}

function mapJoin(arrLike, cb) {
  var separator = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  return map(arrLike, cb).join(separator);
}

function filter(arrLike, cb) {

  if (!arrLike) {
    return false;
  }

  if (arrLike.length) {

    return Array.prototype.filter.call(arrLike, cb);
  } else if (arrLike.length !== 'undefined' && arrLike.length == 0) {

    return [];
  } else if ((typeof arrLike === 'undefined' ? 'undefined' : _typeof(arrLike)) == 'object' && arrLike.constructor == Object) {

    // const newArrLike = {}
    // for (var k in arrLike) {
    //   if (arrLike.hasOwnProperty(k)) {
    //     newArrLike[k] = cb(k, arrLike[k])
    //   }
    // }
    // return newArrLike

  }
}

function reduce(arrLike, cb, seed) {

  if (!arrLike) {
    return false;
  }

  if (arrLike.length) {
    return Array.prototype.map.reduce(arrLike, cb);
  } else if (arrLike) {
    return Array.prototype.map.reduce([arrLike], cb);
  }
}

function extend() {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
    }
  }return arguments[0];
}

function equalsAny(item, arr) {
  var flag = false;

  arr.map(function (i) {
    if (i == item) {
      flag = true;
    }
  });

  return flag;
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoController = videoController;

var _utils = require('./utils');

function videoController() {
  var videoEl = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  if (!videoEl || !videoEl.play) {
    return false;
  }

  var srcs = (0, _utils.map)(videoEl.querySelectorAll('source'), function (sourceEl) {
    sourceEl.src = sourceEl.dataset.src;
  });

  return {
    el: videoEl,

    isLoaded: false,

    load: function load() {
      videoEl.load();
      this.isLoaded = true;
    },
    play: function play() {
      videoEl.play();
    },
    pause: function pause() {
      videoEl.pause();
    },
    togglePlay: function togglePlay() {
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    }
  };
} /** 
  *
  * Video
  *
  */

},{"./utils":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contactFormView;

var _pubsubJs = require('pubsub-js');

var PubSub = _interopRequireWildcard(_pubsubJs);

var _redux = require('redux');

var _actions = require('../modules/actions');

var _reducers = require('../modules/reducers');

var _component = require('../modules/component');

var _component2 = _interopRequireDefault(_component);

var _utils = require('../modules/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** 
*
* Contact
*
*/

function inputVars(field) {
  return (0, _utils.extend)({}, {
    label: false,
    id: field.name,
    options: [],
    placeholder: '',
    required: true
  }, field);
}

function selectView(rootEl, field) {
  var _inputVars = inputVars(field);

  var id = _inputVars.id;
  var label = _inputVars.label;
  var name = _inputVars.name;
  var options = _inputVars.options;
  var required = _inputVars.required;

  return (0, _component2.default)({
    rootEl: rootEl,
    markup: function markup(state) {

      return '\n        <div class="form__group form__group--select">\n\n          <select id="' + id + '" name="' + name + '" class="form__control">\n            ' + (0, _utils.map)(options, function (option) {
        return '<option value=' + option.value + '>' + option.label + '</option>';
      }) + '\n          </select>\n          <label for=' + id + '>' + label + '</label>\n        </div>\n      ';
    }
  });
}

function submitView(label) {
  return '\n    <div class="form__submit">\n      <button type="submit" class="btn btn--lg form__submit">' + label + '</button>\n    </div>\n  ';
}

function radioView(rootEl, field) {
  var _inputVars2 = inputVars(field);

  var id = _inputVars2.id;
  var label = _inputVars2.label;
  var name = _inputVars2.name;
  var options = _inputVars2.options;
  var required = _inputVars2.required;

  return (0, _component2.default)({
    rootEl: rootEl,
    markup: function markup(state) {
      return '\n        <div class="form__group form__group--radio">\n          <label>' + label + '</label>\n          ' + (0, _utils.map)(options, function (option, i) {
        return '\n              <input class="form__control" id=' + id + '-' + i + ' name=' + name + ' type="radio">\n              <label for=' + id + '-' + i + '><span>' + option.label + '</span></label>\n          ';
      }).join('') + '\n        </div>\n      ';
    }
  });
}

function inputView(rootEl, field) {
  var _inputVars3 = inputVars(field);

  var id = _inputVars3.id;
  var label = _inputVars3.label;
  var type = _inputVars3.type;
  var placeholder = _inputVars3.placeholder;
  var name = _inputVars3.name;
  var required = _inputVars3.required;

  return (0, _component2.default)({
    rootEl: rootEl,
    markup: function markup(state) {
      return '\n        <div class="form__group form__group--boxed">\n          <input id="' + id + '" name="' + name + '" type="' + type + '" placeholder="' + placeholder + '" class="form__control" >\n          <label for="' + id + '">' + label + '</label>\n        </div>\n      ';
    }
  });
}

function formControlView(rootEl, field) {

  if (!field.name) {
    return false;
  }

  if ((0, _utils.equalsAny)(field.type, ['text', 'email', 'url'])) {
    return inputView(rootEl, field);
  }

  switch (field.type) {
    case 'select':
      return selectView(rootEl, field);
      break;
    case 'radio':
      return radioView(rootEl, field);
      break;
  }
}

/** 
*
* TODO
*
* Move input vars declaaration to formControls instantiation step
*
*/
function contactFormView(rootEl, config) {

  var store = (0, _redux.createStore)(_reducers.contactReducer, {
    fields: config.fields
  });

  var formView = (0, _component2.default)({
    rootEl: rootEl,
    events: [],
    markup: function markup(state) {

      return (0, _utils.map)(state.fields, function (field) {
        return formControlView(rootEl, field);
      }).filter(function (field) {
        return field;
      }).map(function (fieldControl) {
        return fieldControl.markup();
      }).join('');
    }
  });

  var _render = function _render() {
    var _store$getState = store.getState();

    var fields = _store$getState.fields;

    formView.render({
      fields: fields
    });
  };

  return {
    render: function render() {
      store.subscribe(_render);
      _render();
    }
  };
}

},{"../modules/actions":5,"../modules/component":6,"../modules/reducers":8,"../modules/utils":9,"pubsub-js":17,"redux":23}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsubJs = require('pubsub-js');

var PubSub = _interopRequireWildcard(_pubsubJs);

var _utils = require('../modules/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var rootEl = document.body;
var rootClass = rootEl.classList;

var headerViewProto = {
  isOpen: false,

  init: function () {}(),

  open: function open() {
    rootClass.add('is-menu-active');
    PubSub.publish('header-view:open');
    this.isOpen = true;
  },
  close: function close() {
    rootClass.remove('is-menu-active');
    PubSub.publish('header-view:close');
    this.isOpen = false;
  },
  toggle: function toggle() {

    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }

    PubSub.publish('header-view:toggle');
  }
};

var headerView = function headerView(headerEl) {

  var view = Object.create(headerViewProto);
  var toggleEl = headerEl.querySelector('[data-nav-toggle]');

  if (!headerEl || !toggleEl) {
    return false;
  }

  toggleEl.addEventListener('click', function () {
    return view.toggle();
  });

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 27) {
      view.close();
    }
  });

  return view;
};

exports.default = headerView;

},{"../modules/utils":9,"pubsub-js":17}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsubJs = require('pubsub-js');

var PubSub = _interopRequireWildcard(_pubsubJs);

var _utils = require('../modules/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var navViewProto = {
  isOpen: false,

  init: function init() {
    this.setStyle();
  },
  setStyle: function setStyle() {
    var bgEls = this.el.querySelectorAll('[data-style]');
    (0, _utils.map)(bgEls, function (el) {
      if (el.dataset.style) {
        el.setAttribute('style', el.dataset.style);
      }
    });
  }
};

var navView = function navView(navEl) {

  var view = Object.create(navViewProto);

  if (!navEl) {
    return false;
  }

  view.el = navEl;

  return view;
};

exports.default = navView;

},{"../modules/utils":9,"pubsub-js":17}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /** 
                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                  * Page Sections
                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                  */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pageSections;

var _pubsubJs = require('pubsub-js');

var PubSub = _interopRequireWildcard(_pubsubJs);

var _utils = require('../modules/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var emitter = function emitter(el, eventName) {

  var event = false;

  if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) == 'object') {
    el.addEventListener(eventName, function (e) {
      PubSub.publish(eventName, e);
    });
  }
};

var em = emitter(window, 'scroll');

var pageSectionsProto = {};

var scrollSubscription = function scrollSubscription(callback) {
  return PubSub.subscribe('scroll', function (eventName, e) {
    if (typeof callback == 'function') {
      callback(e);
    }
  });
};

function requestAnimation(cb) {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(cb);
  }
}

function elementInViewport(top, height) {
  var _window = window;
  var scrollY = _window.scrollY;
  var innerHeight = _window.innerHeight;

  return scrollY - height < top && scrollY + innerHeight > top;
}

function getOffsetTop(el) {
  var top = 0;

  while (el = el.offsetParent) {
    if (!isNaN(el.offsetTop)) {
      top += el.offsetTop;
    }
  }

  return top;
}

function elementOffset(el) {

  var top = undefined,
      height = undefined,
      rect = undefined;
  var parent = el.parentElement;

  var update = function update() {
    // top = getOffsetTop(el),
    height = el.offsetHeight;
  };

  window.addEventListener('resize', update);
  window.addEventListener('load', update);

  update();

  return {
    height: height
  };
}

function sectionView(section, cb) {

  var x = 0;
  var y = window.scrollY * 0.2 + 'px';
  var offset = elementOffset(section);
  var classList = section.classList;

  var cf = {
    offset: 0
  };

  return {

    el: section,

    isInView: false,

    set: function set(k, v) {
      cf[k] = v;

      return this;
    },
    render: function render() {
      var _this = this;

      var rect = section.getBoundingClientRect();
      var pub = function pub(eventName) {
        PubSub.publish(eventName, _this);
      };

      this.isInView = 0 > rect.top - innerHeight + parseInt(cf.offset);

      if (this.isInView) {
        classList.remove('is-out');
        pub('section-view:enter');
      } else if (!this.isInView && !classList.contains('is-out')) {
        classList.add('is-out');
        pub('section-view:leave');
      }

      return this;
    }
  };
}

/** 
*
* Single Project View
*
*/

function pageSections(sectionEls) {

  var sectionViews = (0, _utils.map)(sectionEls, function (section) {
    return sectionView(section).set('offset', section.dataset.offset || 50);
  });

  var subscriptionID = scrollSubscription(function (e) {
    sectionViews.map(function (view) {
      return view.render();
    });
  });

  return sectionViews;
}

},{"../modules/utils":9,"pubsub-js":17}],15:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],16:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgrade = upgrade;
/**
 * Store all Custom Element definitions in this object. The tagName is the key.
 *
 * @public
 */
var components = exports.components = {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param nodeName - The HTML nodeName to use for the Custom Element
 * @param element - The element to upgrade
 * @param descriptor - The virtual node backing the element
 * @return {Boolean} successfully upgraded
 */
function upgrade(nodeName, element, descriptor) {
  // Value of the `is` attribute, if it exists.
  var isAttr = null;

  // Check for the `is` attribute. It has a known bug where it cannot be
  // applied dynamically.
  if (!components[nodeName] && Array.isArray(descriptor.attributes)) {
    descriptor.attributes.some(function (attr, idx) {
      if (attr.name === 'is') {
        isAttr = attr.value;
        return true;
      }
    });
  }

  // Hack around the `is` attribute being unable to be set dynamically.
  if (isAttr && components[isAttr]) {
    nodeName = isAttr;
  }

  var CustomElement = components[nodeName];

  if (!CustomElement) {
    return false;
  }

  if (CustomElement.extends && CustomElement.extends !== descriptor.nodeName) {
    return false;
  }

  // If no Custom Element was registered, bail early. Don't need to upgrade
  // if the element was already processed..
  if (typeof CustomElement === 'function' && element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  element.__proto__ = Object.create(CustomElement.prototype);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Is the element existing in the DOM?
  var inDOM = element.ownerDocument.contains(element);

  // If the Node is in the DOM, trigger attached callback.
  if (inDOM && CustomElement.prototype.attachedCallback) {
    element.attachedCallback();
  }

  // The upgrade was successful.
  return true;
}

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = get;

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _make3 = _dereq_('../element/make');

var _make4 = _interopRequireDefault(_make3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes in an element descriptor and resolve it to a uuid and DOM Node.
 *
 * @param descriptor - Element descriptor
 * @return {Object} containing the uuid and DOM node
 */
function get(descriptor) {
  var uuid = descriptor.uuid;
  var element = (0, _make4.default)(descriptor);

  return { uuid: uuid, element: element };
}

},{"../element/make":3,"../node/make":6}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _svg = _dereq_('../svg');

var svg = _interopRequireWildcard(_svg);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _custom = _dereq_('./custom');

var _entities = _dereq_('../util/entities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Takes in a virtual descriptor and creates an HTML element. Sets the element
 * into the cache.
 *
 * @param descriptor - Element descriptor
 * @return {Element} - The newly created DOM Node
 */
function make(descriptor) {
  var element = null;
  var isSvg = false;
  // Get the Custom Element constructor for a given element.
  var nodeName = descriptor.nodeName;
  var CustomElement = _custom.components[nodeName];

  // If the element descriptor was already created, reuse the existing element.
  if (_make2.default.nodes[descriptor.uuid]) {
    return _make2.default.nodes[descriptor.uuid];
  }

  if (descriptor.nodeName === '#text') {
    element = document.createTextNode(descriptor.nodeValue);
  } else {
    if (svg.elements.indexOf(descriptor.nodeName) > -1) {
      isSvg = true;
      element = document.createElementNS(svg.namespace, descriptor.nodeName);
    } else {
      element = document.createElement(descriptor.nodeName);
    }

    // Copy all the attributes from the descriptor into the newly created DOM
    // Node.
    if (descriptor.attributes && descriptor.attributes.length) {
      for (var i = 0; i < descriptor.attributes.length; i++) {
        var attribute = descriptor.attributes[i];
        element.setAttribute(attribute.name, attribute.value);
      }
    }

    // Append all the children into the element, making sure to run them
    // through this `make` function as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var _i = 0; _i < descriptor.childNodes.length; _i++) {
        element.appendChild(make(descriptor.childNodes[_i]));
      }
    }
  }

  // Upgrade the element after creating it, if necessary.
  (0, _custom.upgrade)(nodeName, element, descriptor);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement && CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _make2.default.nodes[descriptor.uuid] = element;

  return element;
}

},{"../node/make":6,"../svg":12,"../util/entities":14,"./custom":1}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var missingStackTrace = 'Browser doesn\'t support error stack traces.';

/**
 * Identifies an error with transitions.
 */

var TransitionStateError = exports.TransitionStateError = function (_Error) {
  _inherits(TransitionStateError, _Error);

  function TransitionStateError(message) {
    var _this;

    _classCallCheck(this, TransitionStateError);

    var error = (_this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransitionStateError).call(this)), _this);

    _this.message = message;
    _this.stack = error.stack || missingStackTrace;
    return _this;
  }

  return TransitionStateError;
}(Error);

/**
 * Identifies an error with registering an element.
 */


var DOMException = exports.DOMException = function (_Error2) {
  _inherits(DOMException, _Error2);

  function DOMException(message) {
    var _this2;

    _classCallCheck(this, DOMException);

    var error = (_this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DOMException).call(this)), _this2);

    _this2.message = 'Uncaught DOMException: ' + message;
    _this2.stack = error.stack || missingStackTrace;
    return _this2;
  }

  return DOMException;
}(Error);

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMException = exports.TransitionStateError = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _errors = _dereq_('./errors');

Object.defineProperty(exports, 'TransitionStateError', {
  enumerable: true,
  get: function get() {
    return _errors.TransitionStateError;
  }
});
Object.defineProperty(exports, 'DOMException', {
  enumerable: true,
  get: function get() {
    return _errors.DOMException;
  }
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.release = release;
exports.registerElement = registerElement;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

var _patch = _dereq_('./node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _release = _dereq_('./node/release');

var _release2 = _interopRequireDefault(_release);

var _make = _dereq_('./node/make');

var _make2 = _interopRequireDefault(_make);

var _tree = _dereq_('./node/tree');

var _transitions = _dereq_('./transitions');

var _custom = _dereq_('./element/custom');

var _memory = _dereq_('./util/memory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents.  Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */
function outerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = false;
  (0, _patch2.default)(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents.  This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */
function innerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = true;
  (0, _patch2.default)(element, markup, options);
}

/**
 * Used to diff two elements.  The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior.  By default it is
 * outerHTML.
 *
 * @param element
 * @param newElement
 * @param options={}
 */
function element(element, newElement) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _patch2.default)(element, newElement, options);
}

/**
 * Releases the worker and memory allocated to this element. Useful for
 * cleaning up components when removed in tests and applications.
 *
 * @param element
 */
function release(element) {
  (0, _release2.default)(element);
}

// Store a reference to the real `registerElement` method if it exists.
var realRegisterElement = document.registerElement;

/**
 * Register's a constructor with an element to provide lifecycle events.
 *
 * @param tagName
 * @param constructor
 */
function registerElement(tagName, constructor) {
  // Upgrade simple objects to inherit from HTMLElement and be usable in a real
  // implementation.
  var normalized = typeof constructor === 'function' ? constructor : null;

  // If this is not a valid constructor, create one.
  if (normalized === null) {
    normalized = function HTMLElement() {};
    normalized.__proto__ = constructor;
    normalized.prototype = constructor.prototype || constructor;
    normalized.prototype.__proto__ = HTMLElement.prototype;
  }

  // If the native web component specification is loaded, use that instead.
  if (realRegisterElement) {
    // Still store the reference internally, since we use it to circumvent the
    // `is` attribute bug.
    _custom.components[tagName] = normalized;
    return realRegisterElement.call(document, tagName, normalized);
  }

  // If the element has already been registered, raise an error.
  if (tagName in _custom.components) {
    throw new _errors.DOMException('\n      Failed to execute \'registerElement\' on \'Document\': Registration failed\n      for type \'' + tagName + '\'. A type with that name is already registered.\n    ');
  }

  // Assign the custom element reference to the constructor.
  _custom.components[tagName] = normalized;
}

/**
 * Adds a global transition listener.  With many elements this could be an
 * expensive operation, so try to limit the amount of listeners added if you're
 * concerned about performance.
 *
 * Since the callback triggers with various elements, most of which you
 * probably don't care about, you'll want to filter.  A good way of filtering
 * is to use the DOM `matches` method.  It's fairly well supported
 * (http://caniuse.com/#feat=matchesselector) and may suit many projects.  If
 * you need backwards compatibility, consider using jQuery's `is`.
 *
 * You can do fun, highly specific, filters:
 *
 * addTransitionState('attached', function(element) {
 *   // Fade in the main container after it's added.
 *   if (element.matches('body main.container')) {
 *     $(element).stop(true, true).fadeIn();
 *   }
 * });
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */
function addTransitionState(state, callback) {
  if (!state) {
    throw new _errors.TransitionStateError('Missing transition state name');
  }

  if (!callback) {
    throw new _errors.TransitionStateError('Missing transition state callback');
  }

  // Not a valid state name.
  if (Object.keys(_transitions.states).indexOf(state) === -1) {
    throw new _errors.TransitionStateError('Invalid state name: ' + state);
  }

  _transitions.states[state].push(callback);
}

/**
 * Removes a global transition listener.
 *
 * When invoked with no arguments, this method will remove all transition
 * callbacks.  When invoked with the name argument it will remove all
 * transition state callbacks matching the name, and so on for the callback.
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */
function removeTransitionState(state, callback) {
  if (!callback && state) {
    _transitions.states[state].length = 0;
  } else if (state && callback) {
    // Not a valid state name.
    if (Object.keys(_transitions.states).indexOf(state) === -1) {
      throw new _errors.TransitionStateError('Invalid state name ' + state);
    }

    var index = _transitions.states[state].indexOf(callback);
    _transitions.states[state].splice(index, 1);
  } else {
    for (var _state in _transitions.states) {
      _transitions.states[_state].length = 0;
    }
  }
}

/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */
function enableProllyfill() {
  // Exposes the `TransitionStateError` constructor globally so that developers
  // can instanceof check exception errors.
  Object.defineProperty(window, 'TransitionStateError', {
    configurable: true,

    value: _errors.TransitionStateError
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,

    value: function value(state, callback) {
      addTransitionState(state, callback);
    }
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,

    value: function value(state, callback) {
      removeTransitionState(state, callback);
    }
  });

  // Exposes the API into the Element, ShadowDOM, and DocumentFragment
  // constructors.
  [typeof Element !== 'undefined' ? Element : undefined, typeof HTMLElement !== 'undefined' ? HTMLElement : undefined, typeof ShadowRoot !== 'undefined' ? ShadowRoot : undefined, typeof DocumentFragment !== 'undefined' ? DocumentFragment : undefined].filter(Boolean).forEach(function (Ctor) {
    Object.defineProperty(Ctor.prototype, 'diffInnerHTML', {
      configurable: true,

      set: function set(newHTML) {
        innerHTML(this, newHTML);
      }
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'diffOuterHTML', {
      configurable: true,

      set: function set(newHTML) {
        outerHTML(this, newHTML);
      }
    });

    // Allows a developer to diff the current element with a new element.
    Object.defineProperty(Ctor.prototype, 'diffElement', {
      configurable: true,

      value: function value(newElement, options) {
        element(this, newElement, options);
      }
    });

    // Releases the retained memory and worker instance.
    Object.defineProperty(Ctor.prototype, 'diffRelease', {
      configurable: true,

      value: function value() {
        (0, _release2.default)(this);
      }
    });
  });

  // Polyfill in the `registerElement` method if it doesn't already exist. This
  // requires patching `createElement` as well to ensure that the proper proto
  // chain exists.
  Object.defineProperty(document, 'registerElement', {
    configurable: true,

    value: function value(tagName, component) {
      registerElement(tagName, component);
    }
  });

  // If HTMLElement is an object, rejigger it to work like a function so that
  // it can be extended. Specifically affects IE and Safari.
  Object.getOwnPropertyNames(window).filter(function (key) {
    return key.indexOf('HTML') === 0 && _typeof(window[key]) === 'object';
  }).forEach(function (key) {
    // Fall back to the Element constructor if the HTMLElement does not exist.
    var realElement = window[key];

    // If there is no `__proto__` available, add one to the prototype.
    if (!realElement.__proto__) {
      var copy = {
        set: function set(val) {
          val = Object.keys(val).length ? val : Object.getPrototypeOf(val);

          for (var _key in val) {
            if (val.hasOwnProperty(_key)) {
              this[_key] = val[_key];
            }
          }
        }
      };

      Object.defineProperty(realElement, '__proto__', copy);
      Object.defineProperty(realElement.prototype, '__proto__', copy);
    }

    var Element = new Function('return function ' + key + '() {};')();
    Element.prototype = Object.create(realElement.prototype);
    Element.__proto__ = realElement;

    // Ensure that the global Element matches the HTMLElement.
    window[key] = Element;
  });

  /**
   * Will automatically activate any components found in the page automatically
   * after calling `enableProllyfill`. This is useful to simulate a real-world
   * usage of Custom Elements.
   */
  var activateComponents = function activateComponents() {
    var documentElement = document.documentElement;
    var bufferSet = false;

    // If this element is already rendering, add this new render request into
    // the buffer queue. Check and see if any element is currently rendering,
    // can only do one at a time.
    _tree.TreeCache.forEach(function iterateTreeCache(elementMeta, element) {
      if (elementMeta.isRendering) {
        bufferSet = true;
      }
    });

    // Short circuit the rest of this render.
    if (bufferSet) {
      // Remove the load event listener, since it's complete.
      return window.removeEventListener('load', activateComponents);
    }

    var descriptor = (0, _make2.default)(documentElement);

    // After the initial render, clean up the resources, no point in lingering.
    documentElement.addEventListener('renderComplete', function render() {
      var elementMeta = _tree.TreeCache.get(documentElement) || {};

      // Release resources allocated to the element.
      if (!elementMeta.isRendering) {

        // Unprotect after the activation is complete.
        (0, _memory.unprotectElement)(descriptor, _make2.default);
        documentElement.diffRelease(documentElement);
      }

      // Remove this event listener.
      documentElement.removeEventListener('renderComplete', render);
    });

    // Protect the documentElement before applying the changes.
    (0, _memory.protectElement)(descriptor);

    // Diff the entire document on activation of the prollyfill.
    documentElement.diffOuterHTML = documentElement.outerHTML;

    // Remove the load event listener, since it's complete.
    window.removeEventListener('load', activateComponents);
  };

  // If the document has already loaded, immediately activate the components.
  if (document.readyState === 'complete') {
    activateComponents();
  } else {
    // This section will automatically parse out your entire page to ensure all
    // custom elements are hooked into.
    window.addEventListener('load', activateComponents);
  }
}

},{"./element/custom":1,"./errors":4,"./node/make":6,"./node/patch":7,"./node/release":8,"./node/tree":10,"./transitions":13,"./util/memory":15}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _pools2 = _dereq_('../util/pools');

var _custom = _dereq_('../element/custom');

var pools = _pools2.pools;
var empty = {};

// Cache created nodes inside this object.
make.nodes = {};

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
function make(node) {
  var nodeType = node.nodeType;

  // Whitelist: Elements, TextNodes, and Shadow Root.
  if (nodeType !== 1 && nodeType !== 3 && nodeType !== 11) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = pools.elementObject.get();

  // Associate this newly allocated uuid with this Node.
  make.nodes[entry.uuid] = node;

  // Set a lowercased (normalized) version of the element's nodeName.
  entry.nodeName = node.nodeName.toLowerCase();

  // If the element is a text node set the nodeValue.
  if (nodeType === 3) {
    entry.nodeValue = node.textContent;
  } else {
    entry.nodeValue = '';
  }

  entry.childNodes.length = 0;
  entry.attributes.length = 0;

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      for (var i = 0; i < attributesLength; i++) {
        var attr = pools.attributeObject.get();

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes ? node.childNodes : [];
  var childNodesLength = childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (nodeType !== 3 && childNodesLength) {
    for (var _i = 0; _i < childNodesLength; _i++) {
      var newNode = make(childNodes[_i]);

      if (newNode) {
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  // Prune out whitespace from between HTML tags in markup.
  if (entry.nodeName === 'html') {
    entry.childNodes = entry.childNodes.filter(function (el) {
      return el.nodeName === 'head' || el.nodeName === 'body';
    });
  }

  // Reset the prototype chain for this element. Upgrade will return `true`
  // if the element was upgraded for the first time. This is useful so we
  // don't end up in a loop when working with the same element.
  (0, _custom.upgrade)(entry.nodeName, node, entry, true);

  return entry;
}

},{"../element/custom":1,"../util/pools":17}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

var _create = _dereq_('../worker/create');

var _memory = _dereq_('../util/memory');

var _parser = _dereq_('../util/parser');

var _render = _dereq_('../util/render');

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _process = _dereq_('../patches/process');

var _process2 = _interopRequireDefault(_process);

var _sync = _dereq_('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _tree = _dereq_('./tree');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patchNode(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = _tree.TreeCache.get(element) || {};

  // Last options used.
  elementMeta.options = options;

  // Always ensure the most up-to-date meta object is stored.
  _tree.TreeCache.set(element, elementMeta);

  var bufferSet = false;
  var isInner = options.inner;
  var previousMarkup = elementMeta.previousMarkup;

  // If this element is already rendering, add this new render request into the
  // buffer queue. Check and see if any element is currently rendering, can
  // only do one at a time.
  _tree.TreeCache.forEach(function iterateTreeCache(_elementMeta, _element) {
    if (_elementMeta.isRendering) {
      elementMeta.renderBuffer = { element: element, newHTML: newHTML, options: options };
      bufferSet = true;
    }
  });

  // Short circuit the rest of this render.
  if (bufferSet) {
    return;
  }

  var sameInnerHTML = isInner ? previousMarkup === element.innerHTML : true;
  var sameOuterHTML = !isInner ? previousMarkup === element.outerHTML : true;
  var sameTextContent = elementMeta._textContent === element.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing.
  if (elementMeta.newHTML === newHTML) {
    return;
  }

  // Associate the last markup rendered with this element.
  elementMeta.newHTML = newHTML;

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && _create.hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || (0, _create.create)();
  }

  var rebuildTree = function rebuildTree() {
    var oldTree = elementMeta.oldTree;

    if (oldTree) {
      (0, _memory.unprotectElement)(oldTree, _make2.default);
      (0, _memory.cleanMemory)(_make2.default);
    }

    elementMeta.oldTree = (0, _memory.protectElement)((0, _make2.default)(element));
    elementMeta.updateWorkerTree = true;
  };

  // The last render was done via Worker, but now we're rendering in the UI
  // thread. This is very uncommon, but we need to ensure trees stay in sync.
  if (elementMeta.renderedViaWorker === true && !options.enableWorker) {
    rebuildTree();
  }

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _create.hasWorker && worker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;
    elementMeta.renderedViaWorker = true;
    elementMeta.workerCache = elementMeta.workerCache || [];

    // Attach all properties here to transport.
    var transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateWorkerTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateWorkerTree = false;
    }

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function onmessage(ev) {
      var wrapRender = function wrapRender(cb) {
        return function () {
          elementMeta.hasWorkerRendered = true;
          cb();
        };
      };
      var invokeRender = wrapRender((0, _render.completeRender)(element, elementMeta));

      // Wait until all promises have resolved, before finishing up the patch
      // cycle.  Process the data immediately and wait until all transition
      // callbacks have completed.
      var promises = (0, _process2.default)(element, ev.data.patches);

      // Operate synchronously unless opted into a Promise-chain.
      if (promises.length) {
        Promise.all(promises).then(invokeRender, function (ex) {
          return console.log(ex);
        });
      } else {
        invokeRender();
      }
    };

    if (typeof newHTML !== 'string') {
      transferObject.newTree = (0, _make2.default)(newHTML);

      // Transfer this buffer to the worker, which will take over and process
      // the markup.
      worker.postMessage(transferObject);

      return;
    }

    // Let the browser copy the HTML into the worker, converting to a
    // transferable object is too expensive.
    transferObject.newHTML = newHTML;

    // Add properties to send to worker.
    transferObject.isInner = options.inner;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject);
  } else {
    if (elementMeta.renderedViaWorker && elementMeta.oldTree) {
      rebuildTree();
    }

    if (elementMeta.workerCache) {
      elementMeta.workerCache.forEach(function (x) {
        return (0, _memory.unprotectElement)(x, _make2.default);
      });
      delete elementMeta.workerCache;
    }

    // We're rendering in the UI thread.
    elementMeta.isRendering = true;

    // Whenever we render in the UI-thread, ensure that the Worker gets a
    // refreshed copy of the `oldTree`.
    elementMeta.updateWorkerTree = true;

    var newTree = null;

    if (typeof newHTML === 'string') {
      newTree = (0, _parser.parseHTML)(newHTML, options.inner);
    } else {
      newTree = (0, _make2.default)(newHTML);
    }

    if (options.inner) {
      var childNodes = Array.isArray(newTree) ? newTree : [newTree];

      newTree = {
        childNodes: childNodes,
        attributes: elementMeta.oldTree.attributes,
        uuid: elementMeta.oldTree.uuid,
        nodeName: elementMeta.oldTree.nodeName,
        nodeValue: elementMeta.oldTree.nodeValue
      };
    }

    // Synchronize the tree.
    var patches = (0, _sync2.default)(elementMeta.oldTree, newTree);
    var invokeRender = (0, _render.completeRender)(element, elementMeta);

    // Process the data immediately and wait until all transition callbacks
    // have completed.
    var promises = (0, _process2.default)(element, patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (promises.length) {
      Promise.all(promises).then(invokeRender, function (ex) {
        return console.log(ex);
      });
    } else {
      invokeRender();
    }
  }
}

},{"../patches/process":11,"../util/memory":15,"../util/parser":16,"../util/pools":17,"../util/render":18,"../worker/create":20,"./make":6,"./sync":9,"./tree":10}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = releaseNode;

var _tree = _dereq_('./tree');

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _memory = _dereq_('../util/memory');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */
function releaseNode(element) {
  var elementMeta = _tree.TreeCache.get(element);

  // Do not remove an element that is in process of rendering. User intentions
  // come first, so if we are cleaning up an element being used by another part
  // of the code, keep it alive.
  if (elementMeta) {
    // If there is a worker associated with this element, then kill it.
    if (elementMeta.worker) {
      elementMeta.worker.terminate();
      delete elementMeta.worker;
    }

    // If there was a tree set up, recycle the memory allocated for it.
    if (elementMeta.oldTree) {
      (0, _memory.unprotectElement)(elementMeta.oldTree, _make2.default);
    }

    if (elementMeta.workerCache) {
      elementMeta.workerCache.forEach(function (x) {
        return (0, _memory.unprotectElement)(x, _make2.default);
      });
      delete elementMeta.workerCache;
    }

    // Remove this element's meta object from the cache.
    _tree.TreeCache.delete(element);
  }

  (0, _memory.cleanMemory)(_make2.default);
}

},{"../util/memory":15,"../util/pools":17,"./make":6,"./tree":10}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANGE_TEXT = exports.MODIFY_ATTRIBUTE = exports.MODIFY_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ELEMENT_CHILDREN = undefined;
exports.default = sync;

var _pools2 = _dereq_('../util/pools');

var pools = _pools2.pools;

var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

// Patch actions.
var REMOVE_ELEMENT_CHILDREN = exports.REMOVE_ELEMENT_CHILDREN = -2;
var REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = -1;
var REPLACE_ENTIRE_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = 0;
var MODIFY_ELEMENT = exports.MODIFY_ELEMENT = 1;
var MODIFY_ATTRIBUTE = exports.MODIFY_ATTRIBUTE = 2;
var CHANGE_TEXT = exports.CHANGE_TEXT = 3;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 * @param patches - optional
 */
function sync(oldTree, newTree, patches) {
  patches = patches || [];

  if (!Array.isArray(patches)) {
    throw new Error('Missing Array to sync patches into');
  }

  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  var oldNodeValue = oldTree.nodeValue;
  var oldChildNodes = oldTree.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  var oldElement = oldTree.uuid;
  var oldNodeName = oldTree.nodeName;
  var oldIsTextNode = oldNodeName === '#text';

  if (!newTree) {
    var removed = [oldTree].concat(oldChildNodes.splice(0, oldChildNodesLength));

    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: removed
    });

    return patches;
  }

  var nodeValue = newTree.nodeValue;
  var childNodes = newTree.childNodes;
  var childNodesLength = childNodes ? childNodes.length : 0;
  var newElement = newTree.uuid;
  var nodeName = newTree.nodeName;
  var newIsTextNode = nodeName === '#text';

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
    patches.push({
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree
    });

    return patches;
  }

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== nodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newTree.nodeValue
    });

    oldTree.nodeValue = newTree.nodeValue;

    return;
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    var fragment = [];

    for (var i = oldChildNodesLength; i < childNodesLength; i++) {
      // Internally add to the tree.
      oldChildNodes.push(childNodes[i]);

      // Add to the document fragment.
      fragment.push(childNodes[i]);
    }

    oldChildNodesLength = oldChildNodes.length;

    // Assign the fragment to the patches to be injected.
    patches.push({
      __do__: MODIFY_ELEMENT,
      element: oldTree,
      fragment: fragment
    });
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // For now just splice out the end items.
    var diff = oldChildNodesLength - childNodesLength;
    var toRemove = oldChildNodes.splice(oldChildNodesLength - diff, diff);

    oldChildNodesLength = oldChildNodes.length;

    if (oldChildNodesLength === 0 && childNodesLength === 0) {
      patches.push({
        __do__: REMOVE_ELEMENT_CHILDREN,
        element: oldTree,
        toRemove: toRemove
      });
    } else {
      for (var _i = 0; _i < toRemove.length; _i++) {
        // Remove the element, this happens before the splice so that we
        // still have access to the element.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: toRemove[_i]
        });
      }
    }
  }

  // Replace elements if they are different.
  if (oldChildNodesLength >= childNodesLength) {
    for (var _i2 = 0; _i2 < childNodesLength; _i2++) {
      if (oldChildNodes[_i2].nodeName !== childNodes[_i2].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: oldChildNodes[_i2],
          new: childNodes[_i2]
        });

        // Replace the internal tree's point of view of this element.
        oldChildNodes[_i2] = childNodes[_i2];
      } else {
        sync(oldChildNodes[_i2], childNodes[_i2], patches);
      }
    }
  }

  // Synchronize attributes
  var attributes = newTree.attributes;

  if (attributes) {
    var oldLength = oldTree.attributes.length;
    var newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(attributes, oldLength);

      for (var _i3 = 0; _i3 < toAdd.length; _i3++) {
        var change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toAdd[_i3].name,
          value: toAdd[_i3].value
        };

        var attr = pools.attributeObject.get();
        attr.name = toAdd[_i3].name;
        attr.value = toAdd[_i3].value;

        pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes.push(attr);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var _toRemove = slice.call(oldTree.attributes, newLength);

      for (var _i4 = 0; _i4 < _toRemove.length; _i4++) {
        var _change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: _toRemove[_i4].name,
          value: undefined
        };

        // Remove the attribute from the virtual node.
        var _removed = oldTree.attributes.splice(_i4, 1);

        for (var _i5 = 0; _i5 < _removed.length; _i5++) {
          pools.attributeObject.unprotect(_removed[_i5]);
        }

        // Add the change to the series of patches.
        patches.push(_change);
      }
    }

    // Check for modifications.
    var toModify = attributes;

    for (var _i6 = 0; _i6 < toModify.length; _i6++) {
      var oldAttrValue = oldTree.attributes[_i6] && oldTree.attributes[_i6].value;
      var newAttrValue = attributes[_i6] && attributes[_i6].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        var _change2 = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toModify[_i6].name,
          value: toModify[_i6].value
        };

        // Replace the attribute in the virtual node.
        var _attr = oldTree.attributes[_i6];
        _attr.name = toModify[_i6].name;
        _attr.value = toModify[_i6].value;

        // Add the change to the series of patches.
        patches.push(_change2);
      }
    }
  }

  return patches;
}

},{"../util/pools":17}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Cache prebuilt trees and lookup by element.
var TreeCache = exports.TreeCache = new Map();

},{}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = process;

var _transitions = _dereq_('../transitions');

var transition = _interopRequireWildcard(_transitions);

var _pools = _dereq_('../util/pools');

var _get = _dereq_('../element/get');

var _get2 = _interopRequireDefault(_get);

var _custom = _dereq_('../element/custom');

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _sync = _dereq_('../node/sync');

var sync = _interopRequireWildcard(_sync);

var _tree = _dereq_('../node/tree');

var _memory = _dereq_('../util/memory');

var _entities = _dereq_('../util/entities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var blockTextElements = ['script', 'noscript', 'style', 'pre', 'template'];

/**
 * Processes an array of patches.
 *
 * @param element - Element to process patchsets on.
 * @param e - Object that contains patches.
 */
function process(element, patches) {
  var elementMeta = _tree.TreeCache.get(element);
  var promises = [];
  var triggerTransition = transition.buildTrigger(promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attached = function attached(descriptor, fragment, parentNode) {
    (0, _memory.protectElement)(descriptor);

    if (elementMeta.workerCache) {
      elementMeta.workerCache.push(descriptor);
    }

    var el = (0, _get2.default)(descriptor).element;

    // If the element added was a DOM text node or SVG text element, trigger
    // the textChanged transition.
    if (descriptor.nodeName === '#text') {
      var textPromises = transition.makePromises('textChanged', [el], null, descriptor.nodeValue);

      el.textContent = (0, _entities.decodeEntities)(descriptor.nodeValue);

      if (parentNode) {
        var nodeName = parentNode.nodeName.toLowerCase();

        if (blockTextElements.indexOf(nodeName) > -1) {
          parentNode.nodeValue = (0, _entities.decodeEntities)(descriptor.nodeValue);
        }
      }

      triggerTransition('textChanged', textPromises, function (promises) {});
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      descriptor.attributes.forEach(function (attr) {
        var attrChangePromises = transition.makePromises('attributeChanged', [el], attr.name, null, attr.value);

        triggerTransition('attributeChanged', attrChangePromises, function (promises) {});
      });
    }

    // Call all `childNodes` attached callbacks as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      descriptor.childNodes.forEach(function (x) {
        return attached(x, null, el);
      });
    }

    // If a document fragment was specified, append the real element into it.
    if (fragment) {
      fragment.appendChild(el);
    }

    return el;
  };

  // Loop through all the patches and apply them.

  var _loop = function _loop(i) {
    var patch = patches[i];
    var newEl = void 0,
        oldEl = void 0,
        el = void 0;

    if (patch.element) {
      var result = (0, _get2.default)(patch.element);
      el = result.element;
    }

    if (patch.old) {
      var _result = (0, _get2.default)(patch.old);
      oldEl = _result.element;
    }

    if (patch.new) {
      var _result2 = (0, _get2.default)(patch.new);
      newEl = _result2.element;
    }

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      var childNodes = el.childNodes;
      var detachPromises = transition.makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, function (promises) {
        patch.toRemove.forEach(function (x) {
          return (0, _memory.unprotectElement)(x, _make2.default);
        });
        el.innerHTML = '';
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
        var _detachPromises = transition.makePromises('detached', [el]);

        if (el.parentNode) {
          triggerTransition('detached', _detachPromises, function (promises) {
            el.parentNode.removeChild(el);
            patch.toRemove.forEach(function (x) {
              return (0, _memory.unprotectElement)(x, _make2.default);
            });
          });
        } else {
          patch.toRemove.forEach(function (x) {
            return (0, _memory.unprotectElement)(x, _make2.default);
          });
        }
      }

      // Replace the entire Node.
      else if (patch.__do__ === sync.REPLACE_ENTIRE_ELEMENT) {
          (function () {
            var allPromises = [];
            var attachedPromises = transition.makePromises('attached', [newEl]);
            var detachedPromises = transition.makePromises('detached', [oldEl]);
            var replacedPromises = transition.makePromises('replaced', [oldEl], newEl);

            // Add all the transition state promises into the main array, we'll use
            // them all to decide when to alter the DOM.
            triggerTransition('detached', detachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            triggerTransition('attached', attachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
              attached(patch.new, null, newEl);
            });

            triggerTransition('replaced', replacedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            (0, _memory.unprotectElement)(patch.old, _make2.default);

            // Reset the tree cache.
            _tree.TreeCache.set(newEl, {
              oldTree: patch.new,
              element: newEl
            });

            // Once all the promises have completed, invoke the action, if no
            // promises were added, this will be a synchronous operation.
            if (allPromises.length) {
              Promise.all(allPromises).then(function replaceEntireElement() {
                if (!oldEl.parentNode) {
                  (0, _memory.unprotectElement)(patch.new, _make2.default);

                  throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                }

                oldEl.parentNode.replaceChild(newEl, oldEl);
              }, function (ex) {
                return console.log(ex);
              });
            } else {
              if (!oldEl.parentNode) {
                (0, _memory.unprotectElement)(patch.new, _make2.default);

                throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
              }

              oldEl.parentNode.replaceChild(newEl, oldEl);
            }
          })();
        }

        // Node manip.
        else if (patch.__do__ === sync.MODIFY_ELEMENT) {
            // Add.
            if (el && patch.fragment && !oldEl) {
              (function () {
                var fragment = document.createDocumentFragment();

                // Loop over every element to be added and process the descriptor
                // into the real element and append into the DOM fragment.
                toAttach = patch.fragment.map(function (el) {
                  return attached(el, fragment, el);
                });

                // Turn elements into childNodes of the patch element.

                el.appendChild(fragment);

                // Trigger transitions.
                var makeAttached = transition.makePromises('attached', toAttach);
                triggerTransition('attached', makeAttached);
              })();
            }

            // Remove.
            else if (oldEl && !newEl) {
                if (!oldEl.parentNode) {
                  (0, _memory.unprotectElement)(patch.old, _make2.default);

                  throw new Error('Can\'t remove without parent, is this the ' + 'document root?');
                }

                var makeDetached = transition.makePromises('detached', [oldEl]);

                triggerTransition('detached', makeDetached, function () {
                  // And then empty out the entire contents.
                  oldEl.innerHTML = '';

                  if (oldEl.parentNode) {
                    oldEl.parentNode.removeChild(oldEl);
                  }

                  (0, _memory.unprotectElement)(patch.old, _make2.default);
                });
              }

              // Replace.
              else if (oldEl && newEl) {
                  (function () {
                    if (!oldEl.parentNode) {
                      (0, _memory.unprotectElement)(patch.old, _make2.default);
                      (0, _memory.unprotectElement)(patch.new, _make2.default);

                      throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                    }

                    // Append the element first, before doing the replacement.
                    if (oldEl.nextSibling) {
                      oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
                    } else {
                      oldEl.parentNode.appendChild(newEl);
                    }

                    // Removed state for transitions API.
                    var allPromises = [];
                    var attachPromises = transition.makePromises('attached', [newEl]);
                    var detachPromises = transition.makePromises('detached', [oldEl]);
                    var replacePromises = transition.makePromises('replaced', [oldEl], newEl);

                    triggerTransition('detached', detachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    triggerTransition('attached', attachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                      attached(patch.new);
                    });

                    triggerTransition('replaced', replacePromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    // Once all the promises have completed, invoke the action, if no
                    // promises were added, this will be a synchronous operation.
                    if (allPromises.length) {
                      Promise.all(allPromises).then(function replaceElement() {
                        oldEl.parentNode.replaceChild(newEl, oldEl);
                        (0, _memory.unprotectElement)(patch.old, _make2.default);

                        (0, _memory.protectElement)(patch.new);

                        if (elementMeta.workerCache) {
                          elementMeta.workerCache.push(patch.new);
                        }
                      }, function (ex) {
                        return console.log(ex);
                      });
                    } else {
                      if (!oldEl.parentNode) {
                        (0, _memory.unprotectElement)(patch.old, _make2.default);
                        (0, _memory.unprotectElement)(patch.new, _make2.default);

                        throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                      }

                      oldEl.parentNode.replaceChild(newEl, oldEl);
                      (0, _memory.unprotectElement)(patch.old, _make2.default);
                      (0, _memory.protectElement)(patch.new);

                      if (elementMeta.workerCache) {
                        elementMeta.workerCache.push(patch.new);
                      }
                    }
                  })();
                }
          }

          // Attribute manipulation.
          else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
              var attrChangePromises = transition.makePromises('attributeChanged', [el], patch.name, el.getAttribute(patch.name), patch.value);

              triggerTransition('attributeChanged', attrChangePromises, function (promises) {
                // Remove.
                if (patch.value === undefined) {
                  el.removeAttribute(patch.name);

                  if (patch.name === 'checked') {
                    el.checked = false;
                  }
                }
                // Change.
                else {
                    el.setAttribute(patch.name, patch.value);

                    // If an `is` attribute was set, we should upgrade it.
                    (0, _custom.upgrade)(patch.element.nodeName, el, patch.element);

                    // Support live updating of the value attribute.
                    if (patch.name === 'value' || patch.name === 'checked') {
                      el[patch.name] = patch.value;
                    }
                  }
              });
            }

            // Text node manipulation.
            else if (patch.__do__ === sync.CHANGE_TEXT) {
                var textChangePromises = transition.makePromises('textChanged', [el], el.nodeValue, patch.value);

                triggerTransition('textChanged', textChangePromises, function (promises) {
                  patch.element.nodeValue = (0, _entities.decodeEntities)(patch.value);
                  el.nodeValue = patch.element.nodeValue;

                  if (el.parentNode) {
                    var nodeName = el.parentNode.nodeName.toLowerCase();

                    if (blockTextElements.indexOf(nodeName) > -1) {
                      el.parentNode.nodeValue = patch.element.nodeValue;
                    }
                  }
                });
              }
  };

  for (var i = 0; i < patches.length; i++) {
    var toAttach;

    _loop(i);
  }

  // Return the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  return promises.filter(Boolean);
}

},{"../element/custom":1,"../element/get":2,"../node/make":6,"../node/sync":9,"../node/tree":10,"../transitions":13,"../util/entities":14,"../util/memory":15,"../util/pools":17}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// List of SVG elements.
var elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

// Namespace.
var namespace = exports.namespace = 'http://www.w3.org/2000/svg';

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.states = undefined;
exports.buildTrigger = buildTrigger;
exports.makePromises = makePromises;

var _custom = _dereq_('./element/custom');

var _make = _dereq_('./node/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slice = Array.prototype.slice;
var forEach = Array.prototype.forEach;
var concat = Array.prototype.concat;
var empty = { prototype: {} };

/**
 * Contains arrays to store transition callbacks.
 *
 * attached
 * --------
 *
 * For when elements come into the DOM. The callback triggers immediately after
 * the element enters the DOM. It is called with the element as the only
 * argument.
 *
 * detached
 * --------
 *
 * For when elements are removed from the DOM. The callback triggers just
 * before the element leaves the DOM. It is called with the element as the only
 * argument.
 *
 * replaced
 * --------
 *
 * For when elements are replaced in the DOM. The callback triggers after the
 * new element enters the DOM, and before the old element leaves. It is called
 * with old and new elements as arguments, in that order.
 *
 * attributeChanged
 * ----------------
 *
 * Triggered when an element's attribute has changed. The callback triggers
 * after the attribute has changed in the DOM. It is called with the element,
 * the attribute name, old value, and current value.
 *
 * textChanged
 * -----------
 *
 * Triggered when an element's `textContent` chnages. The callback triggers
 * after the textContent has changed in the DOM. It is called with the element,
 * the old value, and current value.
 */
var states = exports.states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: []
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
var fnSignatures = {
  attached: {
    mapFn: function mapFn(el) {
      return function (cb) {
        return cb(el);
      };
    },
    customElementsFn: function customElementsFn(el) {
      return function (cb) {
        return cb.call(el);
      };
    }
  },

  detached: {
    mapFn: function mapFn(el) {
      return function (cb) {
        return cb(el);
      };
    },
    customElementsFn: function customElementsFn(el) {
      return function (cb) {
        return cb.call(el);
      };
    }
  },

  replaced: {
    mapFn: function mapFn(oldEl, newEl) {
      return function (cb) {
        return cb(oldEl, newEl);
      };
    }
  },

  attributeChanged: {
    mapFn: function mapFn(el, name, oldVal, newVal) {
      return function (cb) {
        return cb(el, name, oldVal, newVal);
      };
    },
    customElementsFn: function customElementsFn(el, name, oldVal, newVal) {
      return function (cb) {
        return cb.call(el, name, oldVal, newVal);
      };
    }
  },

  textChanged: {
    mapFn: function mapFn(el, oldVal, newVal) {
      return function (cb) {
        return cb(el, oldVal, newVal);
      };
    },
    customElementsFn: function customElementsFn(el, oldVal, newVal) {
      return function (cb) {
        return cb.call(el, oldVal, newVal);
      };
    }
  }
};

var make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(function iterateStates(stateName) {
  var mapFn = fnSignatures[stateName].mapFn;

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    forEach.call(elements, function (element) {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(mapFn.apply(null, [element].concat(args))).filter(Boolean);

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](element.childNodes, args, promises);
      }
    });

    return promises;
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param stateName
 * @param nodes
 * @param callback
 * @return
 */
function buildTrigger(allPromises) {
  var addPromises = allPromises.push.apply.bind(allPromises.push, allPromises);

  // This becomes `triggerTransition` in process.js.
  return function (stateName, makePromisesCallback, callback) {
    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      var promises = makePromisesCallback([]);

      // Add these promises into the global cache.
      addPromises(promises);

      if (!promises.length && callback) {
        callback(promises);
      } else {
        Promise.all(promises).then(callback, function handleRejection(ex) {
          console.log(ex);
        });
      }
    } else if (callback) {
      callback();
    }
  };
}

/**
 * Triggers the lifecycle events on an HTMLElement.
 *
 * @param stateName
 * @param elements
 * @return
 */
function triggerLifecycleEvent(stateName, args, elements) {
  // Trigger custom element
  var customElementFn = fnSignatures[stateName].customElementsFn;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var isTextNode = element.nodeType === 3;
    var nodeName = element.nodeName.toLowerCase();
    var descriptor = (0, _make2.default)(element);

    // Value of the `is` attribute, if it exists.
    var isAttr = null;

    // Check for the `is` attribute. It has a known bug where it cannot be
    // applied dynamically.
    if (!_custom.components[nodeName] && Array.isArray(descriptor.attributes)) {
      descriptor.attributes.some(function (attr, idx) {
        if (attr.name === 'is') {
          isAttr = attr.value;
          return true;
        }
      });
    }

    // Hack around the `is` attribute being unable to be set dynamically.
    if (isAttr && _custom.components[isAttr]) {
      nodeName = isAttr;
    }

    var customElement = _custom.components[nodeName] || empty;
    var customElementMethodName = stateName + 'Callback';

    // Call the associated CustomElement's lifecycle callback, if it exists.
    if (customElement.prototype[customElementMethodName]) {
      customElementFn.apply(null, args)(customElement.prototype[customElementMethodName].bind(element));
    }
  }
}

/**
 * Make a reusable function for easy transition calling.
 *
 * @param stateName
 * @param elements
 * @return
 */
function makePromises(stateName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  // Ensure elements is always an array.
  var elements = slice.call(args[0]);

  // Triggers the custom element callback.
  triggerLifecycleEvent(stateName, args.slice(1), elements);

  // Accepts the local Array of promises to use.
  return function (promises) {
    return make[stateName](elements, args.slice(1), promises);
  };
}

},{"./element/custom":1,"./node/make":6}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEntities = decodeEntities;
var element = document.createElement('div');

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param stringing
 * @return unescaped HTML
 */
function decodeEntities(string) {
  element.innerHTML = string;

  return element.textContent;
}

},{}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

var _pools2 = _dereq_('../util/pools');

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pools = _pools2.pools;
var makeNode = _make2.default;

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
function protectElement(element) {
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  elementObject.protect(element);

  element.attributes.forEach(attributeObject.protect, attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(protectElement);
  }

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
function unprotectElement(element, makeNode) {
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  elementObject.unprotect(element);
  elementObject.cache.uuid.delete(element.uuid);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(function (node) {
      return unprotectElement(node, makeNode);
    });
  }

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
function cleanMemory(makeNode) {
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  // Clean out unused elements.
  if (makeNode && makeNode.nodes) {
    for (var uuid in makeNode.nodes) {
      if (!elementObject.cache.uuid.has(uuid)) {
        delete makeNode.nodes[uuid];
      }
    }
  }

  // Empty all element allocations.
  elementObject.cache.allocated.forEach(function (v) {
    elementObject.cache.free.push(v);
  });

  elementObject.cache.allocated.clear();

  // Empty all attribute allocations.
  attributeObject.cache.allocated.forEach(function (v) {
    attributeObject.cache.free.push(v);
  });

  attributeObject.cache.allocated.clear();
}

},{"../node/make":6,"../util/pools":17}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHTML = parseHTML;
exports.makeParser = makeParser;

var _pools2 = _dereq_('./pools');

var pools = _pools2.pools; // Code based off of:
// https://github.com/ashi009/node-fast-html-parser

var parser = makeParser();
var slice = Array.prototype.slice;

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML, isInner) {
  var documentElement = parser.parse(newHTML);
  var nodes = documentElement.childNodes;

  return isInner ? nodes : nodes[0];
}

/**
 * makeParser
 *
 * @return
 */
function makeParser() {
  var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

  var kAttributePattern = /\b(id|class)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var reAttrPattern = /\b([a-z][a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var kSelfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
  };

  var kElementsClosedByOpening = {
    li: {
      li: true
    },

    p: {
      p: true, div: true
    },

    td: {
      td: true, th: true
    },

    th: {
      td: true, th: true
    }
  };

  var kElementsClosedByClosing = {
    li: {
      ul: true, ol: true
    },

    a: {
      div: true
    },

    b: {
      div: true
    },

    i: {
      div: true
    },

    p: {
      div: true
    },

    td: {
      tr: true, table: true
    },

    th: {
      tr: true, table: true
    }
  };

  var kBlockTextElements = {
    script: true,
    noscript: true,
    style: true,
    template: true
  };

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  /**
   * TextNode to contain a text element in DOM tree.
   * @param {string} value [description]
   */
  function TextNode(value) {
    var instance = pools.elementObject.get();

    instance.nodeName = '#text';
    instance.nodeValue = value;
    instance.nodeType = 3;
    instance.childNodes.length = 0;
    instance.attributes.length = 0;

    return instance;
  }

  /**
   * HTMLElement, which contains a set of children.
   *
   * Note: this is a minimalist implementation, no complete tree structure
   * provided (no parentNode, nextSibling, previousSibling etc).
   *
   * @param {string} name     nodeName
   * @param {Object} keyAttrs id and class attribute
   * @param {Object} rawAttrs attributes in string
   */
  function HTMLElement(name, keyAttrs, rawAttrs) {
    var instance = pools.elementObject.get();

    instance.nodeName = name;
    instance.nodeValue = '';
    instance.nodeType = 1;
    instance.childNodes.length = 0;
    instance.attributes.length = 0;

    if (rawAttrs) {
      for (var match; match = reAttrPattern.exec(rawAttrs);) {
        var attr = pools.attributeObject.get();

        attr.name = match[1];
        attr.value = match[6] || match[5] || match[4] || match[1];

        // Look for empty attributes.
        if (match[6] === '""') {
          attr.value = '';
        }

        instance.attributes.push(attr);
      }
    }

    return instance;
  }

  /**
   * Parses HTML and returns a root element
   */
  var htmlParser = {
    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function parse(data) {
      var rootObject = {};
      var root = HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      if (data.indexOf('<') === -1 && data) {
        currentParent.childNodes.push(TextNode(data));

        return root;
      }

      for (var match, text; match = kMarkupPattern.exec(data);) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.slice(lastTextPos, kMarkupPattern.lastIndex - match[0].length);

            currentParent.childNodes.push(TextNode(text));
          }
        }

        lastTextPos = kMarkupPattern.lastIndex;

        // This is a comment.
        if (match[0][1] === '!') {
          continue;
        }

        if (!match[1]) {
          // not </ tags
          var attrs = {};

          for (var attMatch; attMatch = kAttributePattern.exec(match[3]);) {
            attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
          }

          if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
            if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
            }
          }

          currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], attrs, match[3])) - 1];

          stack.push(currentParent);

          if (kBlockTextElements[match[2]]) {
            // A little test to find next </script> or </style> ...
            var closeMarkup = '</' + match[2] + '>';
            var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
            var length = match[2].length;

            if (index === -1) {
              lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
            } else {
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
            }

            var newText = data.slice(match.index + match[0].length, index);

            if (newText.trim()) {
              newText = slice.call(newText).map(function (ch) {
                return escapeMap[ch] || ch;
              }).join('');

              currentParent.childNodes.push(TextNode(newText));
            }
          }
        }
        if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
          // </ or /> or <br> etc.
          while (currentParent) {
            if (currentParent.nodeName == match[2]) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              break;
            } else {
              // Trying to close current tag, and move on
              if (kElementsClosedByClosing[currentParent.nodeName]) {
                if (kElementsClosedByClosing[currentParent.nodeName][match[2]]) {
                  stack.pop();
                  currentParent = stack[stack.length - 1];

                  continue;
                }
              }

              // Use aggressive strategy to handle unmatching markups.
              break;
            }
          }
        }
      }

      // This is an entire document, so only allow the HTML children to be
      // body or head.
      if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
        (function () {
          // Store elements from before body end and after body end.
          var head = { before: [], after: [] };
          var body = { after: [] };
          var beforeHead = true;
          var beforeBody = true;
          var HTML = root.childNodes[0];

          // Iterate the children and store elements in the proper array for
          // later concat, replace the current childNodes with this new array.
          HTML.childNodes = HTML.childNodes.filter(function (el) {
            // If either body or head, allow as a valid element.
            if (el.nodeName === 'body' || el.nodeName === 'head') {
              if (el.nodeName === 'head') {
                beforeHead = false;
              }

              if (el.nodeName === 'body') {
                beforeBody = false;
              }

              return true;
            }
            // Not a valid nested HTML tag element, move to respective container.
            else if (el.nodeType === 1) {
                if (beforeHead && beforeBody) {
                  head.before.push(el);
                } else if (!beforeHead && beforeBody) {
                  head.after.push(el);
                } else if (!beforeBody) {
                  body.after.push(el);
                }
              }
          });

          // Ensure the first element is the HEAD tag.
          if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
            var headInstance = pools.elementObject.get();
            headInstance.nodeName = 'head';
            headInstance.childNodes.length = 0;
            headInstance.attributes.length = 0;

            var existing = headInstance.childNodes;
            existing.unshift.apply(existing, head.before);
            existing.push.apply(existing, head.after);

            HTML.childNodes.unshift(headInstance);
          } else {
            var _existing = HTML.childNodes[0].childNodes;
            _existing.unshift.apply(_existing, head.before);
            _existing.push.apply(_existing, head.after);
          }

          // Ensure the second element is the body tag.
          if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
            var bodyInstance = pools.elementObject.get();
            bodyInstance.nodeName = 'body';
            bodyInstance.childNodes.length = 0;
            bodyInstance.attributes.length = 0;

            var _existing2 = bodyInstance.childNodes;
            _existing2.push.apply(_existing2, body.after);

            HTML.childNodes.push(bodyInstance);
          } else {
            var _existing3 = HTML.childNodes[1].childNodes;
            _existing3.push.apply(_existing3, body.after);
          }
        })();
      }

      return root;
    }
  };

  return htmlParser;
}

},{"./pools":17}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = exports.pools = undefined;
exports.createPool = createPool;
exports.initializePools = initializePools;

var _uuid2 = _dereq_('./uuid');

var _uuid3 = _interopRequireDefault(_uuid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = _uuid3.default;

var pools = exports.pools = {};
var count = exports.count = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
function createPool(name, opts) {
  var size = opts.size;
  var fill = opts.fill;

  var cache = {
    free: [],
    allocated: new Set(),
    protected: new Set(),
    uuid: new Set()
  };

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    cache.free.push(fill());
  }

  return {
    cache: cache,

    get: function get() {
      var value = cache.free.pop() || fill();
      cache.allocated.add(value);
      return value;
    },
    protect: function protect(value) {
      cache.allocated.delete(value);
      cache.protected.add(value);

      if (name === 'elementObject') {
        cache.uuid.add(value.uuid);
      }
    },
    unprotect: function unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.push(value);
      }
    }
  };
}

function initializePools(COUNT) {
  pools.attributeObject = createPool('attributeObject', {
    size: COUNT,

    fill: function fill() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool('elementObject', {
    size: COUNT,

    fill: function fill() {
      return {
        nodeName: '',
        nodeValue: '',
        uuid: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create ${COUNT} items of each type.
initializePools(count);

},{"./uuid":19}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completeRender = completeRender;

var _customEvent = _dereq_('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _patch = _dereq_('../node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _tree = _dereq_('../node/tree');

var _memory = _dereq_('../util/memory');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderNext(elementMeta) {
  var nextRender = elementMeta.renderBuffer;
  elementMeta.renderBuffer = undefined;

  // Noticing some weird performance implications with this concept.
  (0, _patch2.default)(nextRender.element, nextRender.newHTML, nextRender.options);
}

/**
 * When the UI or Worker thread completes, clean up memory and schedule the
 * next render if necessary.
 *
 * @param element
 * @param elementMeta
 */
function completeRender(element, elementMeta) {
  return function invokeRender() {
    elementMeta.previousMarkup = elementMeta.options.inner ? element.innerHTML : element.outerHTML;
    elementMeta._textContent = element.textContent;

    (0, _memory.cleanMemory)(_make2.default);

    elementMeta.isRendering = false;

    // Boolean to stop operations in the TreeCache loop below.
    var stopLooping = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises.
    if (elementMeta.renderBuffer) {
      renderNext(elementMeta);
    } else {
      _tree.TreeCache.forEach(function iterateTreeCache(elementMeta) {
        if (!stopLooping && elementMeta.renderBuffer) {
          renderNext(elementMeta);
          stopLooping = true;
        }
      });
    }

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2.default('renderComplete'));
  };
}

},{"../node/make":6,"../node/patch":7,"../node/tree":10,"../util/memory":15,"../util/pools":17,"custom-event":22}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;
/**
 * Generates a uuid.
 *
 * @see http://stackoverflow.com/a/2117523/282175
 * @return {string} uuid
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

},{}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasWorker = undefined;
exports.create = create;

var _uuid = _dereq_('../util/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _pools = _dereq_('../util/pools');

var _parser = _dereq_('../util/parser');

var _memory = _dereq_('../util/memory');

var _sync = _dereq_('../node/sync');

var _sync2 = _interopRequireDefault(_sync);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _source = _dereq_('./source');

var _source2 = _interopRequireDefault(_source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tests if the browser has support for the `Worker` API.
var hasWorker = exports.hasWorker = typeof Worker === 'function';

// Find all the coverage statements and expressions.
var COV_EXP = /__cov_([^\+\+]*)\+\+/gi;

/**
 * Awful hack to remove `__cov` lines from the source before sending over to
 * the worker. Only useful while testing.
 */
function filterOutCoverage(string) {
  return string.replace(COV_EXP, 'null');
}

/**
 * Creates a new Web Worker per element that will be diffed. Allows multiple
 * concurrent diffing operations to occur simultaneously, leveraging the
 * multi-core nature of desktop and mobile devices.
 *
 * Attach any functions that could be used by the Worker inside the Blob below.
 * All functions are named so they can be accessed globally. Since we're
 * directly injecting the methods into the ES6 template string,
 * `Function.prototype.toString` will be invoked returning a representation of
 * the function's source. This comes at a cost since Babel rewrites variable
 * names when you `import` a module. This is why you'll see underscored
 * properties being imported and then reassigned to non-underscored names in
 * modules that are reused here. Isparta injects coverage function calls that
 * will error out in the Worker, which is why we strip them out.
 *
 * @return {Object} A Worker instance.
 */
function create() {
  var worker = null;
  var workerBlob = null;
  var workerSource = filterOutCoverage('\n    // Reusable Array methods.\n    var slice = Array.prototype.slice;\n    var filter = Array.prototype.filter;\n\n    // Add a namespace to attach pool methods to.\n    var pools = {};\n    var nodes = 0;\n    var REMOVE_ELEMENT_CHILDREN = -2;\n    var REMOVE_ENTIRE_ELEMENT = -1;\n    var MODIFY_ELEMENT = 1;\n    var MODIFY_ATTRIBUTE = 2;\n    var CHANGE_TEXT = 3;\n\n    // Inject the uuid code.\n    ' + _uuid2.default + ';\n\n    // Add in pool manipulation methods.\n    ' + _pools.createPool + ';\n    ' + _pools.initializePools + ';\n\n    initializePools(' + _pools.count + ');\n\n    // Add the ability to protect elements from free\'d memory.\n    ' + _memory.protectElement + ';\n    ' + _memory.unprotectElement + ';\n    ' + _memory.cleanMemory + ';\n\n    // Add in Node manipulation.\n    var syncNode = ' + _sync2.default + ';\n    var makeNode = ' + _make2.default + ';\n\n    // Add in the ability to parseHTML.\n    ' + _parser.parseHTML + ';\n\n    var makeParser = ' + _parser.makeParser + ';\n    var parser = makeParser();\n\n    // Add in the worker source.\n    ' + _source2.default + ';\n\n    // Metaprogramming up this worker call.\n    startup(self);\n  ');

  // Set up a WebWorker if available.
  if (hasWorker) {
    // Construct the worker reusing code already organized into modules.  Keep
    // this code ES5 since we do not get time to pre-process it as ES6.
    workerBlob = new Blob([workerSource], { type: 'application/javascript' });

    // Construct the worker and start it up.
    try {
      worker = new Worker(URL.createObjectURL(workerBlob));
    } catch (ex) {
      if (console && console.info) {
        console.info('Failed to create diffhtml worker', ex);
      }

      // If we cannot create a Worker, then disable trying again, all work
      // will happen on the main UI thread.
      exports.hasWorker = hasWorker = false;
    }
  }

  return worker;
}

},{"../node/make":6,"../node/sync":9,"../util/memory":15,"../util/parser":16,"../util/pools":17,"../util/uuid":19,"./source":21}],21:[function(_dereq_,module,exports){
'use strict';

// These are globally defined to avoid issues with JSHint thinking that we're
// referencing unknown identifiers.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startup;
var parseHTML;
var syncNode;
var pools;
var unprotectElement;
var protectElement;
var cleanMemory;

/**
 * This is the Web Worker source code. All globals here are defined in the
 * worker/create module. This allows code sharing and less duplication since
 * most of the logic is identical to the UI thread.
 *
 * @param worker - A worker instance
 */
function startup(worker) {
  var patches = [];
  var oldTree = null;

  /**
   * Triggered whenever a `postMessage` call is made on the Worker instance
   * from the UI thread. Signals that some work needs to occur. Will post back
   * to the main thread with patch and node transform results.
   *
   * @param e - The normalized event object.
   */
  worker.onmessage = function onmessage(e) {
    var data = e.data;
    var isInner = data.isInner;
    var newTree = null;

    // If an `oldTree` was provided by the UI thread, use that in place of the
    // current `oldTree`.
    if (data.oldTree) {
      if (oldTree) {
        unprotectElement(oldTree);
        cleanMemory();
      }

      oldTree = data.oldTree;
    }

    // If the `newTree` was provided to the worker, use that instead of trying
    // to create one from HTML source.
    if (data.newTree) {
      newTree = data.newTree;
    }

    // If no `newTree` was provided, we'll have to try and create one from the
    // HTML source provided.
    else if (typeof data.newHTML === 'string') {
        // Calculate a new tree.
        newTree = parseHTML(data.newHTML, isInner);

        // If the operation is for `innerHTML` then we'll retain the previous
        // tree's attributes, nodeName, and nodeValue, and only adjust the
        // childNodes.
        if (isInner) {
          var childNodes = newTree;

          newTree = {
            childNodes: childNodes,
            attributes: oldTree.attributes,
            uuid: oldTree.uuid,
            nodeName: oldTree.nodeName,
            nodeValue: oldTree.nodeValue
          };
        }
      }

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be executed to update the DOM.
    syncNode(oldTree, newTree, patches);

    // Protect the current `oldTree` so that Nodes will not be accidentally
    // recycled in the cleanup process.
    protectElement(oldTree);

    // Send the patches back to the userland.
    worker.postMessage({
      // All the patches to apply to the DOM.
      patches: patches
    });

    // Recycle allocated objects back into the pool.
    cleanMemory();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

},{}],22:[function(_dereq_,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[5])(5)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],17:[function(require,module,exports){
/*
Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org

https://github.com/mroderick/PubSubJS
*/
(function (root, factory){
	'use strict';

    if (typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['exports'], factory);

    } else if (typeof exports === 'object'){
        // CommonJS
        factory(exports);

    }

    // Browser globals
    var PubSub = {};
    root.PubSub = PubSub;
    factory(PubSub);
    
}(( typeof window === 'object' && window ) || this, function (PubSub){
	'use strict';

	var messages = {},
		lastUid = -1;

	function hasKeys(obj){
		var key;

		for (key in obj){
			if ( obj.hasOwnProperty(key) ){
				return true;
			}
		}
		return false;
	}

	/**
	 *	Returns a function that throws the passed exception, for use as argument for setTimeout
	 *	@param { Object } ex An Error object
	 */
	function throwException( ex ){
		return function reThrowException(){
			throw ex;
		};
	}

	function callSubscriberWithDelayedExceptions( subscriber, message, data ){
		try {
			subscriber( message, data );
		} catch( ex ){
			setTimeout( throwException( ex ), 0);
		}
	}

	function callSubscriberWithImmediateExceptions( subscriber, message, data ){
		subscriber( message, data );
	}

	function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
		var subscribers = messages[matchedMessage],
			callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
			s;

		if ( !messages.hasOwnProperty( matchedMessage ) ) {
			return;
		}

		for (s in subscribers){
			if ( subscribers.hasOwnProperty(s)){
				callSubscriber( subscribers[s], originalMessage, data );
			}
		}
	}

	function createDeliveryFunction( message, data, immediateExceptions ){
		return function deliverNamespaced(){
			var topic = String( message ),
				position = topic.lastIndexOf( '.' );

			// deliver the message as it is now
			deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while( position !== -1 ){
				topic = topic.substr( 0, position );
				position = topic.lastIndexOf('.');
				deliverMessage( message, topic, data, immediateExceptions );
			}
		};
	}

	function messageHasSubscribers( message ){
		var topic = String( message ),
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),
			position = topic.lastIndexOf( '.' );

		while ( !found && position !== -1 ){
			topic = topic.substr( 0, position );
			position = topic.lastIndexOf( '.' );
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));
		}

		return found;
	}

	function publish( message, data, sync, immediateExceptions ){
		var deliver = createDeliveryFunction( message, data, immediateExceptions ),
			hasSubscribers = messageHasSubscribers( message );

		if ( !hasSubscribers ){
			return false;
		}

		if ( sync === true ){
			deliver();
		} else {
			setTimeout( deliver, 0 );
		}
		return true;
	}

	/**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message, passing the data to it's subscribers
	**/
	PubSub.publish = function( message, data ){
		return publish( message, data, false, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
	PubSub.publishSync = function( message, data ){
		return publish( message, data, true, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
	 *	you need to unsubscribe
	**/
	PubSub.subscribe = function( message, func ){
		if ( typeof func !== 'function'){
			return false;
		}

		// message is not registered yet
		if ( !messages.hasOwnProperty( message ) ){
			messages[message] = {};
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = 'uid_' + String(++lastUid);
		messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	/* Public: Clears all subscriptions
	 */
	PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
		messages = {};
	};

	/*Public: Clear subscriptions by the topic
	*/
	PubSub.clearSubscriptions = function clearSubscriptions(topic){
		var m; 
		for (m in messages){
			if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){
				delete messages[m];
			}
		}
	};

	/* Public: removes subscriptions.
	 * When passed a token, removes a specific subscription.
	 * When passed a function, removes all subscriptions for that function
	 * When passed a topic, removes all subscriptions for that topic (hierarchy)
	 *
	 * value - A token, function or topic to unsubscribe.
	 *
	 * Examples
	 *
	 *		// Example 1 - unsubscribing with a token
	 *		var token = PubSub.subscribe('mytopic', myFunc);
	 *		PubSub.unsubscribe(token);
	 *
	 *		// Example 2 - unsubscribing with a function
	 *		PubSub.unsubscribe(myFunc);
	 *
	 *		// Example 3 - unsubscribing a topic
	 *		PubSub.unsubscribe('mytopic');
	 */
	PubSub.unsubscribe = function(value){
		var isTopic    = typeof value === 'string' && messages.hasOwnProperty(value),
			isToken    = !isTopic && typeof value === 'string',
			isFunction = typeof value === 'function',
			result = false,
			m, message, t;

		if (isTopic){
			delete messages[value];
			return;
		}

		for ( m in messages ){
			if ( messages.hasOwnProperty( m ) ){
				message = messages[m];

				if ( isToken && message[value] ){
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction) {
					for ( t in message ){
						if (message.hasOwnProperty(t) && message[t] === value){
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};
}));

},{}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

module.exports = exports['default'];
},{"./compose":21}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsMapValues = require('./utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
    return bindActionCreator(actionCreator, dispatch);
  });
}

module.exports = exports['default'];
},{"./utils/mapValues":25}],20:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('./createStore');

var _utilsIsPlainObject = require('./utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

var _utilsMapValues = require('./utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

var _utilsPick = require('./utils/pick');

var _utilsPick2 = _interopRequireDefault(_utilsPick);

var _utilsWarning = require('./utils/warning');

var _utilsWarning2 = _interopRequireDefault(_utilsWarning);

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!_utilsIsPlainObject2['default'](inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

function combineReducers(reducers) {
  var finalReducers = _utilsPick2['default'](reducers, function (val) {
    return typeof val === 'function';
  });
  var sanityError;

  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination(state, action) {
    if (state === undefined) state = {};

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        _utilsWarning2['default'](warningMessage);
      }
    }

    var hasChanged = false;
    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      return nextStateForKey;
    });

    return hasChanged ? finalState : state;
  };
}

module.exports = exports['default'];
}).call(this,require('_process'))

},{"./createStore":22,"./utils/isPlainObject":24,"./utils/mapValues":25,"./utils/pick":26,"./utils/warning":27,"_process":15}],21:[function(require,module,exports){
/**
 * Composes single-argument functions from right to left.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
"use strict";

exports.__esModule = true;
exports["default"] = compose;

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    if (funcs.length === 0) {
      return arguments[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);

    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

module.exports = exports["default"];
},{}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = createStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsPlainObject = require('./utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

exports.ActionTypes = ActionTypes;
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, initialState, enhancer) {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var listeners = [];
  var isDispatching = false;

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   * Note, the listener should not expect to see all states changes, as the
   * state might have been updated multiple times before the listener is
   * notified.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    listeners.push(listener);
    var isSubscribed = true;

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!_utilsIsPlainObject2['default'](action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    listeners.slice().forEach(function (listener) {
      return listener();
    });
    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  };
}
},{"./utils/isPlainObject":24}],23:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _utilsWarning = require('./utils/warning');

var _utilsWarning2 = _interopRequireDefault(_utilsWarning);

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && setInterval.name === 'setInterval' && isCrushed.name !== 'isCrushed') {
  _utilsWarning2['default']('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
}).call(this,require('_process'))

},{"./applyMiddleware":18,"./bindActionCreators":19,"./combineReducers":20,"./compose":21,"./createStore":22,"./utils/warning":27,"_process":15}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = isPlainObject;
var fnToString = function fnToString(fn) {
  return Function.prototype.toString.call(fn);
};
var objStringValue = fnToString(Object);

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

function isPlainObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

  if (proto === null) {
    return true;
  }

  var constructor = proto.constructor;

  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
}

module.exports = exports['default'];
},{}],25:[function(require,module,exports){
/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj The source object.
 * @param {Function} fn The mapper function that receives the value and the key.
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
"use strict";

exports.__esModule = true;
exports["default"] = mapValues;

function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = fn(obj[key], key);
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],26:[function(require,module,exports){
/**
 * Picks key-value pairs from an object where values satisfy a predicate.
 *
 * @param {Object} obj The object to pick from.
 * @param {Function} fn The predicate the values must satisfy to be copied.
 * @returns {Object} The object with the values that satisfied the predicate.
 */
"use strict";

exports.__esModule = true;
exports["default"] = pick;

function pick(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    if (fn(obj[key])) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],27:[function(require,module,exports){
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
'use strict';

exports.__esModule = true;
exports['default'] = warning;

function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

module.exports = exports['default'];
},{}],28:[function(require,module,exports){
/*!
 * viewport-units-buggyfill v0.5.5
 * @web: https://github.com/rodneyrehm/viewport-units-buggyfill/
 * @author: Rodney Rehm - http://rodneyrehm.de/en/
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.viewportUnitsBuggyfill = factory();
  }
}(this, function () {
  'use strict';
  /*global document, window, navigator, location, XMLHttpRequest, XDomainRequest*/

  var initialized = false;
  var options;
  var userAgent = window.navigator.userAgent;
  var viewportUnitExpression = /([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g;
  var forEach = [].forEach;
  var dimensions;
  var declarations;
  var styleNode;
  var isBuggyIE = /MSIE [0-9]\./i.test(userAgent);
  var isOldIE = /MSIE [0-8]\./i.test(userAgent);
  var isOperaMini = userAgent.indexOf('Opera Mini') > -1;

  var isMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(userAgent) && (function() {
    // Regexp for iOS-version tested against the following userAgent strings:
    // Example WebView UserAgents:
    // * iOS Chrome on iOS8: "Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/39.0.2171.50 Mobile/12B410 Safari/600.1.4"
    // * iOS Facebook on iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201 [FBAN/FBIOS;FBAV/12.1.0.24.20; FBBV/3214247; FBDV/iPhone6,1;FBMD/iPhone; FBSN/iPhone OS;FBSV/7.1.1; FBSS/2; FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5]"
    // Example Safari UserAgents:
    // * Safari iOS8: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
    // * Safari iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53"
    var iOSversion = userAgent.match(/OS (\d)/);
    // viewport units work fine in mobile Safari and webView on iOS 8+
    return iOSversion && iOSversion.length>1 && parseInt(iOSversion[1]) < 8;
  })();

  var isBadStockAndroid = (function() {
    // Android stock browser test derived from
    // http://stackoverflow.com/questions/24926221/distinguish-android-chrome-from-stock-browser-stock-browsers-user-agent-contai
    var isAndroid = userAgent.indexOf(' Android ') > -1;
    if (!isAndroid) {
      return false;
    }

    var isStockAndroid = userAgent.indexOf('Version/') > -1;
    if (!isStockAndroid) {
      return false;
    }

    var versionNumber = parseFloat((userAgent.match('Android ([0-9.]+)') || [])[1]);
    // anything below 4.4 uses WebKit without *any* viewport support,
    // 4.4 has issues with viewport units within calc()
    return versionNumber <= 4.4;
  })();

  // added check for IE11, since it *still* doesn't understand vmax!!!
  if (!isBuggyIE) {
    isBuggyIE = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
  }

  // Polyfill for creating CustomEvents on IE9/10/11
  // from https://github.com/krambuhl/custom-event-polyfill
  try {
    new CustomEvent('test');
  } catch(e) {
    var CustomEvent = function(event, params) {
      var evt;
      params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  // from http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function initialize(initOptions) {
    if (initialized) {
      return;
    }

    if (initOptions === true) {
      initOptions = {
        force: true
      };
    }

    options = initOptions || {};
    options.isMobileSafari = isMobileSafari;
    options.isBadStockAndroid = isBadStockAndroid;

    if (isOldIE || (!options.force && !isMobileSafari && !isBuggyIE && !isBadStockAndroid && !isOperaMini && (!options.hacks || !options.hacks.required(options)))) {
      // this buggyfill only applies to mobile safari, IE9-10 and the Stock Android Browser.
      if (window.console && isOldIE) {
        console.info('viewport-units-buggyfill requires a proper CSSOM and basic viewport unit support, which are not available in IE8 and below');
      }

      return {
        init: function () {}
      };
    }

    // fire a custom event that buggyfill was initialize
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-init'));

    options.hacks && options.hacks.initialize(options);

    initialized = true;
    styleNode = document.createElement('style');
    styleNode.id = 'patched-viewport';
    document.head.appendChild(styleNode);

    // Issue #6: Cross Origin Stylesheets are not accessible through CSSOM,
    // therefore download and inject them as <style> to circumvent SOP.
    importCrossOriginLinks(function() {
      var _refresh = debounce(refresh, options.refreshDebounceWait || 100);
      // doing a full refresh rather than updateStyles because an orientationchange
      // could activate different stylesheets
      window.addEventListener('orientationchange', _refresh, true);
      // orientationchange might have happened while in a different window
      window.addEventListener('pageshow', _refresh, true);

      if (options.force || isBuggyIE || inIframe()) {
        window.addEventListener('resize', _refresh, true);
        options._listeningToResize = true;
      }

      options.hacks && options.hacks.initializeEvents(options, refresh, _refresh);

      refresh();
    });
  }

  function updateStyles() {
    styleNode.textContent = getReplacedViewportUnits();
    // move to the end in case inline <style>s were added dynamically
    styleNode.parentNode.appendChild(styleNode);
    // fire a custom event that styles were updated
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-style'));
  }

  function refresh() {
    if (!initialized) {
      return;
    }

    findProperties();

    // iOS Safari will report window.innerWidth and .innerHeight as 0 unless a timeout is used here.
    // TODO: figure out WHY innerWidth === 0
    setTimeout(function() {
      updateStyles();
    }, 1);
  }

  function findProperties() {
    declarations = [];
    forEach.call(document.styleSheets, function(sheet) {
      if (sheet.ownerNode.id === 'patched-viewport' || !sheet.cssRules || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip entire sheet because no rules are present, it's supposed to be ignored or it's the target-element of the buggyfill
        return;
      }

      if (sheet.media && sheet.media.mediaText && window.matchMedia && !window.matchMedia(sheet.media.mediaText).matches) {
        // skip entire sheet because media attribute doesn't match
        return;
      }

      forEach.call(sheet.cssRules, findDeclarations);
    });

    return declarations;
  }

  function findDeclarations(rule) {
    if (rule.type === 7) {
      var value;

      // there may be a case where accessing cssText throws an error.
      // I could not reproduce this issue, but the worst that can happen
      // this way is an animation not running properly.
      // not awesome, but probably better than a script error
      // see https://github.com/rodneyrehm/viewport-units-buggyfill/issues/21
      try {
        value = rule.cssText;
      } catch(e) {
        return;
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        // KeyframesRule does not have a CSS-PropertyName
        declarations.push([rule, null, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, null, value);
      }

      return;
    }

    if (!rule.style) {
      if (!rule.cssRules) {
        return;
      }

      forEach.call(rule.cssRules, function(_rule) {
        findDeclarations(_rule);
      });

      return;
    }

    forEach.call(rule.style, function(name) {
      var value = rule.style.getPropertyValue(name);
      // preserve those !important rules
      if (rule.style.getPropertyPriority(name)) {
        value += ' !important';
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        declarations.push([rule, name, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, name, value);
      }
    });
  }

  function getReplacedViewportUnits() {
    dimensions = getViewport();

    var css = [];
    var buffer = [];
    var open;
    var close;

    declarations.forEach(function(item) {
      var _item = overwriteDeclaration.apply(null, item);
      var _open = _item.selector.length ? (_item.selector.join(' {\n') + ' {\n') : '';
      var _close = new Array(_item.selector.length + 1).join('\n}');

      if (!_open || _open !== open) {
        if (buffer.length) {
          css.push(open + buffer.join('\n') + close);
          buffer.length = 0;
        }

        if (_open) {
          open = _open;
          close = _close;
          buffer.push(_item.content);
        } else {
          css.push(_item.content);
          open = null;
          close = null;
        }

        return;
      }

      if (_open && !open) {
        open = _open;
        close = _close;
      }

      buffer.push(_item.content);
    });

    if (buffer.length) {
      css.push(open + buffer.join('\n') + close);
    }

    // Opera Mini messes up on the content hack (it replaces the DOM node's innerHTML with the value).
    // This fixes it. We test for Opera Mini only since it is the most expensive CSS selector
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
    if (isOperaMini) {
      css.push('* { content: normal !important; }');
    }

    return css.join('\n\n');
  }

  function overwriteDeclaration(rule, name, value) {
    var _value;
    var _selectors = [];

    _value = value.replace(viewportUnitExpression, replaceValues);

    if (options.hacks) {
      _value = options.hacks.overwriteDeclaration(rule, name, _value);
    }

    if (name) {
      // skipping KeyframesRule
      _selectors.push(rule.selectorText);
      _value = name + ': ' + _value + ';';
    }

    var _rule = rule.parentRule;
    while (_rule) {
      _selectors.unshift('@media ' + _rule.media.mediaText);
      _rule = _rule.parentRule;
    }

    return {
      selector: _selectors,
      content: _value
    };
  }

  function replaceValues(match, number, unit) {
    var _base = dimensions[unit];
    var _number = parseFloat(number) / 100;
    return (_number * _base) + 'px';
  }

  function getViewport() {
    var vh = window.innerHeight;
    var vw = window.innerWidth;

    return {
      vh: vh,
      vw: vw,
      vmax: Math.max(vw, vh),
      vmin: Math.min(vw, vh)
    };
  }

  function importCrossOriginLinks(next) {
    var _waiting = 0;
    var decrease = function() {
      _waiting--;
      if (!_waiting) {
        next();
      }
    };

    forEach.call(document.styleSheets, function(sheet) {
      if (!sheet.href || origin(sheet.href) === origin(location.href) || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip <style> and <link> from same origin or explicitly declared to ignore
        return;
      }

      _waiting++;
      convertLinkToStyle(sheet.ownerNode, decrease);
    });

    if (!_waiting) {
      next();
    }
  }

  function origin(url) {
    return url.slice(0, url.indexOf('/', url.indexOf('://') + 3));
  }

  function convertLinkToStyle(link, next) {
    getCors(link.href, function() {
      var style = document.createElement('style');
      style.media = link.media;
      style.setAttribute('data-href', link.href);
      style.textContent = this.responseText;
      link.parentNode.replaceChild(style, link);
      next();
    }, next);
  }

  function getCors(url, success, error) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open('GET', url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open('GET', url);
    } else {
      throw new Error('cross-domain XHR not supported');
    }

    xhr.onload = success;
    xhr.onerror = error;
    xhr.send();
    return xhr;
  }

  return {
    version: '0.5.5',
    findProperties: findProperties,
    getCss: getReplacedViewportUnits,
    init: initialize,
    refresh: refresh
  };

}));

},{}]},{},[1])


//# sourceMappingURL=main.js.map
