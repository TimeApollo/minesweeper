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
    console.log("constructor" , this )
    console.log("this" , this.minesAdjacentToCell )
    console.log("no this" , minesAdjacentToCell )
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
    return this;
    console.log('element reference' , this.elementGrid)
    console.log(this.elementGrid[0][0])
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
    return this;
    console.log("mines placed" , this.boardGrid);
}

Board.prototype.randomCoordinateGenerator = function ( ) {
    return [Math.floor ( Math.random ( ) * Math.floor ( this.rows ) ),
            Math.floor ( Math.random ( ) * Math.floor ( this.columns ) ) ];
}

Board.prototype.fillNumbersOnBoard = function(){
    console.log("fill" , this)
    this.boardGrid.forEach(( row , rowIndex ) => {
        row.forEach(( cell , cellIndex ) => {
            this.minesAdjacentToCell = 0;
            if(cell !== "mine") {
                this.minesAdjacentToCell = this.checkRight( rowIndex , cellIndex , row.length , this.checkForMines );
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
    return this
    console.log("values calculated" , this.boardGrid);
    console.log("elements" , this.elementGrid)
}

Board.prototype.checkForMines = function( row , column , xOffset , yOffset ) {
    console.log("check for mine" , this)
    console.log("row" , row)
    console.log("xoffset" , xOffset)
    console.log("yoffset" , yOffset)
    console.log("looking for mines" , this.boardGrid[row][column + yOffset])
    if(this.boardGrid[row + xOffset][column + yOffset] === "mine"){
        console.log("i am getting here")
        this.minesAdjacentToCell += 1;
    }
}

Board.prototype.checkRight = function( rowIndex , cellIndex , rowLength , callBack ){
    console.log(callBack)
    console.log("check right" , this)
    if( cellIndex < rowLength - 1 ) {
        let helpfunction = callBack.bind( this , rowIndex , cellIndex , 0 , 1 );
        helpfunction();
    }
}

Board.prototype.checkLeft = function( rowIndex , cellIndex , callBack ){
    if( cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , 0 , -1 );
    }
}

Board.prototype.checkAbove = function( rowIndex , cellIndex , callBack ){
    if( rowIndex ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , 0 );
    }
}

Board.prototype.checkBelow = function( rowIndex , cellIndex , boardGridLength , callBack ){
    if( rowIndex < boardGridLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , 0 );
    }
}

Board.prototype.checkAboveRight = function( rowIndex , cellIndex , rowLength , callBack ){
    if( rowIndex && cellIndex < rowLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , 1 );
    }
}

Board.prototype.checkAboveLeft = function( rowIndex , cellIndex , callBack ){
    if( rowIndex && cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , -1 , -1 );
    }
}

Board.prototype.checkBelowRight = function( rowIndex , cellIndex , boardGridLength , rowLength , callBack){
    if( rowIndex < boardGridLength - 1 && cellIndex < rowLength - 1 ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , 1 );
    }
}

Board.prototype.checkBelowLeft = function( rowIndex , cellIndex , boardGridLength , callBack ){
    if( rowIndex < boardGridLength - 1 && cellIndex ) {
        callBack.bind( this , rowIndex , cellIndex , 1 , -1 );
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
    if( event.type === "click" ){
        if(this.elementGrid[rowIndex][colIndex].hasFlag === false){
            if(this.boardGrid[rowIndex][colIndex] === "mine"){
                event.currentTarget.classList.remove("cover");
            }else if( this.boardGrid[rowIndex][colIndex] === 0){
                this.fillBlanksOnBoard( rowIndex , colIndex );
            }else {
                this.setCellToClickedNumber( rowIndex , colIndex );
            }
        }
    }else if( event.type === 'contextmenu' ){
        event.preventDefault();
        this.flipFlag(event);
        if(!event.currentTarget.classList.contains("cover")){
            this.fillNumbersAroundMines( rowIndex , colIndex );
        }
        return false;
    }
}

Board.prototype.flipFlag = function(event){
    if(event.currentTarget.hasFlag === true){
        event.currentTarget.hasFlag = false;
        event.currentTarget.classList.remove("flag");
    }else{
        event.currentTarget.hasFlag = true;
        event.currentTarget.classList.add("flag");
    }
}

Board.prototype.fillBlanksOnBoard = function(rowIndex , colIndex ) {
    this.queue = [];
    this.setCellToBlank( rowIndex , colIndex );
    let currentRowIndex = 0 , currentColIndex  = 0;

    while (this.queue.length){
        [ currentRowIndex , currentColIndex ] = this.queue.shift();
        this.checkFillRight(currentRowIndex , currentColIndex , this.columns );
        this.checkFillLeft( currentRowIndex , currentColIndex );
        this.checkFillAbove( currentRowIndex , currentColIndex );
        this.checkFillBelow( currentRowIndex , currentColIndex , this.boardGrid.length );
        this.checkFillAboveRight( currentRowIndex , currentColIndex , this.columns );
        this.checkFillAboveLeft( currentRowIndex , currentColIndex );
        this.checkFillBelowRight( currentRowIndex , currentColIndex , this.boardGrid.length , this.columns );
        this.checkFillbelowLeft( currentRowIndex , currentColIndex , this.boardGrid.length );
        
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

Board.prototype.checkFillRight = function( rowIndex , cellIndex , rowLength ){
    if( cellIndex < rowLength - 1 ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , 0 , 1 );
    }
}

Board.prototype.checkFillLeft = function( rowIndex , cellIndex ){
    if( cellIndex ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , 0 , -1 );
    }
}

Board.prototype.checkFillAbove = function( rowIndex , cellIndex ){
    if( rowIndex ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , -1 , 0 );
    }
}

Board.prototype.checkFillBelow = function( rowIndex , cellIndex , boardGridLength ){
    if( rowIndex < boardGridLength - 1 ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , 1 , 0 );
    }
}

Board.prototype.checkFillAboveRight = function( rowIndex , cellIndex , rowLength ){
    if( rowIndex && cellIndex < rowLength - 1 ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , -1 , 1 );
    }
}

Board.prototype.checkFillAboveLeft = function( rowIndex , cellIndex ){
    if( rowIndex && cellIndex ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , -1 , -1 );
    }
}

Board.prototype.checkFillBelowRight = function( rowIndex , cellIndex , boardGridLength , rowLength ){
    if( rowIndex < boardGridLength - 1 && cellIndex < rowLength - 1 ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , 1 , 1 );
    }
}

Board.prototype.checkFillbelowLeft = function( rowIndex , cellIndex , boardGridLength ){
    if( rowIndex < boardGridLength - 1 && cellIndex ) {
        this.checkForBlanksOrNumbers( rowIndex , cellIndex , 1 , -1 );
    }
}