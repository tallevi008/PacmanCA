'use strict';
const PACMAN = '🤓';

var gPacman;
var gTimeoutInvincible;


function createPacman(board) {
    gPacman = {
        location: {
            i: 6,
            j: 6
        },
        isSuper: false,
        rotation: 0
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(ev) {
    if (!gGame.isOn) return;

    // use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev);
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];
    // return if cannot move
    if (nextCellContent === WALL) return;
    // hitting a ghost?  call gameOver
    if (nextCellContent === GHOST) {
        if (!gPacman.isSuper) {
            gameOver();
            return;
        }
        else killGhost(nextLocation);
    }
    //pacman hit cherry
    if (nextCellContent === CHERRY) updateScore(15, true);
    //pacman eat food
    else if (nextCellContent === FOOD) updateScore(1);
    //changes to pacman ater eating power food
    if (nextCellContent === POWERFOOD) {
        if (!gPacman.isSuper)
            pacmanInvincible();
        else return;
    }


    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // update the DOM
    renderCell(gPacman.location, EMPTY);
    // Move the pacman
    gPacman.location = nextLocation;
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the DOM
    renderCell(gPacman.location, getPacmanHTML());

}


function pacmanInvincible() {
    gPacman.isSuper = true;
    gTimeoutInvincible = setTimeout(function () {
        gPacman.isSuper = false;
    }, 5000)

}



function getNextLocation(ev) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };
    // figure out nextLocation
    switch (ev.key) {
        case 'ArrowDown':
            nextLocation.i++;
            gPacman.rotation = 0;
            break;
        case 'ArrowUp':
            gPacman.rotation = 180;
            nextLocation.i--;
            break;
        case 'ArrowLeft':
            gPacman.rotation = 90;
            nextLocation.j--;
            break;
        case 'ArrowRight':
            gPacman.rotation = -90;
            nextLocation.j++;
            break;
    }

    return nextLocation;
}

function getPacmanHTML() {

    return `<span style="transform: rotate(${gPacman.rotation}deg); display: inline-block;">${PACMAN}</span>`;
}
