import mouseTracker from '../modules/mouse-tracker' 

const mouse = mouseTracker()

const tileImageView = (el) => {

}

const tileBgView = (el) => {
 
}

const tileView = (el) => {
    
 let init = false
 el.style.color = el.getAttribute('data-color')
 el.addEventListener('mouseover',(e)=>{
   
   if(!init) {
     el.className += ' is-active'
     init = true
   }

 })
}

export default tileView 