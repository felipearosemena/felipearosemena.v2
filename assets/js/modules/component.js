import * as diff from 'diffhtml'
import { map, extend, delegateEvent } from '../modules/utils'

export default function componentFactory(config) {

  const component = extend({}, config, { 

    render(state) {
      const markup = this.markup(state)
      diff.innerHTML(this.rootEl, markup)
    }

  })

  map(component.events, (eventConfig) => {

    const opts = extend({}, {
      type: '',
      selector: '',
      handler(){}
    }, eventConfig)

    const selector = '[' + opts.selector.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ']'

    delegateEvent(component.rootEl, opts.type, selector, opts.handler)
  
  })

  return component
}