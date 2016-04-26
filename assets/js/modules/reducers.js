import { combineReducers } from 'redux'
import { inArray, map } from './utils'

import { 
  UPDATE_SELECTION, 
  TOGGLE_NAVIGATION, 
  ADD_ITEM,
  REMOVE_ITEM,
  TOGGLE_ACTIVE,
  TOGGLE_ACTIVE_ALL,
  TOGGLE_ALL,
  INPUT_CHANGE,
  FORM_SUBMITTED
} from './actions'

/** 
*
* TODO
*
* USE REACT, LOAD JUST IN THE PAGE
*
*/


function item(state, action) {
  switch (action.type) {
    case UPDATE_SELECTION :

      const { item, selection } = state
      const isFiltered = item.taxonomies.reduce((bool, tax) => {
        return bool ? bool : (selection[tax.taxonomy_name] && selection[tax.taxonomy_name] !== tax.value) ? true : false
      }, false)

      return {
        ...item,
        isFiltered: isFiltered
      }
    
    default :
      return state
  }
}

function filter(state, action) {
  switch (action.type) {
    case UPDATE_SELECTION :

      const { filter, items, selection } = state
      const updatedOptions = filter.options.map(option => {

        const newSelection = {
          ...selection,
          [filter.taxonomy_name]: option.option_name
        }

        const filteredItems = items
          .map(i => item({item: i, selection: newSelection}, action))
          .map(item => item.isFiltered)

        return {
          ...option,
          isValid: inArray(false, filteredItems)
        }

      })

      return {
        ...filter,
        options: updatedOptions
      }

    default : 
      return state
  }
}

function appliedFilters(state = {}, action) {
  switch (action.type) {
    case UPDATE_SELECTION : 

      const { items, filters } = state
      const newSelection = {
        ...state.selection,
        [action.tax]: action.value
      }
      const filteredItems = items.map(i => item({item: i, selection: newSelection}, action))
      const updatedFilters = filters.map(f => filter({
        filter: f,
        items: filteredItems,
        selection: newSelection
      }, action))

      return {
        ...state,
        items: filteredItems,
        selection: newSelection,
        filters: updatedFilters
      }

    default : 
      return state

  }
}

function header(state = {}, action) {

  switch (action.type) {
    case TOGGLE_NAVIGATION : 

      return {
        ...state,
        isOpen: !state.isOpen
      }

    default : 
      return state

  }
}

function componentReducer(state = {}, action) {

  switch(action.type) {
    case ADD_ITEM :

      state.items.push({
        title: 'New Item'
      })
      
      return {
        ...state,
        items: [
          ...state.items
        ]
      }

    case REMOVE_ITEM :

      state.items.splice(-1, 1)
      return {
        ...state,
        items: [
          ...state.items
        ]
      }

    case TOGGLE_ACTIVE : 

      return {
        ...state,
        items: map(state.items, (item, i) => {

          if(i == action.index) {
            item.isActive = !item.isActive
          }

          return item
        })
      }

    case TOGGLE_ACTIVE_ALL :
    case TOGGLE_ALL :

      return {
        ...state,
        items: map(state.items, item => {
          item.isActive = action.allActive
          return item
        })
      }

    default: 
      return state
  }
}

function contactReducer(state = {}, action) {
  
  switch(action.type) {
    case INPUT_CHANGE :

      return {
        ...state
      }

    case FORM_SUBMITTED :


      const resText = action.res ? JSON.parse(action.res.text) : {}
      const fields = map(state.fields, field => {
        return {
          ...field,
          hasError: resText.validation_messages ? resText.validation_messages[field.id] : false
        }
      })

      return {
        ...state,
        fields: fields,
        http_res: action.res,
        http_err: action.err
      }

    default :

      return {
        ...state
      }
  }
}

const filterApp = combineReducers({
  appliedFilters
})

const headerReducer = combineReducers({
  header, appliedFilters
})

export { filterApp, headerReducer, componentReducer, contactReducer }