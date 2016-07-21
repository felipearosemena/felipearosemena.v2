import * as PubSub from 'pubsub-js'
import { inRange, delegateEvent, scrollY } from '../modules/utils'

const rootEl = document.body
const rootClass = rootEl.classList

const headerViewProto = {
  isOpen: false,
  isCompressed: false,

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
  },

  compressToggle(add = true) {
    rootClass[add ? 'add' : 'remove']('is-compressed')
    PubSub.publish('header-view:compress-toggled', add)
    this.isCompressed = add
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

  window.addEventListener('scroll', (e) => {
    if(view.isCompressed && scrollY() <= 2) {
      view.compressToggle(false)
    } else if(!view.isCompressed && scrollY() > 2) {
      view.compressToggle(true)
    }
  })

  return view

}


export default headerView