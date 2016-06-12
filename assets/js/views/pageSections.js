/** 
*
* Page Sections
*
*/

import * as PubSub from 'pubsub-js'
import { map } from '../modules/utils'

const emitter = (el, eventName) => {

  let event = false

  if(typeof el == 'object') {
    el.addEventListener(eventName, (e)=> {
      PubSub.publish(eventName, e)
    })
  }

}

let em = emitter(window, 'scroll')

const pageSectionsProto = {

}

const scrollSubscription = (callback) => {
  return PubSub.subscribe('scroll', (eventName, e) => {
    if(typeof callback == 'function') {
      callback(e)
    }
  })
}

function requestAnimation(cb) {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(cb)
  }
}

function elementInViewport(top, height) {
  let { scrollY, innerHeight} = window
  return (scrollY - height < top) && (scrollY + innerHeight > top)
}

function getOffsetTop( el ) {
  let top = 0

  while( el = el.offsetParent ) {
    if ( !isNaN( el.offsetTop ) ) {
      top += el.offsetTop
    }
  }

  return top
}

function elementOffset(el) {

  let top, height, rect
  let parent = el.parentElement
  
  let update = () => {
    // top = getOffsetTop(el),
    height = el.offsetHeight
  }

  window.addEventListener('resize', update)
  window.addEventListener('load', update)

  update()

  return {
    height: height,
  }
}

function sectionView(section, cb) {

  let x = 0
  let y = window.scrollY*0.2 + 'px'
  let offset = elementOffset(section)
  let { classList } = section
  let cf = {
    offset: 0
  }

  return {

    el: section,

    isInView: false,

    set(k, v) {
      cf[k] = v

      return this
    },

    render() {

      let rect = section.getBoundingClientRect()
      let pub = (eventName) => {
        PubSub.publish(eventName, this)
      }

      this.isInView = (0 > rect.top - innerHeight + parseInt(cf.offset))

      if(this.isInView) {
        classList.remove('is-out')
        pub('section-view:enter')
      } else if(!this.isInView && !classList.contains('is-out')) {
        classList.add('is-out')
        pub('section-view:leave')
      }


      return this
    }
  }

}


/** 
*
* Single Project View
*
*/

export default function pageSections(sectionEls) {

  let sectionViews = map(sectionEls, (section) => {
    return sectionView(section)
      .set('offset', section.dataset.offset || 50)
  })


  let subscriptionID = scrollSubscription((e) => {
    sectionViews.map(view => view.render())
  })

  return sectionViews

}