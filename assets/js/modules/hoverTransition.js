import { delegateEvent, whichTransitionEnd, selectorMatches } from './utils'

export default function hoverTransition(selector) {

  delegateEvent(document, 'mouseover', selector, e => {
    const { classList } = e.target
    classList.add('is-entering')
  })

  delegateEvent(document, 'mouseout', selector, e => {
    const { classList } = e.target
    classList.remove('is-entering')
    classList.add('is-leaving')
  })

  delegateEvent(document, whichTransitionEnd(), selector, e => {
    const { target, propertyName } = e
    const { classList } = target

    if(propertyName != 'transform') {
      return
    }

    if(selectorMatches(target, ':hover')) {
      classList.remove('is-entering')
    } else {
      classList.remove('is-leaving')
      classList.add('is-resetting')
      setTimeout(() => {
        classList.remove('is-resetting')
      }, 0)
    }
  })

}