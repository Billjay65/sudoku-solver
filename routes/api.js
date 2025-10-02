class SudokuSolver {

  // Validate the puzzle string: only digits 1-9 and '.' allowed, length must be 81
  validate(puzzleString) {
    if (puzzleString.length !== 81) return 'Expected puzzle to be 81 characters long';
    if (/[^1-9.]/.test(puzzleString)) return 'Invalid characters in puzzle';
    return true;
  }

  // Check if value can be placed in the given row
  checkRowPlacement(puzzleString, row, column, value) {
    for (let c = 0; c < 9; c++) {
      if (c === column) continue;
      if (puzzleString[row * 9 + c] === value) return false;
    }
    return true;
  }

  // Check if value can be placed in the given column
  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r === row) continue;
      if (puzzleString[r * 9 + column] === value) return false;
    }
    return true;
  }

  // Check if value can be placed in the 3x3 region
  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === row && c === column) continue;
        if (puzzleString[r * 9 + c] === value) return false;
      }
    }
    return true;
  }

  // Solve the puzzle using simple backtracking
  solve(puzzleString) {
    const puzzle = puzzleString.split('');

    // Helper function for recursive backtracking
    const solver = (index = 0) => {
      if (index === 81) return true; // solved

      if (puzzle[index] !== '.') return solver(index + 1);

      const row = Math.floor(index / 9);
      const col = index % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle.join(''), row, col, value) &&
          this.checkColPlacement(puzzle.join(''), row, col, value) &&
          this.checkRegionPlacement(puzzle.join(''), row, col, value)
        ) {
          puzzle[index] = value;
          if (solver(index + 1)) return true;
          puzzle[index] = '.';
        }
      }
      return false; // backtrack
    };

    return solver() ? puzzle.join('') : false;
  }
}

module.exports = SudokuSolver;
