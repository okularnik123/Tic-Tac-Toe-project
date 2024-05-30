/*
 ** The GameController is responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
  playerOneSymbol = "X",
  playerTwoSymbol = "o"
) {
  const board = BoardController();
  let gameEnded = false;

  const resetGameDiv = document.querySelector(".resetGame");
  const players = [
    {
      name: playerOneName,
      symbol: playerOneSymbol,
      points: 0,
    },
    {
      name: playerTwoName,
      symbol: playerTwoSymbol,
      points: 0,
    },
  ];
  let activePlayer = players[0];

  const changePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getEndOfRound = () => gameEnded;
  const getActivePlayer = () => activePlayer;

  function playRound(cell) {
    if (cell === undefined) return;
    console.log(
      getActivePlayer().name + " place his symbol on " + cell + " cell"
    );
    board.placeSymbol(board.getBoard()[cell - 1], getActivePlayer().symbol);

    if (checkWin() == true) {
      screen.updateScreen();
      activePlayer.points++;
      screen.updatePoints(players[0].points, players[1].points);
      console.log(getActivePlayer.name + " wins!");
      gameEnded = true;
      resetGameDiv.style.display = "block";
      screen.showWinner(activePlayer);
      console.log("player one points: " + players[0].points);
      console.log("player two points: " + players[1].points);
      return;
    }
    if (checkIfBoardIsFull()) {
      screen.updateScreen();
      gameEnded = true;
      resetGameDiv.style.display = "block";
      screen.showTie();
      console.log("player one points: " + players[0].points);
      console.log("player two points: " + players[1].points);
      return;
    }
    changePlayer();
    screen.updateScreen();
  }
  function checkWin() {
    const combs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let comb of combs) {
      if (
        board.getBoard()[comb[0]].getValue() !== "" &&
        board.getBoard()[comb[0]].getValue() ===
          board.getBoard()[comb[1]].getValue() &&
        board.getBoard()[comb[1]].getValue() ===
          board.getBoard()[comb[2]].getValue()
      ) {
        return true;
      }
    }
    return false;
  }
  function checkIfBoardIsFull() {
    for (cell of board.getBoard()) {
      if (cell.getValue() === "") {
        return false;
      }
    }
    return true;
  }

  function resetGame() {
    for (const cell of board.getBoard()) {
      cell.addToCell("");
    }
    activePlayer = players[0];
    gameEnded = false;
    resetGameDiv.style.display = "none";
    screen.updateScreen();
  }
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getEndOfRound,
    resetGame,
  };
}

/*
 ** The GameBoard represents state of the board,
 ** the array is 2d representation of 3x3 board,
 ** each part of array hold cell, it also allowing
 ** to check if player can make a turn, and it
 ** telling cell to do this turn
 */
function BoardController() {
  const board = [];

  for (let i = 0; i < 9; i++) {
    board.push(Cell());
  }

  const getBoard = () => board;

  function placeSymbol(cell, playerSymbol) {
    if (cell.value === " ") {
      return;
    }
    cell.addToCell(playerSymbol);
  }

  return { placeSymbol, getBoard };
}

/*
 ** Cell represents one part of
 ** the game board, the value of cell
 ** depends on player symbol
 */
function Cell() {
  let value = "";

  function addToCell(playerSymbol) {
    value = playerSymbol;
  }
  const getValue = () => value;
  return { addToCell, getValue };
}

function ScreenController() {
  const playerTurnDiv = document.querySelector(".turn");
  const cells = document.querySelectorAll(".cell");
  const game = GameController();
  const resetGameDiv = document.querySelector(".resetGame");
  const playerOnePointsText = document.querySelector(".playerOnePoints");
  const playerTwoPointsText = document.querySelector(".playerTwoPoints");
  for (const cell of cells) {
    cell.addEventListener("click", (e) => {
      if (!game.getEndOfRound()) game.playRound(e.target.dataset.cell);
    });
  }
  resetGameDiv.addEventListener("click", () => {
    game.resetGame();
  });
  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    for (const cell of cells) {
      cell.innerHTML = "";
    }

    for (const cell of board) {
      if (cell.getValue() === "") {
        continue;
      } else if (cell.getValue() == "o") {
        cells[board.indexOf(cell)].innerHTML =
          '<img class="symbol" src="images/circle-icon.svg" />';
      } else if (cell.getValue() == "X") {
        cells[board.indexOf(cell)].innerHTML =
          '<img class="symbol" src="images/X-icon.svg" />';
      } else {
        console.log("error ---" + cell.getValue());
      }
    }
    playerTurnDiv.innerText = activePlayer.name + "'s turn";
  };
  const updatePoints = (playerOnePoints, playerTwoPoints) => {
    playerOnePointsText.innerText = "Player one points: " + playerOnePoints;
    playerTwoPointsText.innerText = "Player two points: " + playerTwoPoints;
  };
  const showWinner = (activePlayer) => {
    playerTurnDiv.innerText = activePlayer.name + " wins!";
  };
  const showTie = () => {
    playerTurnDiv.innerText = "It's Tie!";
  };
  return { updateScreen, showWinner, showTie, updatePoints };
}
const screen = ScreenController();
