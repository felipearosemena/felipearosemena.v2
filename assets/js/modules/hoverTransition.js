import hoverIntent from 'hoverintent'
import { map, delegateEvent, bubble, whichTransitionEnd, selectorMatches, debounce } from './utils'

function setClass(classList, config) {
  window.requestAnimationFrame(() => {
    map(config, method => classList[method](config[method]))
  })
}

function beforeMouseOver(classList) {
  setClass(classList, {
    add: 'is-resetting'
  })

  document.offsetWidth

  setClass(classList, {
    remove: 'is-resetting'
  })
}

function onMouseOver(classList) {
  setClass(classList, {
    add: 'is-entering'
  })
}

function onMouseOut(classList) {
  setClass(classList, {
    remove: 'is-entering',
    add: 'is-leaving'
  })
}

function onTransitionEnd(e) {
  const { target, propertyName } = e
  const { classList } = target

  if(propertyName != 'transform') {
    return
  }

  if(!selectorMatches(target, ':hover')) {
    
    setClass(classList, {
      remove: 'is-leaving',
      add: 'is-resetting'
    })

    setTimeout(() => {
      setClass(classList, {
        remove: 'is-resetting'
      })
    }, 0)
  }
}

export default function hoverTransition(selector, delegate = false) {

  const els = document.querySelectorAll(selector)

  const config = {
    sensitivity: 2,
    interval: 50,
    timeout: 0
  }

  const target = (el) => el.querySelector(delegate) || el

  delegateEvent( document, whichTransitionEnd(), delegate || selector, onTransitionEnd )

  map(els, el => {
    
    const { classList } = target(el)

    el.addEventListener('mouseenter', e => beforeMouseOver(classList))

    hoverIntent(el, 
      e => onMouseOver(classList),
      e => onMouseOut(classList)
    ) .options(config)
  })


}