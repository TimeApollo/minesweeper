'use strict'

const inputs = {
    height: 10 ,
    width: 10 ,
    numOfMines: 10 ,
}

let boardElementContainter = document.getElementById( "boardContainer" );

let currentBoard = new Board( inputs.height , inputs.width , inputs.numOfMines );
currentBoard.createElements();

currentBoard.placeMines();