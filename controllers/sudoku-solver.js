class SudokuSolver {
  // Validate the puzzle string (must be provided, 81 chars, only digits 1-9 or .)
  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }
    return true;
  }

  // Convert a puzzle string to a 9x9 grid (array of arrays)
  stringToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 81; i += 9) {
      grid.push(puzzleString.slice(i, i + 9).split(""));
    }
    return grid;
  }

  // Convert a 9x9 grid back to a single string
  gridToString(grid) {
    return grid.flat().join("");
  }

  // Check whether placing 'value' at (row, column) would conflict with other values in the same row.
  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    const v = String(value);

    // Check every cell in the row except the target cell
    for (let c = 0; c < 9; c++) {
      if (c === column) continue;
      if (grid[row][c] === v) return false;
    }
    return true;
  }

  // Check whether placing 'value' at (row, column) would conflict with other values in the same column.
  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    const v = String(value);

    // Check every cell in the column except the target cell
    for (let r = 0; r < 9; r++) {
      if (r === row) continue;
      if (grid[r][column] === v) return false;
    }
    return true;
  }

  // Check whether placing 'value' at (row, column) would conflict with other values in the 3x3 region.
  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    const v = String(value);

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    // Check all cells in the region, skipping the target cell
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === row && c === column) continue;
        if (grid[r][c] === v) return false;
      }
    }
    return true;
  }

  // Solve the puzzle using backtracking; returns solved puzzle string or false if invalid/unsolvable
  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) return false;

    const grid = this.stringToGrid(puzzleString);

    const solveRecursive = () => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c] === ".") {
            for (let n = 1; n <= 9; n++) {
              const v = String(n);
              const currentPuzzleStr = this.gridToString(grid);

              // Use placement checks that ignore the target cell itself
              if (
                this.checkRowPlacement(currentPuzzleStr, r, c, v) &&
                this.checkColPlacement(currentPuzzleStr, r, c, v) &&
                this.checkRegionPlacement(currentPuzzleStr, r, c, v)
              ) {
                grid[r][c] = v;
                if (solveRecursive()) return true;
                // backtrack
                grid[r][c] = ".";
              }
            }
            // No number fits here
            return false;
          }
        }
      }
      // No empty cells -> solved
      return true;
    };

    const solved = solveRecursive();
    if (!solved) return false;
    return this.gridToString(grid);
  }
}

module.exports = SudokuSolver;
