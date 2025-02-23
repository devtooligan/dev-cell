import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Grid } from '../Grid';
import spreadsheetReducer from '../../store/spreadsheetSlice';
import { COLUMN_COUNT, ROW_COUNT } from '../../utils/gridHelpers';

describe('Grid', () => {
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        spreadsheet: spreadsheetReducer,
      },
      preloadedState: {
        spreadsheet: {
          cells: {},
          selection: {
            active: false,
            cell: null,
            editing: false,
          },
          ...initialState,
        },
      },
    });
  };

  it('renders correct number of columns and rows', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Grid />
      </Provider>
    );

    const columnHeaders = container.querySelectorAll('.column-header');
    const rows = container.querySelectorAll('.grid-row');
    
    expect(columnHeaders).toHaveLength(COLUMN_COUNT);
    expect(rows).toHaveLength(ROW_COUNT);
  });

  it('renders column headers A through T', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Grid />
      </Provider>
    );

    const columnHeaders = container.querySelectorAll('.column-header');
    expect(columnHeaders[0]).toHaveTextContent('A');
    expect(columnHeaders[1]).toHaveTextContent('B');
    expect(columnHeaders[19]).toHaveTextContent('T');
  });

  describe('keyboard interactions', () => {
    const setupGridWithSelection = () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: false,
        },
      });

      render(
        <Provider store={store}>
          <Grid />
        </Provider>
      );

      return store;
    };

    it('handles arrow key navigation', () => {
      const store = setupGridWithSelection();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      expect(store.getState().spreadsheet.selection.cell).toBe('C2');

      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(store.getState().spreadsheet.selection.cell).toBe('C3');

      fireEvent.keyDown(document, { key: 'ArrowLeft' });
      expect(store.getState().spreadsheet.selection.cell).toBe('B3');

      fireEvent.keyDown(document, { key: 'ArrowUp' });
      expect(store.getState().spreadsheet.selection.cell).toBe('B2');
    });

    it('starts editing on Enter key', () => {
      const store = setupGridWithSelection();

      fireEvent.keyDown(document, { key: 'Enter' });
      expect(store.getState().spreadsheet.selection.editing).toBe(true);
    });

    it('clears cell and starts editing on Delete', () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: false,
        },
        cells: {
          'B2': { value: 'test' },
        },
      });

      render(
        <Provider store={store}>
          <Grid />
        </Provider>
      );

      fireEvent.keyDown(document, { key: 'Delete' });
      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('');
      expect(state.spreadsheet.selection.editing).toBe(true);
    });

    it('clears cell and starts editing on Backspace', () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: false,
        },
        cells: {
          'B2': { value: 'test' },
        },
      });

      render(
        <Provider store={store}>
          <Grid />
        </Provider>
      );

      fireEvent.keyDown(document, { key: 'Backspace' });
      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('');
      expect(state.spreadsheet.selection.editing).toBe(true);
    });

    it('replaces cell content and starts editing on character key press', () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: false,
        },
        cells: {
          'B2': { value: 'test' },
        },
      });

      render(
        <Provider store={store}>
          <Grid />
        </Provider>
      );

      fireEvent.keyDown(document, { key: 'a' });
      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('a');
      expect(state.spreadsheet.selection.editing).toBe(true);
    });

    it('ignores character key press with modifier keys', () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: false,
        },
        cells: {
          'B2': { value: 'test' },
        },
      });

      render(
        <Provider store={store}>
          <Grid />
        </Provider>
      );

      fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
      const state = store.getState();
      expect(state.spreadsheet.cells['B2']?.value).toBe('test');
      expect(state.spreadsheet.selection.editing).toBe(false);
    });
  });
}); 