/*document.addEventListener("DOMContentLoaded", function () {
    startScreen();
});*/

const main = document.querySelector("main");

let currentPlayer = "player1";

let player1Score = 0;
let player2Score = 0;

let gameOver = false;

function startScreen() {
    main.innerHTML = "";

    let startScreen = document.createElement("div");
    startScreen.className = "startScreen";
    main.appendChild(startScreen);

    startScreen.innerHTML += `
    <div id="startScreenText">
        <h1>Welcome to the Connect Four Game!</h1>
    </div>
    <div id="startScreenButtons">
        <button id="startGameButton">Starta Spelet</button>
        <button id="resetScoreButton">Nollställ Poäng</button>
    </div>`;

    document.getElementById("startGameButton").addEventListener("click", function () {
        createGameBoard();
    });

    document.getElementById("resetScoreButton").addEventListener("click", function () {
        resetScore();
    });
}
startScreen();

function createGameBoard() {
    gameOver = false;
    main.innerHTML = "";
    currentPlayer = "player1"

    let gameScreen = document.createElement("div");
    gameScreen.className = "gameScreen";
    main.appendChild(gameScreen);

    let gameBoard = document.createElement("div");
    gameBoard.className = "gameBoard";
    gameScreen.appendChild(gameBoard)

    const rows = 6;
    const cols = 7;

    for (let row = 0; row < rows; row++) {
        gameBoard[row] = new Array(cols).fill(null);
        for (let col = 0; col < cols; col++) {
            let gameBoardCell = document.createElement("div");
            gameBoardCell.className = "gameBoardCell";

            gameBoardCell.dataset.col = col;
            gameBoardCell.dataset.row = row;

            gameBoard.appendChild(gameBoardCell);

            gameBoardCell.addEventListener("click", function (e) {
                playerAction(e.target);
            })
        }
    }

    let gameInfo = document.createElement("div");
    gameInfo.className = "gameInfo";
    gameScreen.appendChild(gameInfo);

    gameInfo.innerHTML += `
    <div class="gameInfoActions" id="gameInfoQuit" title="Return to Start Menu"><img src="assets/close.png"></div>
    <div class="gameInfoActions" id="gameInfoRestart" title="Restart Game"><img src="assets/restart.png"></div>
    <div id="gameInfoCurrentAction">${currentPlayer.slice(0, 6)} ${currentPlayer.slice(6)}'s turn</div>
    `;

    document.getElementById("gameInfoQuit").addEventListener("click", function () {
        startScreen();
    });

    document.getElementById("gameInfoRestart").addEventListener("click", function () {
        createGameBoard();
    });
}

function updateGameInfoText(text) {
    document.getElementById("gameInfoCurrentAction").innerHTML = text;
}
// updateGameInfo("update player")

function playerAction(cell) {
    if (gameOver) return;

    const col = Number(cell.dataset.col);

    const columnCells = document.querySelectorAll(`.gameBoardCell[data-col="${col}"]`)

    console.log("Clicked on column: ", cell.dataset.col, ", ", "row: ", cell.dataset.row);

    for (let rowInColumn = columnCells.length - 1; rowInColumn >= 0; rowInColumn--) {
        if (!columnCells[rowInColumn].classList.contains("player1Disc") && !columnCells[rowInColumn].classList.contains("player2Disc")) {
            columnCells[rowInColumn].classList.add(`${currentPlayer}Disc`);

            if (checkForWin(columnCells[rowInColumn].dataset.row, columnCells[rowInColumn].dataset.col, currentPlayer)) {
                return;
            };


            if (currentPlayer === "player1") {
                currentPlayer = "player2";
            } else {
                currentPlayer = "player1";
            }
            // uppdatera fältet för vems tur det är i hörnet här
            updateGameInfoText(`${currentPlayer.slice(0, 6)} ${currentPlayer.slice(6)}'s turn`);
            return;
        }
    }
    document.getElementById("gameInfoCurrentAction").innerHTML = `${currentPlayer.slice(0, 6)} ${currentPlayer.slice(6)}'s turn` + "<br>the Column is full";
}

function checkForWin(row, col, currentPlayer) {
    row = Number(row);
    col = Number(col);

    function getCell(row, col) {
        if (row >= 0 && row < 6 && col >= 0 && col < 7) {
            return document.querySelector(`.gameBoardCell[data-col="${col}"][data-row="${row}"]`);
        }
        return null;
    }

    function checkDirection(rowIncrement, colIncrement) {
        let count = 1;

        for (let i = 1; i < 4; i++) {
            const nextRow = row + i * rowIncrement;
            const nextCol = col + i * colIncrement;
            const cell = getCell(nextRow, nextCol);
            if (cell && cell.classList.contains(`${currentPlayer}Disc`)
            ) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            const nextRow = row - i * rowIncrement;
            const nextCol = col - i * colIncrement;
            const cell = getCell(nextRow, nextCol);
            if (cell && cell.classList.contains(`${currentPlayer}Disc`)) {
                count++;
            } else {
                break;
            }
        }
        return count >= 4;
    }

    if (
        checkDirection(0, 1) ||
        checkDirection(1, 0) ||
        checkDirection(1, 1) ||
        checkDirection(1, -1)
    ) {
        endGame(currentPlayer);
        return true;
    }
}

function updatePlayerScore() {
    document.getElementById("player1Score").innerHTML = player1Score;
    document.getElementById("player2Score").innerHTML = player2Score;
}

function endGame(currentPlayer) {
    gameOver = true;
    updateGameInfoText(`${currentPlayer.slice(0, 6)} ${currentPlayer.slice(6)} won!`);
    if (currentPlayer === "player1") {
        player1Score++;

    } else {
        player2Score++;
    }
    updatePlayerScore();

    setTimeout(() => {
        if (confirm(`${currentPlayer} won! play again?`)) {
            createGameBoard();
        } else {
            startScreen();
        }
    }, 100); // Lite fördröjning för att spelaren ska se sista draget
}

function resetScore() {
    player1Score = 0;
    player2Score = 0;
    updatePlayerScore();
}