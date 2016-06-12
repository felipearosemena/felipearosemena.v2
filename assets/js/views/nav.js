import * as PubSub from 'pubsub-js'
import { map, delegateEvent } from '../modules/utils'

const navViewProto = {
  isOpen: false,

  init() {
    this.setStyle()
  },

  setStyle() {
    const bgEls = this.el.querySelectorAll('[data-style]')
    map(bgEls, (el) => {
      if(el.dataset.style) {
        el.setAttribute('style', el.dataset.style)
      }
    })
  }
}

const navView = (navEl) => {

  const view = Object.create(navViewProto)

  if(!navEl) {
    return false;
  }

  view.el = navEl

  return view

}

export default navView