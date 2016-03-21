// import Stats from 'stats-js'
// import THREE from 'three'
// import { recur, vw, vh } from '../modules/utils'
// import '../modules/CanvasRenderer'
// import '../modules/Projector'

// // const stats = new Stats()
// // stats.domElement.style.position = 'fixed'
// // stats.domElement.style.top = '0px'
// // stats.domElement.style.right = '0px'
// // document.body.appendChild(stats.domElement)

const canvasView = () => {
  return {
    render: render
  }
}

// // const config = {
// //   farPlane : 3000,
// //   fogHex : 0xf44747,
// //   fogDensity : 0.0007,
// //   fieldOfView : 75,
// //   aspectRatio : vw() / vh(),
// //   nearPlane : 1,
// // }

// // const parameters = [
// //   {
// //     color: [1, 1, 0.5], 
// //     size: 55
// //   },
// //   {
// //     color: [0.95, 1, 0.5], 
// //     size: 34
// //   },
// //   {
// //     color: [0.90, 1, 0.5], 
// //     size: 21
// //   },
// //   {
// //     color: [0.85, 1, 0.5], 
// //     size: 13
// //   },
// //   {
// //     color: [0.80, 1, 0.5], 
// //     size: 8
// //   },
// // ]

// // const { farPlane, fogHex, fogDensity, fieldOfView, aspectRatio, nearPlane } = config
// // const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
// // const scene = new THREE.Scene()
// // const renderer = new THREE.WebGLRenderer({ alpha: true })
// // const materials = []

// // const mouse = {
// //   x: 0,
// //   y: 0,

// //   update(ex, ey) {
// //     this.x = (ex - vw(0.5))/10
// //     this.y = (ey - vh(0.5))/10
// //   },

// //   init() {
// //     ['mousemove', 'touchstart', 'touchmove'].map((handler) => {
// //       document.addEventListener(handler, (e) => {
// //         // Handle mobile devices
// //         if (e.touches && e.touchs.length === 1) {
// //           this.update(e.touches[0].pageX, e.touches[0].pageY)
// //         } else {
// //           // Then Desktop
// //           this.update(e.clientX, e.clientY)
// //         }
// //       }, false)
// //     })
// //   }
// // }

// // function init() {

// //   mouse.init()

// //   const geometry = new THREE.Geometry()
// //   const container = document.getElementById('hero-canvas')

// //   camera.position.z = farPlane/3
// //   scene.fog = new THREE.FogExp2(fogHex, fogDensity)

// //   let particleCount = 10000 /* Leagues under the sea */

// //   while( particleCount-- ) {
// //     let vertex = new THREE.Vector3()
// //     vertex.x = Math.random() * 2000 - 1000
// //     vertex.y = Math.random() * 2000 - 1000
// //     vertex.z = Math.random() * 2000 - 1000
// //     geometry.vertices.push(vertex)
// //   }

// //   var PI2 = Math.PI * 2;
// //   var material = new THREE.PointsMaterial({

// //     color: 0xffffff,
// //     // program: function ( context ) {

// //     //   context.beginPath();
// //     //   context.arc( 0, 0, 0.5, 0, PI2, true );
// //     //   context.fill();

// //     // }

// //   });

// //   parameters.map((parameter, i) => {

// //     let particles = new THREE.Points(geometry, material)

// //     materials.push(material)

// //     particles.rotation.x = Math.random() * 6
// //     particles.rotation.y = Math.random() * 6
// //     particles.rotation.z = Math.random() * 6

// //     scene.add(particles)

// //   }) /*  Rendererererers particles.  */

// //   renderer.setPixelRatio(window.devicePixelRatio) /* Probably 1 unless you're fancy.  */
// //   renderer.setSize(vw(), vh()) /* Full screen baby Wooooo!  */

// //   container.appendChild(renderer.domElement) /* Let's add all this crazy junk to the page. */

// //   /* Event Listeners */

// //   window.addEventListener('resize', onWindowResize, false)

// // }

// // function animate() {
// //   requestAnimationFrame(animate)
// //   render()
// //   stats.update()
// // }

// // function render() {

// //   let time = Date.now() * 0.00005
// //   let mousePanEase = 0.05
  
// //   camera.position.x += (mouse.x - camera.position.x) * mousePanEase
// //   camera.position.y += (-mouse.y - camera.position.y) * mousePanEase

// //   camera.lookAt(scene.position)

// //   scene.children.map((child, i) => {
// //     if (child instanceof THREE.PointCloud) {
// //       child.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
// //     }
// //   })

// //   renderer.render(scene, camera)
// // }

// // function onWindowResize() {
// //   camera.aspect = vw() / vh()
// //   camera.updateProjectionMatrix()
// //   renderer.setSize(vw(), vh())
// // }

// // init()
// // animate()


const canvas = document.getElementById('hero-canvas')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 )
const renderer = new THREE.CanvasRenderer()
const $ = canvas.getContext('2d')


const w = (ratio = 1) => window.innerWidth * ratio
const h = (ratio = 1) => window.innerHeight * ratio

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const arr = []

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
container.appendChild( renderer.domElement )

const stats = new Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.top = '0px'
container.appendChild( stats.domElement )

const mouse = {
  x: 0,
  y: 0,

  update(ex, ey) {
    this.x = ex
    this.y = ey
  },

  init() {
    ['touchstart', 'touchmove'].map((handler) => {
      document.addEventListener(handler, (e) => {
          this.update(e.touches[0].pageX, e.touches[0].pageY)
      }, false)
    })

    document.addEventListener('mousemove', (e) => {
      this.update(e.clientX, e.clientY)
    }, false)
  }
}

mouse.init()

const vectorProto = {
  move: function() {
    this.x += this.vx
    this.y += this.vy
  },

  draw: function() {
    $.fillStyle = this.color
    $.fillRect(this.x, this.y, this.w, this.h)
  }
}

let done = false

const vectorFactory = function(x, y) {

  return Object.assign(
    Object.create(vectorProto), 
    {
      w: 1,
      h: 1,
      originalX: x,
      originalY: y,
      x: x,
      y: y,
      vx: 0,
      vy: 0
    }
  )

}

const save = function() {
  $.clearRect(0, 0, canvas.width, canvas.height)
}


const mouseMove = function() {
  for (var i in arr) {

    if(i > 2) return

    let vector = arr[i]

    let dx = vector.x - mouse.x
    let dy = vector.y - mouse.y

    let d = Math.sqrt(dx * dx + dy * dy)


    let ang = Math.atan2(dy, dx)

    let tx = mouse.x + Math.cos(ang)
    let ty = mouse.y + Math.sin(ang)

    let ax = (tx - vector.x)
    let ay = (ty - vector.y)

    vector.vx += ax
    vector.vy += ay
  }
}

function init() {

  $.fillStyle = '#ffffff'

  $.beginPath();
  $.arc(w(0.5), h(0.5), 10, 0, Math.PI*2, true); 
  $.closePath();
  $.fill();

  const p = $.getImageData(0, 0, w(), h())

  let pt = 0

  for(var i = 0; i < canvas.height; i++) {
    for(var j = 0; j < canvas.width; j++) {

      var r = p.data[pt];

      if (r !== 0) {
        var e = p.data[pt + 1];
        var b = p.data[pt + 2];
        var a = p.data[pt + 3];
        var vector = vectorFactory(j, i);
        arr.push(vector);
      }
      pt += 4;
    }
  }

  save();

}

function render() {

  save()
  mouseMove()

  for(var i in arr) {
    arr[i].move()
    arr[i].draw()
  }
  for (var i in arr) {
    u -= .5;
    if (!ms) return;

    var _px = arr[i];

    var dx = _px.x - ms.x;
    var dy = _px.y - ms.y;

    var d = Math.sqrt(dx * dx + dy * dy);
    var minD = _px.w + _off;

    if (d < minD) {
      var ang = Math.atan2(dy, dx);

      var tx = ms.x + Math.cos(ang) * minD;
      var ty = ms.y + Math.sin(ang) * minD;

      var ax = (tx - _px.x) * _spr;
      var ay = (ty - _px.y) * _spr;

      _px.vx += ax;
      _px.vy += ay;
    };

}


init()
animate()

function animate() {

  requestAnimationFrame( animate );

  setTimeout(animate, 1000)
  render()
  stats.update()

}

export default canvasView