import * as PubSub from 'pubsub-js'
import { inRange, delegateEvent } from '../modules/utils'

const rootEl = document.body
const rootClass = rootEl.classList

const headerViewProto = {
  isOpen: false,

  init: (() => {

  })(),

  open() {
    rootClass.add('is-menu-active')
    PubSub.publish('header-view:open')
    this.isOpen = true;
  },
  
  close() {
    rootClass.remove('is-menu-active')
    PubSub.publish('header-view:close')
    this.isOpen = false;
  },

  toggle() {

    if(!this.isOpen) {
      this.open()
    } else {
      this.close()
    }

    PubSub.publish('header-view:toggle')
  }
}

const headerView = (headerEl) => {

  const view = Object.create(headerViewProto)
  const toggleEl = headerEl.querySelector('[data-nav-toggle]')

  if(!headerEl || !toggleEl) {
    return false;
  }

  toggleEl.addEventListener('click',  () => view.toggle())
  
  window.addEventListener('keydown', (e) => {
    if(e.keyCode == 27) {
      view.close()
    }
  })

  return view

}


export default headerView