import { describe, it, expect } from 'vitest';
import {
  getColumnLabel,
  getCellId,
  parseCellId,
  getNextCellId,
  COLUMN_COUNT,
  ROW_COUNT,
} from '../gridHelpers';

describe('gridHelpers', () => {
  describe('getColumnLabel', () => {
    it('converts column index to letter', () => {
      expect(getColumnLabel(0)).toBe('A');
      expect(getColumnLabel(1)).toBe('B');
      expect(getColumnLabel(25)).toBe('Z');
    });
  });

  describe('getCellId', () => {
    it('generates cell ID from row and column indices', () => {
      expect(getCellId(0, 0)).toBe('A1');
      expect(getCellId(1, 1)).toBe('B2');
      expect(getCellId(9, 2)).toBe('C10');
    });
  });

  describe('parseCellId', () => {
    it('parses cell ID into row and column indices', () => {
      expect(parseCellId('A1')).toEqual({ row: 0, col: 0 });
      expect(parseCellId('B2')).toEqual({ row: 1, col: 1 });
      expect(parseCellId('C10')).toEqual({ row: 9, col: 2 });
    });
  });

  describe('getNextCellId', () => {
    it('returns next cell ID in specified direction', () => {
      expect(getNextCellId('B2', 'up')).toBe('B1');
      expect(getNextCellId('B2', 'down')).toBe('B3');
      expect(getNextCellId('B2', 'left')).toBe('A2');
      expect(getNextCellId('B2', 'right')).toBe('C2');
    });

    it('returns null when at grid boundaries', () => {
      // Top boundary
      expect(getNextCellId('A1', 'up')).toBe(null);
      // Bottom boundary
      expect(getNextCellId(`A${ROW_COUNT}`, 'down')).toBe(null);
      // Left boundary
      expect(getNextCellId('A1', 'left')).toBe(null);
      // Right boundary
      expect(getNextCellId(`${getColumnLabel(COLUMN_COUNT - 1)}1`, 'right')).toBe(null);
    });
  });
}); 