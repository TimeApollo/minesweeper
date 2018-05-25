'use strict'

const inputs = {
    height: 10 ,
    width: 6 ,
    numOfMines: 10 ,
    minesAdjacentToCell: 0
}

let boardElementContainter = document.getElementById( "boardContainer" );

let currentBoard = new Board( inputs );
// currentBoard.createElements();

// currentBoard.placeMines();

// currentBoard.fillNumbersOnBoard();