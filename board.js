'use strict'

function Board( height , width , numOfMines ){
    this.rows = height;
    this.columns = width;
    this.minesCount = numOfMines;
    this.boardGrid = [];
    this.elementGrid = [];

    for ( let row = 0 ; row < this.rows ; row ++ ){
        let rowArr = []
        for ( let column = 0 ; column < this.columns ; column++ ){
            rowArr.push(0);
        }
        this.boardGrid.push(rowArr);
    }
}

Board.prototype.createElements = function(){
    for(let row of this.boardGrid){
        let rowArr = [];
        let rowDiv = document.createElement('div');
        rowDiv.classList.add("row");
        for (let cell of row){
            let cell = document.createElement('div');
            cell.classList.add('cell','cover')
            rowDiv.appendChild(cell);
            rowArr.push(cell);
        }
        this.elementGrid.push(rowArr);
        boardElementContainter.appendChild(rowDiv)
    }
    console.log('element reference' , this.elementGrid)
}

Board.prototype.placeMines = function(){
    let mine = this.minesCount
    while (mine) {
        let [ mineRow , mineCol ] = this.randomCoordinateGenerator();
        if(this.boardGrid[mineRow][mineCol] === "mine") continue;

        this.boardGrid[mineRow][mineCol] = "mine";
        mine--;
    }
    console.log("mines placed" , this.boardGrid);
}

Board.prototype.randomCoordinateGenerator = function(){
    return [Math.floor(Math.random() * Math.floor(this.rows)),
            Math.floor(Math.random() * Math.floor(this.columns))];
}
