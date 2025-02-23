export const COLUMN_COUNT = 20;
export const ROW_COUNT = 40;

export const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index); // A = 65 in ASCII
};

export const getCellId = (row: number, col: number): string => {
  return `${getColumnLabel(col)}${row + 1}`;
};

export const parseCellId = (cellId: string): { row: number; col: number } => {
  const col = cellId.charAt(0).charCodeAt(0) - 65; // A = 0, B = 1, etc.
  const row = parseInt(cellId.slice(1)) - 1;
  return { row, col };
};

export const getNextCellId = (
  currentCellId: string,
  direction: 'up' | 'down' | 'left' | 'right'
): string | null => {
  const { row, col } = parseCellId(currentCellId);
  
  switch (direction) {
    case 'up':
      return row > 0 ? getCellId(row - 1, col) : null;
    case 'down':
      return row < ROW_COUNT - 1 ? getCellId(row + 1, col) : null;
    case 'left':
      return col > 0 ? getCellId(row, col - 1) : null;
    case 'right':
      return col < COLUMN_COUNT - 1 ? getCellId(row, col + 1) : null;
  }
}; 