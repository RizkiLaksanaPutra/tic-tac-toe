"use strict";

const Player = (sign) => {
  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setField, getField, reset };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 0;
  let isOver = false;

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const reset = () => {
    round = 0;
    isOver = false;
  };

  const getIsOver = () => {
    return isOver;
  };

  const checkWinner = (fieldIndex) => {
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCondition
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }

    round++;

    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }

    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign()}'s turn`
    );
  };

  return { getIsOver, reset, playRound };
})();

const displayController = (() => {
  const messageElement = document.getElementById("message");
  const fieldElements = document.querySelectorAll(".field");
  const restartButton = document.getElementById("restart-button");

  const updateGameBoard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  restartButton.addEventListener("click", () => {
    gameBoard.reset();
    gameController.reset();
    updateGameBoard();
    setMessageElement("Player X's turn");
  });

  fieldElements.forEach((field) => {
    field.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameBoard();
    });
  });

  return { setMessageElement, setResultMessage };
})();
