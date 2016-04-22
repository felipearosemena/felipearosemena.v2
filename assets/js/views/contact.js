/** 
*
* Contact
*
*/

import { createStore } from 'redux'
import riot from 'riot'
import request from 'superagent'

import { validateField } from '../modules/actions'
import { contactReducer } from '../modules/reducers'
import { delegateEvent, map, filter, extend, createElement, inArray } from '../modules/utils'

riot.tag('raw', ``, function() {
  this.root.innerHTML = this.opts.content
})

riot.tag('form-textarea', 
  `
    <textarea name="{ opts.name }" id="{ opts.name }" class="form__control" rows="8"></textarea>
    <label for="{ opts.name }">{ opts.label }</label>
  `
)

riot.tag('form-select', 
  ` 
    <select id="{ opts.name }" name="{ opts.name }" class="form__control" onfocus="{ focus }" onblur="{ blur }">
      <option each="{opts.options}" value="{ value }">{label}</option>
    </select>
    <label for="{ opts.name }">{ opts.label }</label>
  `
, function() {
  this.focus = (e) => {
    e.target.parentNode.classList.add('is-focused')
  }

  this.blur = (e) => {
    e.target.parentNode.classList.remove('is-focused')
  }
})

riot.tag('form-radio', 
  `
    <label>{ opts.label }</label>
    <div class="form__radio-option" each="{ opts.options }">
      <input class="form__control" id="{ id }" name="{ parent.opts.name }" type="radio" value="{ value }">
      <label for="{ id }"><raw content="{ label }" /></label>
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
    <input id="{ opts.name }" name="{ opts.name }" type="{ opts.type }" placeholder="{ opts.placeholder }" class="form__control" >
    <label for="{ opts.name }">{ opts.label }</label>
  `
)

riot.tag('form-control', '', function() {

  const field = this.opts.field
  const tagName = inArray(field.type, ['text', 'email', 'url']) ? 'input' : field.type

  riot.mount(this.root, 'form-' + tagName, field)

})

riot.tag('contact-form', 
  `
    <form action="{ window.location.pathname }" onsubmit="{ submit }">
      <form-control each={fields} field={field} class="form__group form__group--{ formControlClass }"></form-control>
      <div class="text-right">
        <button class="btn" type=submit>Send</button>
      </div>
    </form>
  `
, function() {

  const { store, postConfig } = this.opts

  this.fields = store.getState().fields.map(fieldObj => {
    const formControlClass = inArray(fieldObj.type, ['radio', 'select']) ? fieldObj.type : 'boxed'
    return {
      field: fieldObj,
      formControlClass: formControlClass
    }
  })

  this.submit = (e) => {
    e.preventDefault()

    request
      .post(postConfig.url)
      .type('form')
      .send({
        action: 'submit_contact_form',
        nonce: postConfig.nonce,
      })
      .end((err,res) => {
        console.log(res)
      })
  }
})

export default function contactFormView(config) {
  
  const store = createStore(contactReducer, {
    fields: config.fields
  })

  store.subscribe(() => {
    riot.update()
  })

  return riot.mount('contact-form', {
    store: store,
    postConfig: {
      url: config.postUrl,
      nonce: config.nonce,
      action: config.postAction
    }
  })

}


