import mouseEvent from './mouse-event'
import _ from 'lodash'

function mouseTracker(options) {

  let mousePosition = {
    ratioX : 0,
    ratioY : 0,
    x: 0,
    y: 0,
    diagonalRatio: function() {
      return (this.ratioY + this.ratioX)/2
    }
  }

  let init = false

  window.addEventListener('mousemove', e =>{
    
    if(!init) {
      options.onInit()
      init = true
    }

    _.extend(mousePosition, {
      ratioX : e.clientX / window.innerWidth,
      ratioY :e.clientY / window.innerHeight,
      x: e.clientX,
      y: e.clientY
    })

  })   

  let initialEvent = mouseEvent.create('mousemove',0,0,0,0)
  mouseEvent.dispatch(document, initialEvent)

  return () => { 
    return mousePosition
  }
}

export default mouseTracker