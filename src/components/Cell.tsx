import { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCell, startEditing, stopEditing, updateCell } from '../store/spreadsheetSlice';
import { getNextCellId } from '../utils/gridHelpers';
import type { RootState } from '../store/store';

interface CellProps {
  cellId: string;
  className?: string;
}

export const Cell: React.FC<CellProps> = ({ cellId, className = '' }) => {
  const dispatch = useDispatch();
  const cellData = useSelector((state: RootState) => state.spreadsheet.cells[cellId]);
  const selection = useSelector((state: RootState) => state.spreadsheet.selection);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState(cellData?.value || '');

  const isSelected = selection.cell === cellId;
  const isEditing = isSelected && selection.editing;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // If editing was started by typing a character, move cursor to the end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(cellData?.value || '');
  }, [cellData?.value]);

  const handleClick = useCallback(() => {
    dispatch(selectCell(cellId));
  }, [cellId, dispatch]);

  const handleDoubleClick = useCallback(() => {
    dispatch(startEditing());
  }, [dispatch]);

  const finishEditingAndMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch(updateCell({ cell: cellId, value: editValue }));
    dispatch(stopEditing());
    const nextCellId = getNextCellId(cellId, direction);
    if (nextCellId) {
      dispatch(selectCell(nextCellId));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      finishEditingAndMove(e.shiftKey ? 'left' : 'right');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      finishEditingAndMove('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      finishEditingAndMove('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      finishEditingAndMove('down');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(cellData?.value || '');
      dispatch(stopEditing());
    }
    // Prevent event propagation to avoid triggering Grid keyboard handlers
    e.stopPropagation();
  };

  const finishEditing = () => {
    dispatch(updateCell({ cell: cellId, value: editValue }));
    dispatch(stopEditing());
  };

  return (
    <div
      className={`cell ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''} ${className}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-cell-id={cellId}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="cell-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={finishEditing}
        />
      ) : (
        cellData?.value || ''
      )}
    </div>
  );
}; 