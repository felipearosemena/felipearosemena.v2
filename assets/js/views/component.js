
import riot from 'riot'
import { createStore } from 'redux'

import { addItem, removeItem, toggleActive, toggleActiveAll, toggleAll } from '../modules/actions'
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
    },

    {
      title: 'Some Titles',
      isActive: false
    },

    {
      title: 'Second Title',
      isActive: false
    },

    {
      title: 'Some Titles',
      isActive: false
    },

    {
      title: 'Second Title',
      isActive: false
    },

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

//     events: [
//       {
//         type: 'click',
//         selector: '[toggle-active]',
//         handler(e) {
//       store.dispatch(toggleActive(e.target.id))

//           store
//         }
//       }
//     ],

//     onToggleActive() {
//       store.dispatch(toggleActive(e.target.id))
//     },

//     render(state) {

//       console.log(this.onToggleActive)

//       return `

//         <ul id="list-view-1">
//           <div class="list-controls">
//             <b>component.js</b>
//             <h2>${ state.items.length } rows created</h2>
            
//             ${ controls.markup(state) }
//           </div>

//           ${ mapJoin(state.items, (item, i) =>
//             ` 
//               <li id=${ i } class="${ item.isActive ? 'is-active' : '' }" onClick="" toggle-active> 
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

// const controls = componentFactory({
//   events: [
//     {
//       type: 'click',
//       selector: '#add',
//       handler() {
//         store.dispatch(addItem())
//       }
//     },

//     {
//       type: 'click',
//       selector: '#remove',
//       handler() {
//         store.dispatch(removeItem())
//       }
//     },

//     {
//       type: 'click',
//       selector: '#toggle',
//       handler(e) {
//         store.dispatch(toggleAll())
//       }
//     }
//   ],

//   render(state) {

//     return `
//       <p class="text-center">
//         <button id=add class="btn btn--secondary" add-item>Add</button> 
//         <button id=remove class="btn btn--primary" remove-item>Remove</button>
//         <button id=toggle class="btn btn--tertiary" toggle-all>Release the hounds</button>
//       </p>
//     `
//   }
// })

// const list = componentFactory({

//   // events: [
//   //   {
//   //     type: 'click',
//   //     selector: '[toggle-active]',
//   //     handler(e) {
//   //       store.dispatch(toggleActive(e.target.id))
//   //     }
//   //   }
//   // ],

//   onToggleActive() {
//     store.dispatch(toggleActive(e.target.id))
//   },

//   onTitleClick() {

//   },

//   render() {

//     return `

//       <ul id="list-view-1">
//         <div class="list-controls">
//           <h2 onclick=onTitleClick>${ this.props.items.length } rows created</h2>
//         </div>

//         ${ this.nest(controls, {
//           title: 'Some Title'
//         }) }
        
//         ${ mapJoin(state.items, (item, i) =>
//           ` 
//             <li id=${ i } class="${ item.isActive ? 'is-active' : '' }" onClick="" toggle-active> 
//               ${ item.title } 
              
//               <small class="color-primary">
//                 ${ item.isActive ? 'Yeap' : 'Noup'}
//               </small>
//             </li>
//           `
//         )}

//       </ul>

//     `
//   }

// })

riot.tag('todo-controls', 
  `
    <p class="text-center">
      <button class="btn btn--secondary" onclick="{ add }">Add</button> 
      <button class="btn btn--primary" onclick="{ remove }">Remove</button>
      <button class="btn btn--tertiary" onclick="{ toggle }">Release the hounds</button>
    </p>
  `
, function() {
  this.add = () => store.dispatch(addItem())
  this.remove = () => store.dispatch(removeItem())
  this.toggle = () => store.dispatch(toggleAll())
})

riot.tag('todo-item', 
  `
    <li onclick="{ toggle }" class="{ isActive ? 'is-active' : ''}">
      <small>{ isActive ? 'Yeap' : 'Noup'}</small>
      { title }
    </li>
  `
, function() {
  this.toggle = (e) => {
    let i = this.items.indexOf(e.item)
    store.dispatch(toggleActive(i))
  }
})

riot.tag('todo-list', 
  `
    <todo-controls></todo-controls>
    <ul>
      <todo-item each={items} item={this}></todo-item>
    </ul>

  `
, function() {
  this.message = 'Hello World'
  this.on('update', () => {
    this.items = this.opts.store.getState().items
  })
})

riot.mount('todo-list', {
  store: store
})

store.subscribe(() => {
  riot.update()
})