import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cell } from './Cell';
import { COLUMN_COUNT, ROW_COUNT, getColumnLabel, getCellId, getNextCellId, parseCellId } from '../utils/gridHelpers';
import { selectCell, startEditing, updateCell } from '../store/spreadsheetSlice';
import type { RootState } from '../store/store';

export const Grid: React.FC = () => {
  const dispatch = useDispatch();
  const selection = useSelector((state: RootState) => state.spreadsheet.selection);
  
  const selectedRowCol = selection.cell ? parseCellId(selection.cell) : null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selection.cell || selection.editing) return;

    const directions = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    } as const;

    if (e.key in directions) {
      e.preventDefault();
      const nextCellId = getNextCellId(selection.cell, directions[e.key as keyof typeof directions]);
      if (nextCellId) {
        dispatch(selectCell(nextCellId));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(startEditing());
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      dispatch(updateCell({ cell: selection.cell, value: '' }));
      dispatch(startEditing());
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      dispatch(updateCell({ cell: selection.cell, value: e.key }));
      dispatch(startEditing());
    }
  }, [dispatch, selection.cell, selection.editing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="grid-container">
      <div className="grid">
        {/* Column Headers */}
        <div className="header-row">
          <div className="corner-cell" />
          {Array.from({ length: COLUMN_COUNT }, (_, i) => (
            <div 
              key={i} 
              className={`column-header ${selectedRowCol?.col === i ? 'selected-column' : ''}`}
            >
              {getColumnLabel(i)}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        {Array.from({ length: ROW_COUNT }, (_, row) => (
          <div key={row} className="grid-row">
            <div className={`row-header ${selectedRowCol?.row === row ? 'selected-row' : ''}`}>
              {row + 1}
            </div>
            {Array.from({ length: COLUMN_COUNT }, (_, col) => (
              <Cell 
                key={col} 
                cellId={getCellId(row, col)} 
                className={`
                  ${selectedRowCol?.row === row ? 'selected-row' : ''}
                  ${selectedRowCol?.col === col ? 'selected-column' : ''}
                `}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 