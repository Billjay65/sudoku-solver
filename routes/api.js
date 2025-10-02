'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  // Create a SudokuSolver instance
  let solver = new SudokuSolver();

  /** 
   * POST /api/solve
   * Solve a Sudoku puzzle
   * Body: { puzzle: string }
   */
  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    // Check for missing puzzle string
    if (!puzzle) return res.json({ error: 'Required field missing' });

    // Validate puzzle string
    const validation = solver.validate(puzzle);
    if (validation !== true) return res.json({ error: validation });

    // Attempt to solve
    const solution = solver.solve(puzzle);
    if (!solution) return res.json({ error: 'Puzzle cannot be solved' });

    return res.json({ solution });
  });

  /**
   * POST /api/check
   * Check if a value can be placed at a given coordinate
   * Body: { puzzle: string, coordinate: string, value: string }
   */
  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check for missing required fields
    if (!puzzle || !coordinate || !value)
      return res.json({ error: 'Required field(s) missing' });

    // Validate puzzle string
    const validation = solver.validate(puzzle);
    if (validation !== true) return res.json({ error: validation });

    // Validate coordinate format (A-I)(1-9)
    const match = coordinate.match(/^([A-I])([1-9])$/i);
    if (!match) return res.json({ error: 'Invalid coordinate' });

    const row = match[1].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const col = parseInt(match[2], 10) - 1;

    // Validate value (1-9)
    if (!/^[1-9]$/.test(value)) return res.json({ error: 'Invalid value' });

    // Convert puzzle to array for manipulation
    const puzzleArr = puzzle.split('');

    // Temporarily remove the value at the coordinate to avoid self-conflict
    const originalValue = puzzleArr[row * 9 + col];
    puzzleArr[row * 9 + col] = '.';

    const conflicts = [];

    // Check row, column, and region
    if (!solver.checkRowPlacement(puzzleArr.join(''), row, col, value)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzleArr.join(''), row, col, value)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzleArr.join(''), row, col, value)) conflicts.push('region');

    // Restore original value
    puzzleArr[row * 9 + col] = originalValue;

    // Return result
    if (conflicts.length) return res.json({ valid: false, conflict: conflicts });
    return res.json({ valid: true });
  });

};
