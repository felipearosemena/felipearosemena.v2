import * as PubSub from 'pubsub-js'
import page from 'page'
import riot from 'riot'

import { map, reduce, isMobile, delegateEvent } from './modules/utils'
import { classList, dataset, vu } from './modules/polyfills'

import { videoController } from './modules/video'
import hoverTransition from './modules/hoverTransition'

import pageSections from './views/pageSections'
import headerView from './views/header'
import navView from './views/nav'
import contactFormView from './views/contact'
import canvasView from './views/canvas'

// Polyfills
classList()
dataset()
vu()


// Click listener for internal links
// For fading out the current page
// New pages fade in through CSS3 animation, instead of transition
delegateEvent(document, 'click', '[href*="' + window.location.host + '"]', e => {
  e.preventDefault();
  document.body.classList.add('is-transiting')
  setTimeout(() => {
    window.location = e.target.href
  }, 50)
})

// Handle showing the page again when hitting 
// the back button (IOS, Safari)
window.onpageshow = e => e.persisted ? 
  document.body.classList.remove('is-transiting') : null

const sections = document.querySelectorAll('[data-scroll-section]')
const sectionViews = pageSections(sections)

map(sections, (section) => {

  const player = videoController(section.querySelector('[data-video-player]'))
  const images = section.querySelectorAll('img')

  if(player) {
    section.player = player
  }

})

map(document.querySelectorAll('.btn'), button => {
  button.title = button.title || button.innerText
})

function handleSection(eventName, sectionView) {

  let { isInView, el} = sectionView
  let { images, player } = el

  if(!player) {
    return
  }

  if(isInView && !player.isLoaded) {
    player.load()
  }

  if(isMobile()) {
    return
  }

  if(player) {
    if(isInView) {
      player.play()

    } else {
      player.pause()
    }
  }

}

const header = headerView(document.getElementById('site-header'))
const nav = navView(document.getElementById('navigation'))

PubSub.subscribe(('section-view:enter'), handleSection)
PubSub.subscribe(('section-view:leave'), handleSection)
PubSub.subscribe(('header-view:open'), ()=> {
  nav.init()
})

page('/contact', () => {

  if(!window.data.gf_contact_form) {
    return
  }

  const { url, nonce, fieldPrefix } = window.FA_AJAX ? window.FA_AJAX : {
    url: '/',
    nonce: false
  }

  contactFormView({
    nonce: nonce,
    postUrl: url,
    postAction: 'submit_contact_form',
    fieldPrefix: fieldPrefix,
    gf_form: window.data.gf_contact_form
  })

})

page({
  click: false,
  popstate: false
})

hoverTransition('.btn')


