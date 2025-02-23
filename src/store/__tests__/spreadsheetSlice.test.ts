import { describe, it, expect } from 'vitest'
import spreadsheetReducer, {
  selectCell,
  startEditing,
  stopEditing,
  updateCell,
  clearSelection,
  SpreadsheetState,
} from '../spreadsheetSlice'

describe('spreadsheet reducer', () => {
  const initialState: SpreadsheetState = {
    cells: {},
    selection: {
      active: false,
      cell: null,
      editing: false,
    },
  }

  it('should handle initial state', () => {
    expect(spreadsheetReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle selectCell', () => {
    const actual = spreadsheetReducer(initialState, selectCell('A1'))
    expect(actual.selection).toEqual({
      active: true,
      cell: 'A1',
      editing: false,
    })
  })

  it('should handle startEditing', () => {
    const stateWithSelection = spreadsheetReducer(initialState, selectCell('A1'))
    const actual = spreadsheetReducer(stateWithSelection, startEditing())
    expect(actual.selection.editing).toBe(true)
  })

  it('should handle updateCell', () => {
    const actual = spreadsheetReducer(
      initialState,
      updateCell({ cell: 'A1', value: 'test' })
    )
    expect(actual.cells['A1']).toEqual({ value: 'test' })
  })

  it('should handle clearSelection', () => {
    const stateWithSelection = spreadsheetReducer(initialState, selectCell('A1'))
    const actual = spreadsheetReducer(stateWithSelection, clearSelection())
    expect(actual.selection).toEqual({
      active: false,
      cell: null,
      editing: false,
    })
  })
}) 