
import { createStore } from 'redux'
import componentFactory from '../modules/component'
import { addItem, removeItem, toggleActive } from '../modules/actions'
import { componentReducer } from '../modules/reducers'
import { map, mapJoin, extend, delegateEvent } from '../modules/utils'

const store = createStore(componentReducer, {
  items: [
    {
      title: 'Some Titles',
      isActive: false
    },

    {
      title: 'Second Title',
      isActive: false
    }
  ],

})

function listControlsView(rootEl) {
  return componentFactory({
    rootEl: rootEl,
    events: [
      {
        type: 'click',
        selector: 'addItem',
        handler() {
          store.dispatch(addItem())
        }
      },

      {
        type: 'click',
        selector: 'removeItem',
        handler() {
          store.dispatch(removeItem())
        }
      },
    ],
    markup(state) {
      return `<button add-item>Add</button> <button remove-item>Remove</button>`
    }
  })
}

/** 
*
* TODO: 
*
* Scope component events to component
*
*/

function listView(rootEl) {

  const controls = listControlsView(rootEl)

  return componentFactory({

    rootEl: rootEl,
    events: [
      {
        type: 'click',
        selector: 'toggleActive',
        handler(e) {
          store.dispatch(toggleActive(e.target.id))
        }
      }
    ],

    markup(state) {
      return `
        <ul class="hero" id="list-view-1">

          ${ controls.markup(state) }

          ${ mapJoin(state.items, (item, i) =>
            `<li id=${ i } class="${ item.isActive ? 'is-active' : '' }" toggle-active> ${ item.title } </li>`) 
          }
        </ul>
      `
    }
  })

}

const list = listView(document.querySelector('#page-content'))

const render = () => {

  const { items } = store.getState()

  list.render({
    items: items
  })

}

store.subscribe(render)
render()