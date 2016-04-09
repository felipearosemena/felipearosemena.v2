import * as PubSub from 'pubsub-js'
import page from 'page'

import { map, reduce } from './modules/utils'
import { classList, dataset, vu } from './modules/polyfills'

import { videoController } from './modules/video'
import pageSections from './views/pageSections'
import headerView from './views/header'
import navView from './views/nav'
import contactFormView from './views/contact'

// Polyfills
classList()
dataset()
vu()

const sections = document.querySelectorAll('[data-scroll-section]')
const sectionViews = pageSections(sections);

map(sections, (section) => {

  const player = videoController(section.querySelector('[data-video-player]'))
  const images = section.querySelectorAll('img')

  if(player) {
    section.player = player
  }

})

function handleSection(eventName, sectionView) {

  let { isInView, el} = sectionView
  let { images, player } = el

  if(player) {
    if(isInView) {
      if(!player.isLoaded) {
        player.load()
      }

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
  const formFields = data.formFields.length ? data.formFields : [0]
  const contactForm = contactFormView(document.getElementById('contact-form'), {
    fields: formFields
  })

  contactForm.render()
})

page({
  click: false,
  popstate: false
})

// page.show(location.pathname)

