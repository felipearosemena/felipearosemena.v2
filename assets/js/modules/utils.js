export function inRange(val, range) {
  return val > range[0] && val < range[1]
}

export function inCanvas(x, y, r, canvas) {
  let w = canvas.width,
      h = canvas.height

  return (inRange(x, [-r , w + r]) && inRange(y, [-r , h + r]) )
} 

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomNum(min, max) {
  return Math.random() * (max - min) + min
}

export function coords(x, y, canvas) {
  return {
      x: x * canvas.width / canvas.clientWidth,
      y: y * canvas.height /  canvas.clientHeight
  }
}

export function inArray(item, array) {
  return array.indexOf(item) > -1
}

export function vw(ratio = 1) {
  return window.innerWidth * ratio
}

export function vh(ratio = 1) {
  return window.innerHeight * ratio
}

export function recur(fn, seed) {
  let result = fn(seed)
  if(!!result) {
    recur(fn, result)
  }
} 

export function selectorMatches(el, selector) {
  let p = Element.prototype
  let f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1
  }
  return f.call(el, selector)
}

export function isMobile() {
  const re = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle/
  return window.navigator.userAgent.match(re)
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


export function createElement(tagname, attributes = {}, data = {}) {

  let el = document.createElement(tagname);

  if(el.setAttribute) {
    map(attributes, (k, v) => {
      el.setAttribute(k, v)
    })

    map(data, (k, v) => {
      el.setAttribute('data-' + k, v)
    })
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

export function delegateEvent(el, eventName, delegate, handler) {
  
  if(typeof handler !== 'function') return;
  if(el.addEventListener) {
    el.addEventListener(eventName, (e) => {
      if(selectorMatches(e.target, delegate)) {        
        handler(e)
      }
    })
  }

}


export function map(arrLike, cb) {

  if(!arrLike) {
    return false
  }

  if(arrLike.length) {

    return Array.prototype.map.call(arrLike, cb)
  
  } else if(arrLike.length !== 'undefined' && arrLike.length == 0) {
  
    return [];
  
  } else if(typeof arrLike == 'object' && arrLike.constructor == Object) {
    
    const newArrLike = {}
    for (var k in arrLike) {
      if (arrLike.hasOwnProperty(k)) {
        newArrLike[k] = cb(k, arrLike[k])
      }
    }
    return newArrLike

  } else if(arrLike) {
    return Array.prototype.map.call([arrLike], cb)
  } 
}

export function mapJoin(arrLike, cb, separator = '') {
  return map(arrLike, cb).join(separator)
}

export function filter(arrLike, cb) {

  if(!arrLike) {
    return false
  }

  if(arrLike.length) {

    return Array.prototype.filter.call(arrLike, cb)
  
  } else if(arrLike.length !== 'undefined' && arrLike.length == 0) {
  
    return [];
  
  } else if(typeof arrLike == 'object' && arrLike.constructor == Object) {
    
    // const newArrLike = {}
    // for (var k in arrLike) {
    //   if (arrLike.hasOwnProperty(k)) {
    //     newArrLike[k] = cb(k, arrLike[k])
    //   }
    // }
    // return newArrLike

  }
}

export function reduce(arrLike, cb, seed) {

  if(!arrLike) {
    return false
  }

  if(arrLike.length) {
    return Array.prototype.map.reduce(arrLike, cb)
  } else if(arrLike) {
    return Array.prototype.map.reduce([arrLike], cb)
  }
}

export  function extend(){
  for(let i=1; i<arguments.length; i++)
    for(let key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

/**
 *
 * Detect if browser supports transitionend event.
 * 
 * @returns {string|false} The prefixed (or unprefixed) supported event name 
 *                         or false if it doesn't support any.
 *
 */

export function whichTransitionEnd() {

  let transEndEventNames = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }

  for (let name in transEndEventNames) {
    if (document.body.style[name] !== undefined) {
      return transEndEventNames[name];
    }
  }

  return false
}
