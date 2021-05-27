let cells = document.querySelectorAll(".cells");
let backBtn = document.getElementById("back-btn");
let resetBtn = document.getElementById("reset-btn");
let restartBtn = document.getElementById("restart-btn");
let continueBtn = document.getElementById("continue-btn");
let replayBtn = document.getElementById("replay-btn");
let tryAgainBtn = document.getElementById("try-again-btn");
let quitBtn = document.getElementById("quit-btn");
let quitBox = document.getElementById("quit-box");
let winBox = document.getElementById("win-box");
let lostBox = document.getElementById("lost-box");
let Board = document.getElementById("board");
let scoreCard = document.getElementById("score");
let highScoreCard = document.getElementById("high-score");
let btns = [resetBtn, backBtn, quitBtn];

let colorPalette = {
  2: 10,
  4: 30,
  8: 50,
  16: 70,
  32: 90,
  64: 110,
  128: 130,
  256: 150,
  512: 170,
  1024: 190,
  2028: 240,
};

// Lost Check Board //
//  let board = [
//    [0, 1024, 0, 0],
//    [2, 64, 32, 12],
//    [256, 128, 16, 8],
//    [2, 64, 32, 12],
//  ];

 let board = [
   [0, 0, 0, 0],
   [0, 0, 0, 0],
   [0, 0, 0, 0],
   [0, 0, 0, 0],
 ];

let prevState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
let highScore = score;
let prevScore = score;

window.addEventListener("keydown", function (e) {
  startTimer();

  key = e.keyCode;
  if (quitBtn.disabled === false) {
    if (key == 8) {
      backBtn.click();
      return;
    } else if (key == 36) {
      resetBtn.click();
      return;
    } else if (key == 27) {
      quitBtn.click();
      return;
    }

    prevState = getPrevState(prevState, board);

    prevScore = score;

    if (key === 37) {
      for (let i = 0; i < board.length; i++) {
        score += shiftingValues(board[i]);
      }
    } else if (key === 38) {
      board = transpose(board);
      for (let i = 0; i < board.length; i++) {
        score += shiftingValues(board[i]);
      }
      board = transpose(board);
    } else if (key === 39) {
      board = miror(board);
      for (let i = 0; i < board.length; i++) {
        score += shiftingValues(board[i]);
      }
      board = miror(board);
    } else if (key === 40) {
      board = transpose(board);
      board = miror(board);
      for (let i = 0; i < board.length; i++) {
        score += shiftingValues(board[i]);
      }
      board = miror(board);
      board = transpose(board);
    } else {
      return;
    }

    board = generateAnotherNumInRandomEmptyCell(board);
    updateBoard(board);
    if (score > highScore) {
      highScore = score;
    }

    let cont = toContinue(board, prevState);
    if (cont === false) {
      if (checkLose(board) === true) {
        tryAgain();
        return;
      }
    }

    if (checkWin(board) === true) {
      Congratulation();
      return;
    }

    updateScoreCard(score, highScore);
  } else if (winBox.style.display === "initial") {
    if (e.keyCode === 13) {
      replayBtn.click();
    }
  } else if (lostBox.style.display === "initial") {
    if (e.keyCode === 13) {
      tryAgainBtn.click();
    }
  } else {
    if (e.keyCode === 36) {
      board = resetBoard(board);
      updateBoard(board);
      restartBtn.click();
    } else if (e.keyCode === 13) {
      continueBtn.click();
    }
  }
});

backBtn.addEventListener("click", function () {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = prevState[i][j];
    }
  }
  updateBoard(board);
});

resetBtn.addEventListener("click", function () {
  board = resetBoard(board);
  updateBoard(board);
  score = 0;
  resetTimer();
});

quitBtn.addEventListener("click", function () {
  quitBox.style.display = "initial";
  quitBox.style.height = `${parseInt(Board.offsetHeight)}px`;
  quitBox.style.width = `${parseInt(Board.offsetWidth)}px`;
  btns.forEach((btn) => {
    btn.disabled = true;
  });
});

restartBtn.addEventListener("click", function () {
  quitBox.style.display = "none";
  btns.forEach((btn) => {
    btn.disabled = false;
  });
  score = 0;
  highScore = 0;
  board = resetBoard(board);
  updateBoard(board);
  updateScoreCard(score, highScore);
  resetTimer();
});

continueBtn.addEventListener("click", function () {
  quitBox.style.display = "none";
  btns.forEach((btn) => {
    btn.disabled = false;
  });
  backBtn.click();
});

replayBtn.addEventListener("click", function () {
  winBox.style.display = "none";
  btns.forEach((btn) => {
    btn.disabled = false;
  });
  score = 0;
  updateScoreCard(score, highScore);
});

tryAgainBtn.addEventListener("click", function () {
  score = 0;
  updateScoreCard(score, highScore);
  lostBox.style.display = "none";
  btns.forEach((btn) => {
    btn.disabled = false;
  });
  board = resetBoard(board);
  updateBoard(board);
});

function tryAgain() {
  lostBox.style.display = "initial";
  lostBox.style.height = `${parseInt(Board.offsetWidth)}px`;
  lostBox.style.width = `${parseInt(Board.offsetWidth)}px`;
  btns.forEach((btn) => {
    btn.disabled = true;
  });
}

function Congratulation() {
  winBox.style.display = "initial";
  winBox.style.height = `${parseInt(Board.offsetWidth)}px`;
  winBox.style.width = `${parseInt(Board.offsetWidth)}px`;
  btns.forEach((btn) => {
    btn.disabled = true;
  });
}

function updateScoreCard(score, highScore) {
  scoreCard.innerHTML = score;
  highScoreCard.innerHTML = highScore;
}

function initializeBoard(board) {
  for (let i = 0; i < 2; i++) {
    let randomNumberToAdd;
    let randomNumber = Math.floor(Math.random() * 10);
    if (randomNumber < 8) {
      randomNumberToAdd = 2;
    } else {
      randomNumberToAdd = 4;
    }

    let emptyCells = getEmptyCells(board);
    let emptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    row = emptyCell[0];
    col = emptyCell[1];
    board[row][col] = randomNumberToAdd;
  }
  return board;
}

function resetBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = 0;
    }
  }
  board = initializeBoard(board);
  score = 0;
  updateScoreCard(score, highScore);
  return board;
}

function toContinue(board, prevState) {
  let changes = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] != prevState[i][j]) {
        changes += 1;
        return true;
      }
    }
  }
  // console.log(changes)
  return false;
}

function getPrevState(prevState, board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      prevState[i][j] = board[i][j];
    }
  }
  return prevState;
}

function updateBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      cell = cells[i].children[j];
      if (board[i][j] != 0) {
        cell.style.backgroundColor = `rgb(0, 0, ${colorPalette[board[i][j]]})`;
        cell.style.transition = "500ms";
        cell.innerHTML = board[i][j];
      } else {
        cell.innerHTML = "";
        cell.style.backgroundColor = "rgb(14, 5, 2)";
      }
    }
  }
}

function shiftingValues(row) {
  let countsSums = 0;

  for (let index = 0; index < 3; index++) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] == 0) {
        for (let j = i; j < row.length - 1; j++) {
          row[j] = row[j + 1];
          row[j + 1] = 0;
        }
      }
    }

    // for (i = row.length - 1; i >= 1; i--) {
    //   if (row[i] == row[i - 1] && row[i] != 0) {
    //     row[i - 1] = row[i] * 2;
    //     row[i] = 0;
    //     countsSums++;
    //   }
    // }

    for (i = 0; i < row.length - 1; i++) {
      if (row[i] == row[i + 1] && row[i] != 0) {
        row[i] = row[i] * 2;
        row[i + 1] = 0;
        countsSums++;
      }
    }

    for (let i = 0; i < row.length; i++) {
      if (row[i] == 0) {
        for (let j = i; j < row.length - 1; j++) {
          row[j] = row[j + 1];
          row[j + 1] = 0;
        }
      }
    }
  }
  return countsSums * 10;
}

function transpose(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < i; j++) {
      let temp = board[i][j];
      board[i][j] = board[j][i];
      board[j][i] = temp;
    }
  }
  return board;
}

function miror(board) {
  for (let i = 0; i < board.length; i++) {
    board[i].reverse();
  }
  return board;
}

function getEmptyCells(board) {
  let emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  return emptyCells;
}

function generateAnotherNumInRandomEmptyCell(board) {
  let randomNumberToAdd;
  let randomNumber = Math.floor(Math.random() * 10);
  if (randomNumber < 8) {
    randomNumberToAdd = 2;
  } else {
    randomNumberToAdd = 4;
  }

  let emptyCells = getEmptyCells(board);
  let randomEmptyCell =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (randomEmptyCell != undefined) {
    let row = randomEmptyCell[0];
    let col = randomEmptyCell[1];
    board[row][col] = randomNumberToAdd;
    return board;
  }
  return board;
}

function checkWin(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 2048) {
        return true;
      } else {
        continue;
      }
    }
  }
  return false;
}

function checkLose(board) {
  let counter = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 0) {
        counter++;
        return false;
      }
    }
  }

  if (counter == 0) {
    for (let i = 0; i < board.length - 1; i++) {
      for (let j = 0; j < board[i].length - 1; j++) {
        if (board[i][j] == board[i + 1][j] || board[i][j] == board[i][j + 1]) {
          return false;
        }
      }
    }
  } else {
    return true;
  }
  return true;
}

///////////////////////// STOPWATCH //////////////////////////////
const timer = document.getElementById("stopwatch");
let hr = 0;
let min = 0;
let sec = 0;
let stoptime = true;

function startTimer() {
  if (stoptime == true) {
    stoptime = false;
    timerCycle();
  }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = "0" + sec;
    }
    if (min < 10 || min == 0) {
      min = "0" + min;
    }
    if (hr < 10 || hr == 0) {
      hr = "0" + hr;
    }

    timer.innerHTML = hr + ":" + min + ":" + sec;

    setTimeout("timerCycle()", 1000);
  }
}

function resetTimer() {
  hr = 0;
  min = 0;
  sec = 0;
  stoptime = true;
  timer.innerHTML = "00:00:00";
}

/////////

board = initializeBoard(board);
updateBoard(board);
