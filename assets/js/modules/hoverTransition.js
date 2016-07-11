import hoverIntent from 'hoverintent'
import { map, delegateEvent, whichTransitionEnd, selectorMatches } from './utils'

function setClass(classList, config) {
  window.requestAnimationFrame(() => {
    if(config.remove) {
      classList.remove(config.remove)
    }

    if(config.add) {
      classList.add(config.add)
    }
  })
}

function onMouseOver(e) {
  const { classList } = e.target
  setClass(classList, {
    add: 'is-entering'
  })
}

function onMouseOut(e) {
  const { classList } = e.target
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


export default function hoverTransition(selector) {


  const els = document.querySelectorAll(selector)
  const config = {
    sensitivity: 3,
    interval: 100,
    timeout: 0
  }

  map(els, el => 
    hoverIntent(el, onMouseOver, onMouseOut)
      .options(config)
  )

  delegateEvent(
    document, 
    whichTransitionEnd(), 
    selector, 
    onTransitionEnd
  )

}