/** 
*
* Video
*
*/

import { map } from 'lodash'

export function videoController(videoEl = null) {

  if(!videoEl || !videoEl.play) {
    return false
  }

  let srcs = map(videoEl.querySelectorAll('source'), sourceEl => {
    sourceEl.src = sourceEl.dataset.src
  })

  return {
    el: videoEl,

    isLoaded: false,

    load() {
      videoEl.load()
      this.isLoaded = true;
    },

    play() {
      videoEl.play()
    },

    pause() {
      videoEl.pause()
    },

    togglePlay() {
      if(videoEl.paused) {
        videoEl.play()
      } else {
        videoEl.pause()
      }
    } 
  }
}