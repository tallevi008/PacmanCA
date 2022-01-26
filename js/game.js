'use strict';
const WALL = '💈';
const FOOD = '🔹';
const EMPTY = '';
const POWERFOOD = '🥑';
const CHERRY = ' 🍒';


var gBoard;
var isAllFoodCollected;
var gFoodCount;
var gIntervalCherry;
var gGame = {
    score: 0,
    cherriesScore: 0,
    isOn: false
};

function init() {
    gGame.score = 0;
    gGame.cherriesScore = 0;
    gFoodCount = 0;

    var elModal = document.querySelector('.modal');
    elModal.hidden = true;
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score;

    gBoard = buildBoard();
    createGhosts(gBoard, 3);
    createPacman(gBoard);
    printMat(gBoard, '.board-container');
    gIntervalCherry = setInterval(addCherry, 15000)

    gGame.isOn = true;
    isAllFoodCollected = false;
    gPacman.isSuper = false;

}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;


            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;

            }
            if (board[i][j] === FOOD) ++gFoodCount;

        }

    }
    //minus 5 because of pacman location and super food 57
    board[1][1] = POWERFOOD;
    board[8][8] = POWERFOOD;
    board[1][8] = POWERFOOD;
    board[8][1] = POWERFOOD;

    gFoodCount -= 5;
    return board;
}



// update model and dom
function updateScore(diff, isCherry = false) {
    // model
    // gGame[isCherry ? 'cherriesScore' : 'score'] += diff
    (isCherry) ? gGame.cherriesScore += diff : gGame.score += diff;

    //dom
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score + gGame.cherriesScore;
    if (gGame.score === gFoodCount) {
        isAllFoodCollected = true;
        gameOver();
    }
}

function addCherry() {
    var emptyCells = findEmptyCells();
    if (!emptyCells.length) return;
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    var cellLocation = emptyCells[idx];
    // model
    gBoard[cellLocation.i][cellLocation.j] = CHERRY;
    //DOM
    renderCell(cellLocation, CHERRY);

}


// TODO
function gameOver() {

    var elModal = document.querySelector('.modal');
    var elModalspan = elModal.querySelector('span');

    if (isAllFoodCollected) elModalspan.innerText = 'victorious';
    else elModalspan.innerText = 'You lose';

    elModal.hidden = false;
    gGame.isOn = false;

    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    clearTimeout(gTimeoutInvincible);
    gTimeoutInvincible = null;
    clearInterval(gIntervalCherry);
    gIntervalCherry = null;


}

