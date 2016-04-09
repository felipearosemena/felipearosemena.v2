/*
 * action types
 */

export const UPDATE_SELECTION = 'UPDATE_SELECTION'
export const TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION'

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