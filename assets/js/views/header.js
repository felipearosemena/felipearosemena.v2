import * as PubSub from 'pubsub-js'
import { inRange, delegateEvent, whichTransitionEnd } from '../modules/utils'

const rootEl = document.body
const rootClass = rootEl.classList

const headerViewProto = {
  isOpen: false,

  open() {
    rootClass.add('is-menu-active')
    PubSub.publish('header-view:open')
    this.isOpen = true;
  },
  
  close() {

    console.log('closing')

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
  const toggleEl = document.querySelector('[data-nav-toggle]')
  const closeEl = document.querySelector('[data-nav-close]')

  if(!headerEl || !toggleEl) {
    return false;
  }

  toggleEl.addEventListener('click', e => { e.preventDefault(); view.toggle() })
  closeEl.addEventListener('click', () => view.close())
  
  window.addEventListener('keydown', (e) => {
    if(e.keyCode == 27) {
      view.close()
    }
  })

  return view

}


export default headerView