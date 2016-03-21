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