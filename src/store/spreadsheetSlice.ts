import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CellData {
  value: string;
}

export interface SpreadsheetState {
  cells: Record<string, CellData>;
  selection: {
    active: boolean;
    cell: string | null;
    editing: boolean;
  };
}

const initialState: SpreadsheetState = {
  cells: {},
  selection: {
    active: false,
    cell: null,
    editing: false,
  },
}

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    selectCell: (state, action: PayloadAction<string>) => {
      state.selection = {
        active: true,
        cell: action.payload,
        editing: false,
      }
    },
    startEditing: (state) => {
      if (state.selection.cell) {
        state.selection.editing = true
      }
    },
    stopEditing: (state) => {
      state.selection.editing = false
    },
    updateCell: (state, action: PayloadAction<{ cell: string; value: string }>) => {
      const { cell, value } = action.payload
      state.cells[cell] = { value }
    },
    clearSelection: (state) => {
      state.selection = {
        active: false,
        cell: null,
        editing: false,
      }
    },
  },
})

export const {
  selectCell,
  startEditing,
  stopEditing,
  updateCell,
  clearSelection,
} = spreadsheetSlice.actions

export default spreadsheetSlice.reducer 