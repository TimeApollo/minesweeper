'use strict'

const inputs = {
    height: 10 ,
    width: 6 ,
    numOfMines: 10 ,
    minesAdjacentToCell: 0
}

let boardElementContainter = document.getElementById( "boardContainer" );
let minesCountDiplay = document.getElementById("minesCount");
let resetButton = document.getElementById('resetButton');
let timer = document.getElementById('timer');

let currentBoard = new Board( inputs );

resetButton.addEventListener("click", function(){
    clearInterval( currentBoard.timer );
    while( boardElementContainter.lastChild ){
        boardElementContainter.removeChild(boardElementContainter.lastChild);
    }
    
    setTimeout(() => {
        currentBoard = new Board( inputs )
    }, 0);
})