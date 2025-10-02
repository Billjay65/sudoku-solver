const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

let solver = new Solver();

suite("Unit Tests", () => {

  // Logic handles a valid puzzle string of 81 characters
  test("Logic handles a valid puzzle string of 81 characters", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    assert.equal(solver.validate(puzzle), true);
  });

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    let invalidPuzzle = puzzle.replace(".", "X");
    assert.equal(solver.validate(invalidPuzzle), "Invalid characters in puzzle");
  });

  // Logic handles a puzzle string that is not 81 characters in length
  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    let shortPuzzle = puzzle.slice(0, 60);
    assert.equal(
      solver.validate(shortPuzzle),
      "Expected puzzle to be 81 characters long"
    );
  });

  // Logic handles a valid row placement
  test("Logic handles a valid row placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Take row 0 col 0 from the solution (correct number)
    let value = solution[0];
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, value));
  });

  // Logic handles an invalid row placement
  test("Logic handles an invalid row placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Pick a number not equal to solution[0], guaranteed invalid in row
    let wrongValue = solution[0] === "1" ? "2" : "1";
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 0, wrongValue));
  });

  // Logic handles a valid column placement
  test("Logic handles a valid column placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Take row 0 col 0 from the solution (correct number)
    let value = solution[0];
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 0, value));
  });

  // Logic handles an invalid column placement
  test("Logic handles an invalid column placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Pick a number not equal to solution[0], guaranteed invalid in column
    let wrongValue = solution[0] === "1" ? "2" : "1";
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 0, wrongValue));
  });

  // Logic handles a valid region (3x3 grid) placement
  test("Logic handles a valid region (3x3 grid) placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Take row 0 col 0 from the solution
    let value = solution[0];
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, value));
  });

  // Logic handles an invalid region (3x3 grid) placement
  test("Logic handles an invalid region (3x3 grid) placement", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    // Pick a different number to force invalid region
    let wrongValue = solution[0] === "1" ? "2" : "1";
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 0, wrongValue));
  });


  // Valid puzzle strings pass the solver
  test("Valid puzzle strings pass the solver", () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      let solved = solver.solve(puzzle);
      assert.isString(solved);
      assert.equal(solved.length, 81);
    });
  });

  // Invalid puzzle strings fail the solver
  test("Invalid puzzle strings fail the solver", () => {
    let [puzzle, solution] = puzzlesAndSolutions[0];
    let invalidPuzzle = puzzle.replace(".", "X");
    let result = solver.solve(invalidPuzzle);
    assert.isFalse(result);
  });

  // Solver returns the expected solution for an incomplete puzzle
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    puzzlesAndSolutions.forEach(([puzzle, solution]) => {
      assert.equal(solver.solve(puzzle), solution);
    });
  });
});
