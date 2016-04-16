
import { createStore } from 'redux'
import componentFactory from '../modules/component'
import { addItem, removeItem, toggleActive, toggleActiveAll, toggleAll } from '../modules/actions'
import { componentReducer } from '../modules/reducers'
import { map, mapJoin, extend, delegateEvent } from '../modules/utils'

// const store = createStore(componentReducer, {
//   items: [
//     {
//       title: 'Some Titles',
//       isActive: false
//     },

//     {
//       title: 'Second Title',
//       isActive: false
//     },

//     {
//       title: 'Some Titles',
//       isActive: false
//     },

//     {
//       title: 'Second Title',
//       isActive: false
//     },

//     {
//       title: 'Some Titles',
//       isActive: false
//     },

//     {
//       title: 'Second Title',
//       isActive: false
//     },

//     {
//       title: 'Some Titles',
//       isActive: false
//     },

//     {
//       title: 'Second Title',
//       isActive: false
//     }
//   ],

// })

// function listControlsView(rootEl) {
//   let component =  componentFactory({
//     rootEl: rootEl,
//     events: [
//       {
//         type: 'click',
//         selector: '#add',
//         handler() {
//           store.dispatch(addItem())
//         }
//       },

//       {
//         type: 'click',
//         selector: '#remove',
//         handler() {
//           store.dispatch(removeItem())
//         }
//       },

//       {
//         type: 'click',
//         selector: '#toggle',
//         handler(e) {
//           store.dispatch(toggleAll())
//         }
//       }
//     ],
//     markup(state) {
//       return `
//         <p class="text-center">
//           <button id=add class="btn btn--secondary" add-item>Add</button> 
//           <button id=remove class="btn btn--primary" remove-item>Remove</button>
//           <button id=toggle class="btn btn--tertiary" toggle-all>Release the hounds</button>
//         </p>
//       `
//     }
//   })

//   return component
// }

/** 
*
* TODO: 
*
* Scope component events to component
*
*/

// function listView(rootEl) {

//   const controls = listControlsView(rootEl)

//   return componentFactory({

//     rootEl: rootEl,

//     // events: [
//     //   {
//     //     type: 'click',
//     //     selector: '[toggle-active]',
//     //     handler(e) {
//       // store.dispatch(toggleActive(e.target.id))

//     //       store
//     //     }
//     //   }
//     // ],

//     onToggleActive() {
//       store.dispatch(toggleActive(e.target.id))
//     },

//     markup(state) {

//       return `

//         <ul id="list-view-1">
//           <div class="list-controls">
//             <b>component.js</b>
//             <h2>${ state.items.length } rows created</h2>
            
//             ${ controls.markup(state) }
//           </div>

//           ${ mapJoin(state.items, (item, i) =>
//             ` 
//               <li id=${ i } class="${ item.isActive ? 'is-active' : '' }" onClick=check(${this}) toggle-active> 
//                 ${ item.title } 
                
//                 <small class="color-primary">
//                   ${ item.isActive ? 'Yeap' : 'Noup'}
//                 </small>
//               </li>
//             `

//           )}

//         </ul>
//       `
//     }
//   })

// }

// const list = listView(document.querySelector('#page-content'))

// const render = () => {

//   const { items } = store.getState()

//   list.render({
//     items: items
//   })

// }

// store.subscribe(render)
// render()