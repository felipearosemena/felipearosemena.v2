/** 
*
* Contact
*
*/

import { createStore } from 'redux'
import riot from 'riot'
import request from 'superagent'

import { inputChange, formSubmitted } from '../modules/actions'
import { contactReducer } from '../modules/reducers'
import { delegateEvent, map, filter, extend, createElement, inArray } from '../modules/utils'

const formControlCommon = () => {
  return `
    <label for="{opts.name}">
      { opts.label }
      <span class="color-primary">{ opts.isRequired ? '*' : ''}</span>
    </label>

    <validation if="{ opts.hasError }" message="{ opts.errorMessage }" class="val-error"></validation>
  `
}

const formControlCommonAtts = () => {
  return `id="{ opts.name }" name="{ opts.name }"  type="{ opts.type }" placeholder="{ opts.placeholder }" class="form__control"`
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
    <div class="form__radio-option" each="{ choices }">
      <input class="form__control" id="{ id }" name="{ parent.opts.name }" type="{ parent.opts.type }" value="{ value }">
      <label for="{ id }">
        <raw content="{ text }"></raw>
      </label>
    </div>
  `
, function() {

  this.choices = map(this.opts.choices, (opt, i) => {
    return {
      ...opt, 
      id: this.opts.name + '_' + i
    }
  })

})

riot.tag('form-input', 
  `
    ${formControlCommon()}
    <input ${formControlCommonAtts()}>
  `
)

riot.tag('form-control', '', function() {

  const {field, store} = this.opts
  const { fieldPrefix } = store.getState()
  const tagName = inArray(field.type, ['text', 'email', 'url']) ? 'input' : field.type
  const cl = this.root.classList;

  field.name = fieldPrefix + field.id

  riot.mount(this.root, 'form-' + tagName, field)

  this.on('update', () => {
    this.isVisible = true 
  })

  const inputs = this.root.querySelectorAll('.form__control')

  map(inputs, input => {
    
    input.addEventListener('focus', e => cl.add('is-focused'))
    input.addEventListener('blur', e => {
      cl.remove('is-focused')
      // store.dispatch(inputChange(field))
    })
    // input.addEventListener('change', e => store.dispatch(inputChange(field)))
  })

})

riot.tag('contact-form', 
  `
    <div if="{http_err}">{ http_err }</div>
    <raw content="{formMessage}"></raw>
    <form onsubmit="{ submit }">
      <form-control each={fields} if={isVisible} store={parent.opts.store} field={field} class="form__group form__group--{ formControlClass }"></form-control>
      <div class="text-right">
        <button class="btn" type=submit>Send</button>
      </div>
    </form>
  `
, function() {

  const { store } = this.opts
  const { postConfig } = store.getState()

  this.submit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    formData.append('form_id', store.getState().form_id)
    formData.append('action', 'submit_contact_form')
    formData.append('nonce', postConfig.nonce)

    request
      .post(postConfig.url)
      .send(formData)
      .end((err,res) => {
        store.dispatch(formSubmitted(res, err))
      })
  }

  this.on('update', () => {

    const {fields, http_res, http_err} = store.getState()
    
    this.fields = fields.map(fieldObj => {
      const formControlClass = inArray(fieldObj.type, ['radio', 'select']) ? fieldObj.type : 'boxed'

      return {
        field: fieldObj,
        formControlClass: formControlClass
      }

    })

    if(!http_err && http_res) {
      const text = http_res ? JSON.parse(http_res.text) : {}
      this.formMessage = text.is_valid ? text.confirmation_message : 'Something is missing form your submission, please check the form values.'   
    } else {
      this.formMessage = ''
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


