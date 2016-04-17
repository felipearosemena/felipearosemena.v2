/** 
*
* Contact
*
*/

import { createStore } from 'redux'
import riot from 'riot'

import { validateField } from '../modules/actions'
import { contactReducer } from '../modules/reducers'
import { delegateEvent, map, filter, extend, createElement, inArray } from '../modules/utils'


// function inputVars(field) {
//   return extend({}, {
//     label: false,
//     id: field.name,
//     options: [],
//     placeholder: '',
//     required: true
//   }, field)

// }

// function selectView(rootEl, field) {

//   let { id, label, name, options, required } = inputVars(field)

//   return componentFactory({
//     rootEl: rootEl,
//     markup(state) {

//       return `
//         <div class="form__group form__group--select">

//           <select id="{ id }" name="{ name }" class="form__control">
//             { map(options, option => `<option value={ option.value }>{ option.label }</option>`) }
//           </select>
//           <label for={ id }>{ label }</label>
//         </div>
//       `
//     }
//   })

// }

// function submitView(label) {
//   return `
//     <div class="form__submit">
//       <button type="submit" class="btn btn--lg form__submit">{ label }</button>
//     </div>
//   `
// }

// function radioView(rootEl, field) {

//   let { id, label, name, options, required } = inputVars(field)

//   return componentFactory({
//     rootEl: rootEl,
//     markup(state) {
//       return `
//         <div class="form__group form__group--radio">
//           <label>{ label }</label>
//           { map(options, (option, i) => `
//               <input class="form__control" id={ id }-{ i } name={ name } type="radio">
//               <label for={ id }-{ i }><span>{ option.label }</span></label>
//           `).join('') }
//         </div>
//       `
//     }
//   })
// }

// }

riot.tag('raw', ``, function() {
  this.root.innerHTML = this.opts.content
})

riot.tag('form-textarea', 
  `
    <textarea name="" id="" cols="30" rows="10"></textarea>
  `
)

riot.tag('form-select', 
  ` 
    <div class="form__group form__group--select">
      <select id="{ opts.name }" name="{ opts.name }" class="form__control">
        <option each="{opts.options}" value="{ value }">{label}</option>
      </select>
      <label for="{ opts.name }">{ opts.label }</label>
    </div>
  `
)

riot.tag('form-radio', 
  `
    <div class="form__group form__group--radio">
      <label>{ opts.label }</label>
      <div class="form__radio-option" each="{ opts.options }">
        <input class="form__control" id="{ id }" name="{ parent.opts.name }" type="radio" value="{ value }">
        <label for="{ id }"><raw content="{ label }" /></label>
      </div>
    </div>
  `
, function() {
  this.opts.options = this.opts.options.map((opt, i) => {
    return {
      ...opt, 
      id: this.opts.name + '-' + i
    }
  })
})

riot.tag('form-input', 
  `
    <div class="form__group form__group--boxed">
      <input id="{ opts.name }" name="{ opts.name }" type="{ opts.type }" placeholder="{ opts.placeholder }" class="form__control" >
      <label for="{ opts.name }">{ opts.label }</label>
    </div>
  `
)

riot.tag('form-control', '', function() {

  const field = this.opts.field
  const tagName = inArray(field.type, ['text', 'email', 'url']) ? 'input' : field.type

  riot.mount(this.root, 'form-' + tagName, field)

})

riot.tag('contact-form', 
  `
    <form>
      <form-control each={fields} field={field}></form-control>
    </form>
  `
, function() {
  this.store = this.opts.store
  this.fields = this.store.getState().fields.map(fieldObj => {
    return {field: fieldObj}
  })
})

// /** 
// *
// * TODO
// *
// * Move input vars declaaration to formControls instantiation step
// *
// */

export default function contactFormView(config) {
  
  const store = createStore(contactReducer, {
    fields: config.fields
  })

  store.subscribe(() => {
    riot.update()
  })

  return riot.mount('contact-form', {
    store: store
  })

}


