import * as diff from 'diffhtml'
import * as PubSub from 'pubsub-js'
import { map, extend, delegateEvent } from '../modules/utils'

export default function componentFactory(config) {

  const component = extend({}, config, { 

    render(state) {
      const markup = this.markup(state)

      if(this.rootEl) {
        diff.innerHTML(this.rootEl, markup)
      }
    }

  })


  /** 
  *
  * Attach component's events
  *
  */

  // map(component.events, (eConfig) => {

  //   const { selector, type, handler} = extend({}, (() => {

  //     return { 
  //       type: '',
  //       selector: false,
  //       handler(){}
  //     }

  //   })(), eConfig)

  //   const events = typeof type == 'string' ? [type] : type.length ? type : []

  //   events.map(event => {

  //     if(selector){
  //       delegateEvent(
  //         component.rootEl, 
  //         type, 
  //         selector, 
  //         handler
  //       )
  //     } else if(component.rootEl) {
  //       component.rootEl.addEventListener(type, handler)
  //     }

  //   })

  
  // })

  return component
}