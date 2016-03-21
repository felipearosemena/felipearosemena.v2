import * as PubSub from 'pubsub-js'
import { selectorMatches } from './modules/utils'
import { classList, dataset, vu } from './modules/polyfills'


// import Router from './modules/router'
import { videoController } from './modules/video'
import pageSections from './views/pageSections'
import headerView from './views/header'
// import tileView from './views/tiles'
import { map, reduce } from 'lodash'

// Polyfills
classList()
dataset()
vu()

const sections = document.querySelectorAll('[data-scroll-section]')
const sectionViews = pageSections(sections);

map(sections, (section) => {
  const player = videoController(section.querySelector('[data-video-player]'))
  const images = section.querySelectorAll('img')

  // section.images = map(images.length ? images : [], (image) => {
  //   return {

  //     isInitialized: false,

  //     load() {

  //       if(!this.isInitialized) {
  //         image.src = image.dataset.src
  //         image.srcSet = image.dataset.srcSet
  //         this.isInitialized = true
  //       }
  //     }
  //   }
  // })

  if(player) {
    section.player = player
  }
})

function handleSection(eventName, sectionView) {

  let { isInView, el} = sectionView
  let { images, player } = el

  if(isInView) {
    map(images, (image) => {
      image.load()
    })
  }

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



PubSub.subscribe(('section-view:enter'), handleSection)
PubSub.subscribe(('section-view:leave'), handleSection)

const header = headerView(document.getElementById('site-header'))

