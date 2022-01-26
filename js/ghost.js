'use strict';
const GHOST = '&#9781;';

var gGhosts = [];
var gEatenGhosts = [];
var gIntervalGhosts;
var gIntervalBackToLife;

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        color: getRandomColor(),
        currCellContent: FOOD
    };
    gGhosts.push(ghost);
    //model
    board[ghost.location.i][ghost.location.j] = GHOST;
}

// 3 ghosts and an interval
function createGhosts(board, numOfGhosts) {
    gGhosts = [];
    for (var i = 0; i < numOfGhosts; i++) {
        createGhost(board);
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000);
}

// loop through ghosts
function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        moveGhost(gGhosts[i]);
    }
}
function moveGhost(ghost) {
    // figure out moveDiff, nextLocation, nextCell
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    };
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];

    // return if cannot move
    if (nextCellContent === WALL || nextCellContent === GHOST) return;
    // hitting a pacman?  call gameOver
    if (nextCellContent === PACMAN && !gPacman.isSuper) {
        gameOver();
        return;
    }

    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent);
    // Move the ghost
    ghost.location = nextLocation;
    ghost.currCellContent = nextCellContent;
    // update the model
    gBoard[ghost.location.i][ghost.location.j] = GHOST;
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost));

}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 };
    } else if (randNum < 50) {
        return { i: -1, j: 0 };
    } else if (randNum < 75) {
        return { i: 0, j: -1 };
    } else {
        return { i: 1, j: 0 };
    }
}


function getGhostHTML(ghost) {
    var color = (gPacman.isSuper) ? '#ff0000' : ghost.color;
    return `<span style="color:${color};">${GHOST}</span>`;
}

function killGhost(location) {
    var idx = getGhostIdxByLocation(location);
    //No need to rander in DOM because we already randering pacman in that cell.
    var ghost = [];
    ghost = gGhosts.splice(idx, 1)[0];
    gEatenGhosts.push(ghost);

    gIntervalBackToLife = setTimeout(function () {
        gGhosts.push(...gEatenGhosts);
        gEatenGhosts = [];
    }, 5000);
}

function getGhostIdxByLocation(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i];
        if (currGhost.location.i === location.i && currGhost.location.j === location.j)
            return i;
    }
}