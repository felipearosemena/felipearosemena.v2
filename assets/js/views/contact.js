/** 
*
* Contact
*
*/

import * as PubSub from 'pubsub-js'
import { createStore } from 'redux'
import { validateField } from '../modules/actions'
import { contactReducer } from '../modules/reducers'
import componentFactory from '../modules/component'
import { delegateEvent, map, filter, extend, createElement, equalsAny } from '../modules/utils'

function inputVars(field) {
  return extend({}, {
    label: false,
    id: field.name,
    options: [],
    placeholder: '',
    required: true
  }, field)

}

function selectView(rootEl, field) {

  let { id, label, name, options, required } = inputVars(field)

  return componentFactory({
    rootEl: rootEl,
    markup(state) {

      return `
        <div class="form__group form__group--select">

          <select id="${ id }" name="${ name }" class="form__control">
            ${ map(options, option => `<option value=${ option.value }>${ option.label }</option>`) }
          </select>
          <label for=${ id }>${ label }</label>
        </div>
      `
    }
  })

}

function submitView(label) {
  return `
    <div class="form__submit">
      <button type="submit" class="btn btn--lg form__submit">${ label }</button>
    </div>
  `
}

function radioView(rootEl, field) {

  let { id, label, name, options, required } = inputVars(field)

  return componentFactory({
    rootEl: rootEl,
    markup(state) {
      return `
        <div class="form__group form__group--radio">
          <label>${ label }</label>
          ${ map(options, (option, i) => `
              <input class="form__control" id=${ id }-${ i } name=${ name } type="radio">
              <label for=${ id }-${ i }><span>${ option.label }</span></label>
          `).join('') }
        </div>
      `
    }
  })
}


function inputView(rootEl, field) {

  let { id, label, type, placeholder, name, required } = inputVars(field)

  return componentFactory({
    rootEl: rootEl,
    markup(state) {
      return `
        <div class="form__group form__group--boxed">
          <input id="${ id }" name="${ name }" type="${ type }" placeholder="${ placeholder }" class="form__control" >
          <label for="${ id }">${ label }</label>
        </div>
      `
    }
  })
}

function formControlView(rootEl, field) {

  if(!field.name) {
    return false;
  }

  if(equalsAny(field.type, ['text', 'email', 'url'])) {
    return inputView(rootEl, field)
  }

  switch(field.type) {
    case 'select' :
      return selectView(rootEl, field)
      break
    case 'textarea' :
      return textareaView(rootEl, field)
      break
    case 'radio' :
      return radioView(rootEl, field)
      break
  } 
}


/** 
*
* TODO
*
* Move input vars declaaration to formControls instantiation step
*
*/

export default function contactFormView(rootEl, config) {
  
  const store = createStore(contactReducer, {
    fields: config.fields
  })

  const formView = componentFactory({

    rootEl: rootEl,
    events: [
      {
        type: ['mousewheel', 'wheel', 'touchmove'],
        handler(e) {
        }
      }
    ],

    markup(state) {

      return `
        <div class="form-rail"> 
          ${ map(state.fields, field => formControlView(rootEl, field))
            .filter(field => field)
            .map(fieldControl => fieldControl.markup())
            .join('') } 
        </div>
      `
    }
  })

  const render = () => {
    const { fields } = store.getState()

    formView.render({
      fields: fields
    })

  }

  return {
    render() {
      store.subscribe(render)
      render()
    }
  }

}


