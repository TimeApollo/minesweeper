'use strict'

function Board({ height , width , numOfMines , minesAdjacentToCell }){
    this.rows = height;
    this.columns = width;
    this.minesCount = numOfMines;
    this.minesAdjacentToCell = minesAdjacentToCell;
    this.boardGrid = [];
    this.elementGrid = [];

    for ( let row = 0 ; row < this.rows ; row ++ ){
        let rowArr = []
        for ( let column = 0 ; column < this.columns ; column++ ){
            rowArr.push(0);
        }
        this.boardGrid.push(rowArr);
    }
    this.createElements()
        .placeMines()
        .fillNumbersOnBoard();
}

Board.prototype.createElements = function(){
    this.boardGrid.forEach((row , rowIndex ) => {
        let rowArr = [];
        let rowDiv = document.createElement('div');
        rowDiv.classList.add("row");
        rowDiv.dataset.rowIndex = rowIndex;
        row.forEach((cell , columnIndex ) => {
            cell = document.createElement('div');
            cell.classList.add('cell','cover');
            cell.dataset.rowIndex = rowIndex;
            cell.dataset.columnIndex = columnIndex;
            cell.isClicked = false;
            cell.hasFlag = false;
            cell.addEventListener( "click" , this );
            cell.addEventListener( 'contextmenu' , this );
            rowDiv.appendChild(cell);
            rowArr.push(cell);
        })
        this.elementGrid.push(rowArr);
        boardElementContainter.appendChild(rowDiv)
    })
    console.log('element reference' , this.elementGrid)
    return this;
}

Board.prototype.placeMines = function(){
    let mine = this.minesCount
    while (mine) {
        let [ mineRow , mineCol ] = this.randomCoordinateGenerator();
        if(this.boardGrid[mineRow][mineCol] === "mine") continue;

        this.boardGrid[mineRow][mineCol] = "mine";
        this.elementGrid[mineRow][mineCol].classList.add("mine");
        mine--;
    }
    console.log("mines placed" , this.boardGrid);
    return this;
}

Board.prototype.randomCoordinateGenerator = function ( ) {
    return [Math.floor ( Math.random ( ) * Math.floor ( this.rows ) ),
            Math.floor ( Math.random ( ) * Math.floor ( this.columns ) ) ];
}

Board.prototype.fillNumbersOnBoard = function(){
    this.boardGrid.forEach(( row , rowIndex ) => {
        row.forEach(( cell , cellIndex ) => {
            this.minesAdjacentToCell = 0;
            if(cell !== "mine") {
                this.checkRight( rowIndex , cellIndex , row.length , this.checkForMines );
                this.checkLeft( rowIndex , cellIndex , this.checkForMines );
                this.checkAbove( rowIndex , cellIndex , this.checkForMines );
                this.checkBelow( rowIndex , cellIndex , this.boardGrid.length , this.checkForMines );
                this.checkAboveRight( rowIndex , cellIndex , row.length , this.checkForMines );
                this.checkAboveLeft( rowIndex , cellIndex , this.checkForMines );
                this.checkBelowRight( rowIndex , cellIndex , this.boardGrid.length , row.length , this.checkForMines );
                this.checkBelowLeft( rowIndex , cellIndex , this.boardGrid.length , this.checkForMines );

                this.boardGrid[rowIndex][cellIndex] = this.minesAdjacentToCell;
            }
            this.fillElementsGrid( rowIndex , cellIndex , cell );
        })
    })
    console.log("values calculated" , this.boardGrid);
    console.log("elements" , this.elementGrid)
    return this
}

Board.prototype.checkForMines = function( row , column , xOffset , yOffset ) {
    if(this.boardGrid[row + xOffset][column + yOffset] === "mine"){
        this.minesAdjacentToCell += 1;
    }
}

Board.prototype.fillElementsGrid = function( rowIndex , cellIndex , cell ){
    if( cell === "mine"){
        this.elementGrid[rowIndex][cellIndex].textContent = '*';
        this.elementGrid[rowIndex][cellIndex].dataset.value = "mine";
    }else if( this.boardGrid[rowIndex][cellIndex] > 0 ){
        this.elementGrid[rowIndex][cellIndex].textContent = this.minesAdjacentToCell;
        this.elementGrid[rowIndex][cellIndex].dataset.value = this.minesAdjacentToCell;
    }else{
        this.elementGrid[rowIndex][cellIndex].textContent = ' ';
        this.elementGrid[rowIndex][cellIndex].dataset.value = 0;
    }
}

Board.prototype.handleEvent = function(event){
    let rowIndex = Number(event.currentTarget.dataset.rowIndex);
    let colIndex = Number(event.currentTarget.dataset.columnIndex);
    let currentElementCell = this.elementGrid[rowIndex][colIndex];
    let currentBoardCell = this.boardGrid[rowIndex][colIndex];
    if( event.type === "click" ){
        if( currentElementCell.isClicked === false ){
            if( currentElementCell.hasFlag === false ){
                if( currentBoardCell === "mine"){
                    currentElementCell.classList.remove("cover");
                }else if( this.boardGrid[rowIndex][colIndex] === 0){
                    this.fillBlanksOnBoard( rowIndex , colIndex );
                }else {
                    this.setCellToClickedNumber( rowIndex , colIndex );
                }
            }
        }else{
            this.autoClickNumbersAroundMines( rowIndex , colIndex );
        }
    }else if( event.type === 'contextmenu' ){
        event.preventDefault();
        if(!currentElementCell.isClicked){
            this.flipFlag(event);
        }
        return false;
    }
}

Board.prototype.flipFlag = function( event ){
    if(event.currentTarget.hasFlag === true){
        event.currentTarget.hasFlag = false;
        event.currentTarget.classList.remove("flag");
    }else{
        event.currentTarget.hasFlag = true;
        event.currentTarget.classList.add("flag");
    }
}

Board.prototype.fillBlanksOnBoard = function( rowIndex , colIndex ) {
    this.queue = [];
    this.setCellToBlank( rowIndex , colIndex );
    let currentRowIndex = 0 , currentColIndex  = 0;

    while (this.queue.length){
        [ currentRowIndex , currentColIndex ] = this.queue.shift();
        this.checkRight(currentRowIndex , currentColIndex , this.columns , this.checkForBlanksOrNumbers );
        this.checkLeft( currentRowIndex , currentColIndex , this.checkForBlanksOrNumbers );
        this.checkAbove( currentRowIndex , currentColIndex , this.checkForBlanksOrNumbers );
        this.checkBelow( currentRowIndex , currentColIndex , this.boardGrid.length , this.checkForBlanksOrNumbers );
        this.checkAboveRight( currentRowIndex , currentColIndex , this.columns , this.checkForBlanksOrNumbers );
        this.checkAboveLeft( currentRowIndex , currentColIndex , this.checkForBlanksOrNumbers );
        this.checkBelowRight( currentRowIndex , currentColIndex , this.boardGrid.length , this.columns , this.checkForBlanksOrNumbers );
        this.checkBelowLeft( currentRowIndex , currentColIndex , this.boardGrid.length , this.checkForBlanksOrNumbers );
        
    }
} 

Board.prototype.setCellToBlank = function( rowIndex , colIndex , queue ){
    this.elementGrid[rowIndex][colIndex].classList.add("blank");
    this.elementGrid[rowIndex][colIndex].classList.remove("cover");
    this.elementGrid[rowIndex][colIndex].isClicked = true;
    this.queue.push([rowIndex , colIndex]);
}

Board.prototype.setCellToClickedNumber = function ( row , column ){
    this.elementGrid[row][column].isClicked = true;
    this.elementGrid[row][column].classList.remove("cover");
}

Board.prototype.checkForBlanksOrNumbers = function( row , column , xOffset , yOffset ) {
    if(this.elementGrid[row + xOffset][(column + yOffset)].isClicked === false){
        if(this.boardGrid[row + xOffset][(column + yOffset)] === 0){
            this.setCellToBlank( row + xOffset , column + yOffset )
        }else{
            this.setCellToClickedNumber( row + xOffset , column + yOffset );
        }
    }
}

Board.prototype.autoClickNumbersAroundMines = function( rowIndex , colIndex ){
    let cellElement = this.elementGrid[rowIndex][colIndex];
    let cellBoard = this.boardGrid[rowIndex][colIndex];
    this.flagsArr = [];
    this.minesArr = [];
    this.nonClickedCells = [];
    this.minesEqualFlags = false;
    this.flagsAdjacentToCell = 0;
    this.minesAdjacentToCell = 0;
    this.countFlags( rowIndex , colIndex );
    this.countMines( rowIndex , colIndex );
    if( this.flagsArr.length && this.flagsArr.length === this.minesArr.length){
        this.minesEqualFlags = true;
        while( this.flagsArr.length && this.minesEqualFlags ){
            let [ flagsRow , flagsCol ] = this.flagsArr.shift();
            let [ minesRow , minesCol ] = this.minesArr.shift();
            if( flagsRow !== minesRow || flagsCol !== minesCol ){
                this.minesEqualFlags = false;
            }

        }
    }if(this.minesEqualFlags){
        this.nonClickedCells.forEach(cell => {
            let [ row , col ] = cell;
            if(this.boardGrid[ row ][ col ] === 0 && !this.elementGrid[ row ][ col ].isClicked ){
                this.fillBlanksOnBoard( row , col );
            }else if( this.boardGrid[ row ][ col ] > 0 && !this.elementGrid[ row ][ col ].isClicked ){
                this.setCellToClickedNumber( row , col );
            }
        })
    }
}

Board.prototype.countFlags = function( rowIndex , colIndex ){
    this.checkRight( rowIndex , colIndex , this.columns , this.countedFlags );
    this.checkLeft( rowIndex , colIndex , this.countedFlags );
    this.checkAbove( rowIndex , colIndex , this.countedFlags );
    this.checkBelow( rowIndex , colIndex , this.boardGrid.length , this.countedFlags );
    this.checkAboveRight( rowIndex , colIndex , this.columns , this.countedFlags );
    this.checkAboveLeft( rowIndex , colIndex , this.countedFlags );
    this.checkBelowRight( rowIndex , colIndex , this.boardGrid.length , this.columns , this.countedFlags );
    this.checkBelowLeft( rowIndex , colIndex , this.boardGrid.length , this.countedFlags );
    console.log(this.flagsAdjacentToCell);
    console.log("flags" , this.flagsArr )
}

Board.prototype.countedFlags = function( rowIndex , colIndex , xOffset , yOffset ){
    if(this.elementGrid[rowIndex + xOffset][colIndex + yOffset].hasFlag){
        this.flagsAdjacentToCell += 1;
        this.flagsArr.push( [ rowIndex + xOffset , colIndex + yOffset ] );
    }else{
        this.nonClickedCells.push( [ rowIndex + xOffset , colIndex + yOffset ] );
    }
}

Board.prototype.countMines = function( rowIndex , colIndex ){
    this.checkRight( rowIndex , colIndex , this.columns , this.countedMines );
    this.checkLeft( rowIndex , colIndex , this.countedMines );
    this.checkAbove( rowIndex , colIndex , this.countedMines );
    this.checkBelow( rowIndex , colIndex , this.boardGrid.length , this.countedMines );
    this.checkAboveRight( rowIndex , colIndex , this.columns , this.countedMines );
    this.checkAboveLeft( rowIndex , colIndex , this.countedMines );
    this.checkBelowRight( rowIndex , colIndex , this.boardGrid.length , this.columns , this.countedMines );
    this.checkBelowLeft( rowIndex , colIndex , this.boardGrid.length , this.countedMines );
}

Board.prototype.countedMines = function( rowIndex , colIndex , xOffset , yOffset ){
    if(this.boardGrid[rowIndex + xOffset][colIndex + yOffset] === 'mine' ){
        this.minesAdjacentToCell += 1;
        this.minesArr.push([ rowIndex + xOffset , colIndex + yOffset ]);
    }
}


Board.prototype.checkRight = function( rowIndex , cellIndex , rowLength , callBack ){
    if( cellIndex < rowLength - 1 ) {
       callBack.bind( this , rowIndex , cellIndex , 0 , 1 )();
    }
}

Board.prototype.checkLeft = function( rowIndex , cellIndex , callBack ){
    if( cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , 0 , -1 )();
    }
}

Board.prototype.checkAbove = function( rowIndex , cellIndex , callBack ){
    if( rowIndex ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , 0 )();
    }
}

Board.prototype.checkBelow = function( rowIndex , cellIndex , boardGridLength , callBack ){
    if( rowIndex < boardGridLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , 0 )();
    }
}

Board.prototype.checkAboveRight = function( rowIndex , cellIndex , rowLength , callBack ){
    if( rowIndex && cellIndex < rowLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , 1 )();
    }
}

Board.prototype.checkAboveLeft = function( rowIndex , cellIndex , callBack ){
    if( rowIndex && cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , -1 )();
    }
}

Board.prototype.checkBelowRight = function( rowIndex , cellIndex , boardGridLength , rowLength , callBack){
    if( rowIndex < boardGridLength - 1 && cellIndex < rowLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , 1 )();
    }
}

Board.prototype.checkBelowLeft = function( rowIndex , cellIndex , boardGridLength , callBack ){
    if( rowIndex < boardGridLength - 1 && cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , -1 )();
    }
}