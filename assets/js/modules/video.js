/** 
*
* Video
*
*/

import { map } from './utils'

export function videoController(videoEl = null) {

  if(!videoEl || !videoEl.play) {
    return false
  }

  let string = '';
  for(var k in Modernizr.video ) {
    string += ' ' + k + '  : ' + Modernizr.video[k] + ';'
  }

  // Set the source for the video elements
  let srcs = map(videoEl.querySelectorAll('source'), sourceEl => {
    
    const match = type => sourceEl.type.match(type)

    if(Modernizr.video.webm && match('webm')) {
      sourceEl.src = sourceEl.dataset.src
    } else if(!Modernizr.video.webm && Modernizr.video.h264 && match('mp4')) {
      sourceEl.src = sourceEl.dataset.src
    }

  })

  return {
    el: videoEl,

    isLoaded: false,

    load() {
      videoEl.load()
      this.isLoaded = true;
    },

    play() {
      if(videoEl.paused) {
        videoEl.play()
      }
    },

    pause() {
      if(!videoEl.paused) {
        videoEl.pause()
      }
    }
  }
}