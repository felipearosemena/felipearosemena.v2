/*
 * action types
 */

export const UPDATE_SELECTION = 'UPDATE_SELECTION'

export function updateSelection(tax, value) {
  return {
    type: UPDATE_SELECTION,
    value: value,
    tax: tax
  }
}