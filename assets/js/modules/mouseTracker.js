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

  window.addEventListener('mousemove', e =>{

    _.extend(mousePosition, {
      ratioX : e.clientX / window.innerWidth,
      ratioY :e.clientY / window.innerHeight,
      x: e.clientX,
      y: e.clientY
    })

  })

  return () => { 
    return mousePosition
  }
}

export default mouseTracker