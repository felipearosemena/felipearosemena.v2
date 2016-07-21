import vuBuggyfill from 'viewport-units-buggyfill'

export const vu = vuBuggyfill.init

export const classList = () => {

  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return

  var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join

  function DOMTokenList(el) {
    this.el = el
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/)
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i])
    }
  }

  DOMTokenList.prototype = {
    add: function(token) {
      if (this.contains(token)) return
      push.call(this, token)
      this.el.className = this.toString()
    },
    contains: function(token) {
      return this.el.className.indexOf(token) != -1
    },
    item: function(index) {
      return this[index] || null
    },
    remove: function(token) {
      if (!this.contains(token)) return
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break
      }
      splice.call(this, i, 1)
      this.el.className = this.toString()
    },
    toString: function() {
      return join.call(this, ' ')
    },
    toggle: function(token) {
      if (!this.contains(token)) {
        this.add(token)
      } else {
        this.remove(token)
      }

      return this.contains(token)
    }
  }

  window.DOMTokenList = DOMTokenList

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      })
    } else {
      obj.__defineGetter__(prop, getter)
    }
  }

  defineElementGetter(Element.prototype, 'classList', function() {
    return new DOMTokenList(this)
  })

}

export const dataset = () => {

  var forEach = [].forEach,
    regex = /^data-(.+)/,
    dashChar = /\-([a-z])/ig,
    el = document.createElement('div'),
    mutationSupported = false,
    match

  function detectMutation() {
    mutationSupported = true
    this.removeEventListener('DOMAttrModified', detectMutation, false)
  }

  function toCamelCase(s) {
    return s.replace(dashChar, function(m, l) {
      return l.toUpperCase()
    })
  }

  function updateDataset() {
    var dataset = {}
    forEach.call(this.attributes, function(attr) {
      if (match = attr.name.match(regex))
        dataset[toCamelCase(match[1])] = attr.value
    })
    return dataset
  }

  // only add support if the browser doesn't support data-* natively
  if (el.dataset != undefined) return

  el.addEventListener('DOMAttrModified', detectMutation, false)
  el.setAttribute('foo', 'bar')

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      })
    } else {
      obj.__defineGetter__(prop, getter)
    }
  }

  defineElementGetter(Element.prototype, 'dataset', mutationSupported ? function() {
    if (!this._datasetCache) {
      this._datasetCache = updateDataset.call(this)
    }
    return this._datasetCache
  } : updateDataset)

  document.addEventListener('DOMAttrModified', function(event) {
    delete event.target._datasetCache
  }, false)

}

export const domParser = () => {

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

  (function(DOMParser) {
    "use strict"

    let DOMParser_proto = DOMParser.prototype, 
        real_parseFromString = DOMParser_proto.parseFromString
    

    // Firefox/Opera/IE throw errors on unsupported types
    try {
      // WebKit returns null on unsupported types
      if ((new DOMParser).parseFromString("", "text/html")) {
        // text/html parsing is natively supported
        return
      }
    } catch (ex) {}

    DOMParser_proto.parseFromString = function(markup, type) {
      if (/^\s*text\/html\s*(?:|$)/i.test(type)) {
        var
          doc = document.implementation.createHTMLDocument("")
        
              if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup
              }
              else {
                doc.body.innerHTML = markup
              }
        return doc
      } else {
        return real_parseFromString.apply(this, arguments)
      }
    }

  }(window.DOMParser))

}
