document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("solve-btn");
  btn.addEventListener("click", solve);
  const grid = document.getElementById("soduku-grid");
  for (let row = 0; row < 9; row++) {
    const newr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const coll = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "col";
      input.id = `grid_${row}_${col}`; // Correct string interpolation
      input.min = 1;
      input.max = 9;
      coll.appendChild(input);
      newr.appendChild(coll);
    }
    grid.append(newr);
  }
});

function solve() {
  const sodukuArr = [];
  for (let row = 0; row < 9; row++) {
    sodukuArr[row] = [];
    for (let col = 0; col < 9; col++) {
      const cellId = `grid_${row}_${col}`; // Correct string interpolation
      const cellVal = document.getElementById(cellId).value;
      sodukuArr[row][col] = cellVal !== "" ? parseInt(cellVal) : 0;
    }
  }

  solveWithPromise(sodukuArr, 10)
    .then()
    .catch(() => {
      alert("Sudoku cannot be solved!");
    });
}

function solveWithPromise(board, delay) {
  return new Promise((resolve, reject) => {
    solveStep(board, 0, 0, delay, resolve, reject);
  });
}

function solveStep(board, row, col, delay, resolve, reject) {
  if (row === 9) {
    resolve(); // Solved the entire board
    return;
  }

  const nextRow = col === 8 ? row + 1 : row;
  const nextCol = col === 8 ? 0 : col + 1;

  if (board[row][col] !== 0) {
    solveStep(board, nextRow, nextCol, delay, resolve, reject);
  } else {
    let k = 1;

    function tryNextValue() {
      if (k > 9) {
        board[row][col] = 0; // Backtrack
        reject(); // No solution found
        return;
      }

      if (isValid(board, row, col, k)) {
        board[row][col] = k;
        const cell = document.getElementById(`grid_${row}_${col}`);
        cell.value = k;

        setTimeout(() => {
          solveWithPromise(board, delay)
            .then(() => resolve()) // If further solving succeeds, resolve the Promise
            .catch(() => {
              // Backtrack if further solving fails
              board[row][col] = 0;
              cell.value = "";
              k++;
              tryNextValue(); // Try the next value
            });
        }, delay);
      } else {
        k++;
        tryNextValue(); // Try the next value
      }
    }

    tryNextValue();
  }
}

function isValid(board, row, col, k) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] == k) return false;
    if (board[i][col] == k) return false;
    if (
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
        3 * Math.floor(col / 3) + (i % 3)
      ] == k
    )
      return false;
  }
  return true;
}
