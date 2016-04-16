/*
 * action types
 */

export const UPDATE_SELECTION = 'UPDATE_SELECTION'
export const TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION'
export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE'
export const TOGGLE_ACTIVE_ALL = 'TOGGLE_ACTIVE_ALL'
export const TOGGLE_ALL = 'TOGGLE_ALL'

export function updateSelection(tax, value) {
  return {
    type: UPDATE_SELECTION,
    value: value,
    tax: tax
  }
}

export function toggleNavigation(isOpen) {
  return {
    type: TOGGLE_NAVIGATION,
    isOpen: isOpen
  }
}


export function addItem() {
  return {
    type: ADD_ITEM
  }
}

export function removeItem() {
  return {
    type: REMOVE_ITEM
  }
}

export function toggleActive(index) {
  return {
    type: TOGGLE_ACTIVE,
    index: index
  }
}

export function toggleActiveAll(allActive) {
  return {
    type: TOGGLE_ACTIVE_ALL,
    allActive: allActive
  }
}

export function toggleAll(allActive) {
  return {
    type: TOGGLE_ALL,
    allActive: allActive
  }
}

