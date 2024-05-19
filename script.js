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

  const players = [
    {
      name: playerOneName,
      symbol: playerOneSymbol,
    },
    {
      name: playerTwoName,
      symbol: playerTwoSymbol,
    },
  ];
  let activePlayer = players[0];

  const changePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  function printNewRound() {
    board.printBoard();
    console.log(`It's ${getActivePlayer().name}'s turn`);
  }
  function playRound(cell) {
    if (board.getBoard()[cell - 1].getValue() !== "[]") {
      console.log("zajeta");
      return;
    }
    console.log(
      getActivePlayer().name + " place his symbol on " + cell + " cell"
    );
    board.placeSymbol(board.getBoard()[cell - 1], getActivePlayer().symbol);

    if (checkWin() == true) {
      console.log(getActivePlayer().name + " wins!");
      return;
    }
    changePlayer();
    printNewRound();
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
        board.getBoard()[comb[0]].getValue() !== "[]" &&
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
  printNewRound();

  return { playRound };
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
  function printBoard() {
    console.log(
      board[0].getValue() +
        "|" +
        board[1].getValue() +
        "|" +
        board[2].getValue()
    );
    console.log("--------");
    console.log(
      board[3].getValue() +
        "|" +
        board[4].getValue() +
        "|" +
        board[5].getValue()
    );
    console.log("--------");
    console.log(
      board[6].getValue() +
        "|" +
        board[7].getValue() +
        "|" +
        board[8].getValue()
    );
  }
  return { printBoard, placeSymbol, getBoard };
}

/*
 ** Cell represents one part of
 ** the game board, the value of cell
 ** depends on player symbol
 */
function Cell() {
  let value = "[]";

  function addToCell(playerSymbol) {
    value = playerSymbol;
  }
  const getValue = () => value;
  return { addToCell, getValue };
}

const game = GameController();
