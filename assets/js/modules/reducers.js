import { combineReducers } from 'redux'
import { UPDATE_SELECTION, TOGGLE_NAVIGATION } from './actions'
import { inArray } from './utils'

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

const filterApp = combineReducers({
  appliedFilters
})

const headerReducer = combineReducers({
  header, appliedFilters
})

export { filterApp, headerReducer }