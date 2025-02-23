import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Cell } from '../Cell';
import spreadsheetReducer from '../../store/spreadsheetSlice';

describe('Cell', () => {
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

  it('renders empty cell correctly', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Cell cellId="A1" />
      </Provider>
    );
    
    const cell = container.querySelector('.cell');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent('');
  });

  it('renders cell with value correctly', () => {
    const store = createMockStore({
      cells: {
        'A1': { value: 'test' },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <Cell cellId="A1" />
      </Provider>
    );
    
    const cell = container.querySelector('.cell');
    expect(cell).toHaveTextContent('test');
  });

  it('applies selected class when cell is selected', () => {
    const store = createMockStore({
      selection: {
        active: true,
        cell: 'A1',
        editing: false,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <Cell cellId="A1" />
      </Provider>
    );
    
    const cell = container.querySelector('.cell');
    expect(cell).toHaveClass('selected');
  });

  it('enters edit mode on double click', () => {
    const store = createMockStore({
      selection: {
        active: true,
        cell: 'A1',
        editing: false,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <Cell cellId="A1" />
      </Provider>
    );
    
    const cell = container.querySelector('.cell');
    fireEvent.doubleClick(cell!);
    
    const state = store.getState();
    expect(state.spreadsheet.selection.editing).toBe(true);
  });

  describe('keyboard navigation while editing', () => {
    const setupEditingCell = () => {
      const store = createMockStore({
        selection: {
          active: true,
          cell: 'B2',
          editing: true,
        },
        cells: {
          'B2': { value: 'test' },
        },
      });

      const { container } = render(
        <Provider store={store}>
          <Cell cellId="B2" />
        </Provider>
      );

      return { store, container };
    };

    it('saves and moves down on Enter', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'Enter' });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('new value');
      expect(state.spreadsheet.selection.editing).toBe(false);
      expect(state.spreadsheet.selection.cell).toBe('B3');
    });

    it('saves and moves right on Tab', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'Tab' });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('new value');
      expect(state.spreadsheet.selection.editing).toBe(false);
      expect(state.spreadsheet.selection.cell).toBe('C2');
    });

    it('saves and moves left on Shift+Tab', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'Tab', shiftKey: true });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('new value');
      expect(state.spreadsheet.selection.editing).toBe(false);
      expect(state.spreadsheet.selection.cell).toBe('A2');
    });

    it('saves and moves up on ArrowUp', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'ArrowUp' });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('new value');
      expect(state.spreadsheet.selection.editing).toBe(false);
      expect(state.spreadsheet.selection.cell).toBe('B1');
    });

    it('saves and moves down on ArrowDown', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'ArrowDown' });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('new value');
      expect(state.spreadsheet.selection.editing).toBe(false);
      expect(state.spreadsheet.selection.cell).toBe('B3');
    });

    it('cancels editing on Escape', () => {
      const { container, store } = setupEditingCell();
      const input = container.querySelector('input');
      
      fireEvent.change(input!, { target: { value: 'new value' } });
      fireEvent.keyDown(input!, { key: 'Escape' });

      const state = store.getState();
      expect(state.spreadsheet.cells['B2'].value).toBe('test'); // Original value
      expect(state.spreadsheet.selection.editing).toBe(false);
    });
  });
}); 