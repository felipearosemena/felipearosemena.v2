/** 
*
* Contact
*
*/

import $ from 'jquery'

import { createStore } from 'redux'
import riot from 'riot'
import request from 'superagent'

import { inputChange, formResponse, formSubmitted, inputValidate } from '../modules/actions'
import { contactReducer } from '../modules/reducers'
import { delegateEvent, map, filter, extend, createElement, inArray } from '../modules/utils'

const formControlCommon = () => {
  return `
    <label for="{opts.name}">
      { opts.label }
    </label>

    <validation if="{ hasError }"  message="{ opts.errorMessage }" class="val-error"></validation>
  `
}

const formControlCommonAtts = () => {
  return `
    id="{ opts.name }" 
    name="{ opts.name }"
    type="{ opts.type }"
    placeholder="{ opts.placeholder }"
    class="form__control"
  `
}

riot.tag('raw', `{ root.innerHTML = opts.content }`)

riot.tag('validation', `{ message }`, function() {
  this.message = this.opts.message
})

riot.tag('form-textarea', 
  `
    ${formControlCommon()}
    <textarea ${formControlCommonAtts()} rows="8"></textarea>
  `
)

riot.tag('form-select', 
  ` 
    ${formControlCommon()}
    <select ${formControlCommonAtts()}>
      <option each="{ opts.choices }" value="{ value }">{ text }</option>
    </select>
  `
)

riot.tag('form-radio', 
  `
    ${formControlCommon()}
    <div class="form__radio-option" each="{ choice, i in opts.choices }">
      <input class="form__control" id="{ parent.opts.name + i }" name="{ parent.opts.name }" type="{ parent.opts.type }">
      <label for="{ parent.opts.name + i }">
        <raw content="{ choice.text }"></raw>
      </label>
    </div>
  `
)

riot.tag('form-input', 
  `
    ${formControlCommon()}
    <input ${formControlCommonAtts()}>
  `
)

riot.tag('form-control', '', function() {

  const { field, store } = this.opts
  const { fieldPrefix } = store.getState()
  const tagName = inArray(field.type, ['text', 'email', 'url']) ? 'input' : field.type
  const cl = this.root.classList;

  field.name = fieldPrefix + field.id

  const input = riot.mount(this.root, 'form-' + tagName, field)[0]

  this.on('update', () => {
    this.isVisible = true
    this.field = filter(store.getState().fields, f => f.id == this.field.id)[0]
    input.update(this.field)
  })

  const inputs = this.root.querySelectorAll('.form__control')

  map(inputs, input => {

    input.addEventListener('focus', e => cl.add('is-focused'))
    input.addEventListener('blur', e => {
      cl.remove('is-focused')
      store.dispatch(inputValidate(field, input.checkValidity()))
    })

    input.addEventListener('change', e => store.dispatch(inputChange(field, input.value)))
  })

})

riot.tag('contact-form', 
  `
    <div if="{http_err}">{ http_err }</div>

    
    <form class="{isProcessing ? 'is-processing' : ''} {successMessage ? 'is-succesful' : ''}" onsubmit="{ submit }">
      <form-control each={fields} if={isVisible} store={parent.opts.store} field={field} class="form__group form__group--{ formControlClass }"></form-control>
      
      <raw class="form__validation-message { successMessage ? 'is-active' : '' }" content="{successMessage}"></raw>
      
      <div if={!successMessage} class="mb-3 text-right">
        <button class="btn btn--secondary" type=submit title=Send >Send</button>
      </div>
    </form>
  `
, function() {

  const { store } = this.opts
  const { postConfig } = store.getState()


  /** 
  *
  * TODO
  *
  * Prevent Form Submitting multiple times
  *
  */

  this.submit = (e) => {
    e.preventDefault()

    if(this.successMessage) {
      return;
    }

    store.dispatch(formSubmitted())

    const formData = new FormData(e.currentTarget)

    formData.append('form_id', store.getState().form_id)
    formData.append('action', 'submit_contact_form')
    formData.append('nonce', postConfig.nonce)

    /** 
    *
    * TODO
    *
    * Dispatch before submit event
    *
    */

    request
      .post(postConfig.url)
      .send(formData)
      .end((err,res) => {
        setTimeout(() => {
          store.dispatch(formResponse(res, err))
        }, 1000)
      })
  }

  const {fields} = store.getState()
  
  this.fields = fields.map(fieldObj => {
    const formControlClass = inArray(fieldObj.type, ['radio', 'select']) ? fieldObj.type : 'boxed'

    return {
      field: fieldObj,
      formControlClass: formControlClass
    }

  })

  this.on('update', () => {

    const {http_res, http_err, isProcessing } = store.getState()

    this.isProcessing = isProcessing

    if(!http_err && http_res) {
      const text = http_res ? JSON.parse(http_res.text) : {}

      this.successMessage = text.is_valid ? text.confirmation_message : '';
      this.errorMessage = !text.is_valid ? 'Something is missing form your submission, please check the form values.' : ''
    } else {
      this.successMessage = this.formMessage = ''
    }

  })

})

export default function contactFormView(config) {

  const { gf_form, fieldPrefix, postUrl, nonce, postAction } = config
  
  const store = createStore(contactReducer, {
    fields: gf_form.fields,
    form_id: gf_form.id,
    fieldPrefix: fieldPrefix,
    postConfig: {
      url: postUrl,
      nonce: nonce,
      action: postAction
    }
  })
  
  store.subscribe(() => {
    riot.update()
  })

  return riot.mount('contact-form', {
    store: store
  })

}


