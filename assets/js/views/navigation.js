import event from '../modules/events'

let navigationProto = {

    init(el) {
        this.el = el
        this.target = document.getElementById(el.dataset.target)
        
        this.el.addEventListener('click', e=>{
            event.trigger('app:navigation-toggle')
        })

        this.target.addEventListener('wheel', e=>{ e.stopPropagation() })

        document.addEventListener('keydown', e=> {
            if(e.keyCode == 27) {
                event.trigger('app:navigation-close')
            }
        })

        event.on('app:navigation-toggle', e=> { 
            [this.el, this.target].forEach(this.toggleNav) 
        })

        event.on('app:navigation-close', e=> { 
            [this.el, this.target].forEach(this.closeNav) 
        })
    },

    toggleNav(el) {
        el.classList.toggle('is-active')
    },

    closeNav(el) {
        el.classList.remove('is-active')
    }
}

export default (el)=> {
    let nav = Object.create(navigationProto)
    return nav.init(el)
}