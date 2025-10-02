/* * This file contains the corrected SudokuSolver class logic.
 * The functional test was failing because the column placement check 
 * likely had an error in how it iterated through the column or calculated the index.
 */
class SudokuSolver {
  
  // --- Core Validation and Helpers ---

  validate(puzzleString) {
    if (!puzzleString) {
      return 'Required field missing'; 
    }
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    return true; // Valid
  }

  // Helper to get the 0-indexed position in the 81-character string
  getIndex(row, col) {
    return row * 9 + col;
  }

  // --- Placement Checkers ---

  checkRowPlacement(puzzleString, row, col, value) {
    // Get the starting index of the row
    const startIdx = this.getIndex(row, 0);
    
    // Check all cells in the row (0 to 8)
    for (let c = 0; c < 9; c++) {
      // Skip the target column itself if the API handler didn't clear the cell
      if (c === col) continue; 
      
      const cellValue = puzzleString[startIdx + c];
      if (cellValue === value) {
        return false; // Conflict found
      }
    }
    return true; // No conflict
  }

  checkColPlacement(puzzleString, row, col, value) {
    // Check all cells in the column (0 to 8)
    for (let r = 0; r < 9; r++) {
      // Skip the target row itself
      if (r === row) continue; 
      
      // Calculate index: (r * 9 + col)
      const cellValue = puzzleString[this.getIndex(r, col)];
      if (cellValue === value) {
        return false; // Conflict found
      }
    }
    return true; // No conflict
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    // Calculate the top-left cell of the 3x3 region
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    // Iterate through the 3x3 region
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        // Skip the target cell
        if (r === row && c === col) continue;

        const cellValue = puzzleString[this.getIndex(r, c)];
        if (cellValue === value) {
          return false; // Conflict found
        }
      }
    }
    return true; // No conflict
  }

  // --- Solver ---

  solve(puzzleString) {
    // 1. Validate the puzzle string first
    if (this.validate(puzzleString) !== true) {
        return false;
    }

    let board = puzzleString.split('');
    const emptyCellIndex = board.indexOf('.');

    // Base case: If no empty cells, the puzzle is solved
    if (emptyCellIndex === -1) {
      return board.join('');
    }

    const row = Math.floor(emptyCellIndex / 9);
    const col = emptyCellIndex % 9;

    // Try values 1 through 9
    for (let value = 1; value <= 9; value++) {
      const charValue = value.toString();
      
      // Check if placing this value is valid in the current board state
      const currentBoardString = board.join('');
      const isRowValid = this.checkRowPlacement(currentBoardString, row, col, charValue);
      const isColValid = this.checkColPlacement(currentBoardString, row, col, charValue);
      const isRegionValid = this.checkRegionPlacement(currentBoardString, row, col, charValue);
      
      if (isRowValid && isColValid && isRegionValid) {
        // Place the value and recurse
        board[emptyCellIndex] = charValue;
        const solution = this.solve(board.join(''));
        
        if (solution) {
          return solution;
        }
        
        // Backtrack: Reset the cell if the recursion failed
        board[emptyCellIndex] = '.';
      }
    }

    return false; // No valid value found for this cell, trigger backtracking
  }
}

module.exports = SudokuSolver;
