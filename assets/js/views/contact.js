/** 
*
* Contact
*
*/

// import IScroll from 'iscroll'
// import mouseEvent from '../modules/mouse-event'
import * as PubSub from 'pubsub-js'
import { delegateEvent, map, filter, extend } from '../modules/utils'

// function formControlView() {
//   `<div class="form__group form__group--select">
//     <label for="field-2">Hello! I'm reaching out because:</label>
//     <select id="field-2" name="field-2" class="form__control">
//       <option value="option1">I'd like to hire you</option>
//       <option value="option2">I have an idea I would want to share with you</option>
//       <option value="option3">Just looking to connect</option>
//     </select>
//   </div>

//   <div class="form__group form__group--boxed">
//     <label for="field-1">What's your email?</label>
//     <input id="field-1" name="field-1" type="text" placeholder="Field 1" class="form__control" >
//   </div>

//   <div class="form__group form__group--boxed">
//     <label for="field-3">Field 1</label>
//     <input id="field-3" name="field-3" type="text" placeholder="Field 1" class="form__control">
//   </div>

//   <div class="form__group form__group--boxed">
//     <label for="field-4">Field 1</label>
//     <input id="field-4" name="field-4" type="text" placeholder="Field 1" class="form__control">
//   </div>

//   <div class="form__group form__group--boxed">
//     <label for="field-5">Field 1</label>
//     <input id="field-5" name="field-5" type="text" placeholder="Field 1" class="form__control">
//   </div>

//   <div class="form__group form__group--boxed">
//     <label for="field-1">Field 1</label>
//     <input id="field-1" name="field-1" type="text" placeholder="Field 1" class="form__control">
//   </div>`
// }

function optionView(option) {
  console.log(option)
  return `<option value="${ option.value }">${ option.label }</option>`
}

function labelView(label, id) {
  return `<label for="${ id }">${ label }</label>`
}

function inputVars(config, defaults) {
  return extend({}, defaults, config)
}

function selectView(config) {

  let { id, label, name, options } = inputVars(config, {
    label: false,
    id: config.name,
    options: []
  })

  return `
    <div class="form__group form__group--select">
      ${ labelView(label, id) }

      <select id="${ id }" name="${ name }" class="form__control">
        ${ map(options, optionView) }
      </select>
    </div>
  `
}

function inputView(config) {

  let { id, label, type, placeholder, name } = inputVars(config, {
    placeholder: '',
    label: false,
    id: config.name
  })

  return `
    <div class="form__group form__group--boxed">
      ${ labelView(label, id) }
      <input id="${ id }" name="${ name }" type="${ type }" placeholder="${ placeholder }" class="form__control" >
    </div>
  `
}

function formControlView(field) {

  if(!field.name) {
    return false;
  }

  switch(field.type) {
    case 'select':
      return selectView(field)
      break
    case 'text':
      return inputView(field)
      break
    default:
      return false
  } 
}

function submitView(label) {
  return `
    <p class="text-center">
      <button type="submit" class="btn btn--lg form__submit">${ label }</button>
    </p>
  `
}

/** 
*
* TODO
*
* Move input vars declaaration to formControls instantiation step
*
*/
export default function contactFormView(formEl,  config) {

  const { fields, submit } = config


  // array of form controls
  const formControls = map(fields, field => formControlView(field))
                         .filter(field => field)

  // Submit for validation
  formEl.addEventListener('submit', (e) => {
    validate(formEl, formControls)
  })

  return {
    render() {
      formEl.innerHTML = formControls.join('') + submitView('Send')
    }
  }


}