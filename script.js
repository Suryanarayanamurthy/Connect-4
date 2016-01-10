var stage;
var renderer;
var Graphics;
requestAnimationFrame( animate );
var lowestUnfilledRow;
var currentplayer;
var board;
var tile;
var isCurrentPlayerWon;
var isGameOver;
var num_of_pieces;
var humanDisk = 0xfff000;
var AIsDisk = 0x000fff;
var isFirstMove;
var clickedColoumn;

	
function animate() {
	  requestAnimationFrame( animate );
	  // render the stage   
            
	 renderer.render(stage);
    
	}
    
    
function init(){
    Graphics = PIXI.Graphics;
    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0x66FF99);
    // create a renderer instance    
    renderer = PIXI.autoDetectRenderer(640, 500);

    // add the renderer view element to the DOM
    document.getElementById("gameContainer").appendChild(renderer.view);
    
    lowestUnfilledRow = 5;
    currentplayer = "human";
    
    displayMessage("");
    isCurrentPlayerWon = false;
    isGameOver = false;
    num_of_pieces = 0;
    isFirstMove = true;

    // keep another matrix internally to keep track of which cell is set,
    // and by whome and who is the winner etc,. we need a 2 dimention matrix to impliment the logic.
    board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
    ];

    //#8, #9 -  create a board with tiles and set click event for each of them.
    for (var i = 6; i >= 0; i--) {
    for (var j = 5; j >= 0; j--) {
    tile = new Graphics();
    tile.beginFill(0xffffff);
    tile.drawRect(110 + 60 * i, 80 + 55 * j, 50, 50);
    tile.endFill();
    tile.buttonMode = true;
    tile.interactive = true;
    tile.val = j + "-" + i;
    tile.on('mousedown', onTilesClick);
    stage.addChild(tile);
    }
    }

}
    
//#15, #10, #9- finding the bottom most available row and fill a disc.
function onTilesClick(){
    if(!isGameOver){
            // the val is saved as "rownum - colnum" so split on "-" and get the 1st element , that will be the column.
            clickedColoumn = Number(this.val.split("-")[1]);
            var rowLength = board.length;
            var rowObj = findEmptyRow(clickedColoumn, rowLength - 1);
            //execute if empty slot present in that coloumn
        if (rowObj.available) {
                var insertionSlot = rowObj.slot + "-" + clickedColoumn;
                dropDiskAt(insertionSlot);
        }
    }
    }
    
//#15, #10- finding the bottom most available row and fill a disc.
// search for a empty slot on the board by recurssion.
function findEmptyRow(a, index) {
    if (index === -1) {
        return {
            available: false,
            slot: -1
        }; // No empty slot in the col
    }
    if (board[index][a] === 0) {
        return {
            available: true,
            slot: index
        };
    }
    return findEmptyRow(a, index - 1);
}
    
    
// #11, #12 - alternate the player turns, if it's AI's turn get the nextsmartmove and do it.
function changePlayer(){
    checkCurrentGameStatus();
    if(!isGameOver){
        if(currentplayer == "human"){
            currentplayer = "AI";
        }
        else{
            currentplayer = "human";
        }
    }
    if(!isGameOver && currentplayer == "AI"){
        dropDiskAt(GetNextSmartMove());
    }
}

//#17 - check for horizontal connection winner.
function checkHorizontalConnect(checkForPlayer){
    var retVal = false;
    for (var i = board.length - 1; i >= lowestUnfilledRow; i--) {
        for (var j = 0; j < board[i].length; j++) {
            //check if the middle col has opposite players number
            var midCol = board[0].length - 4;
            var middleElement = board[i][midCol];
            if (middleElement !== checkForPlayer || middleElement === 0) {
                //No chance of horizontal match with this condition
                break;
            }
            //Horizontal Checker
            if (checkForPlayer === board[i][j] &&
                board[i][j] === board[i][j + 1] &&
                board[i][j] === board[i][j + 2] &&
                board[i][j] === board[i][j + 3] &&
                board[i][j + 3] !== undefined) {
                console.log("horizontal connection winner " + checkForPlayer);
                //displayMessage("horizontal connection winner " + currentplayer);
                return true;}
        }
    }
    return retVal;
}
//#18 -  check for vertical connection winner.
function checkVerticalConnection(checkForPlayer){
    var retVal = false;
     for (var i = board.length - 1; i >= lowestUnfilledRow; i--) {
            for (var j = 0; j < board[i].length; j++) {
                if (i - 3 < 0) {
                    break;
                }
                if (checkForPlayer === board[i][j] &&
                    board[i][j] === board[i - 1][j] &&
                    board[i - 1][j] === board[i - 2][j] &&
                    board[i - 2][j] === board[i - 3][j] &&
                    board[i - 3] !== undefined) {
                    console.log("virtical connection winner "+currentplayer);
                    return true;
                }
            }
        }
    return retVal;
}
//#19 - check for diagonal connection winner.
function checkDiagnolConnection(checkForPlayer){
    var retVal = false;
    //diagonally towards left
    for (var i = board.length - 1; i >= 3; i--) {
        for (var j = board[i].length - 1; j >= 0; j--) {
            if (board[i - 3] !== undefined &&
            checkForPlayer === board[i][j] &&
            board[i][j] === board[i - 1][j - 1] &&
            board[i - 1][j - 1] === board[i - 2][j - 2] &&
            board[i - 2][j - 2] === board[i - 3][j - 3]) {
                console.log("left diagnol connect winner "+currentplayer);
                return true;
            }
        }
    }

    //diagonally towards right
    for (var i = board.length - 1; i >= 3; i--) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i - 3] !== undefined &&
            checkForPlayer === board[i][j] &&
            board[i][j] === board[i - 1][j + 1] &&
            board[i - 1][j + 1] === board[i - 2][j + 2] &&
            board[i - 2][j + 2] === board[i - 3][j + 3]) {
                console.log("right diagnol connect winner "+currentplayer);
                return true;
            }
        }
    }
    return retVal;
}

//#20 - message board to display messages on the game's message board.
function displayMessage(msg){
    document.getElementById("msgBoard").innerHTML = msg;
}

//#13 - reset button to reset the game.
function resetgame(){
    document.getElementById("gameContainer").removeChild(renderer.view);
    init();
}

//#21 - check for the winner b4 changing the player
function checkCurrentGameStatus(){
    if( checkHorizontalConnect(currentplayer) ||
    checkVerticalConnection(currentplayer) ||
    checkDiagnolConnection(currentplayer)){
        isGameOver = true;
        displayMessage("Game Over , " + currentplayer+ " is the winner, click 'reset' to play again." );
    }
    else if (checkIfTie()){
        isGameOver = true;
        displayMessage("Game Over , Game is Tie... click 'reset' to play again." );
    }
}

//#25 - check if game is draw.
function checkIfTie(){
    console.log();
    // if the last available row for all the columns is not available, and the game is not wone by any1 then it's a draw
    if(!findEmptyRow(0, board.length - 1).available &&
       !findEmptyRow(1, board.length - 1).available &&
       !findEmptyRow(2, board.length - 1).available &&
       !findEmptyRow(3, board.length - 1).available &&
       !findEmptyRow(4, board.length - 1).available &&
      !findEmptyRow(5, board.length - 1).available &&
      !findEmptyRow(6, board.length - 1).available )
    {
        return true;
    }
    else false;
}

//#26, #22, #23, #24 - AI logic to finally decide on the move and do it.
function GetNextSmartMove(){
    var nextSmartMove;
    //generally it's a smart move to place the disk in the center.
    if(isFirstMove)
    {
        //not 1st time anymore ;-)
        isFirstMove = false;
        // check if the middle column is filled by the player
        var rowObj = findEmptyRow(3, board.length - 1);
        //execute if empty slot present in that coloumn
        if (rowObj.available) {
                nextSmartMove = rowObj.slot + "-3" ;
                return nextSmartMove;
        }
    }
    
    //#22, #23, #24 - check if next move is AI's win move then do it.
    nextSmartMove = findNextMove(currentplayer);
    if(nextSmartMove != undefined)
    return nextSmartMove;
    
    //#26 - else check if next move is human's win move then block it.
    nextSmartMove = findNextMove("human");
    if(nextSmartMove != undefined)
    return nextSmartMove;
    
    // else try putting a disk on the same column where the human has clicked.
    var rowObj = findEmptyRow(clickedColoumn, board.length - 1);
    //execute if empty slot present in that coloumn
    if (rowObj.available) {
    nextSmartMove = rowObj.slot + "-" + clickedColoumn;
    return nextSmartMove;
    }
    // else try putting the disk on the next available column.
    clickedColoumn =0;
    while(clickedColoumn < 7)
    {
        // dangerous piece of code, channces of infinate loop.
        //if(clickedColoumn == 6) clickedColoumn =0;
        rowObj = findEmptyRow(clickedColoumn++, board.length - 1);
        if (rowObj.available) {
        nextSmartMove = rowObj.slot + "-" + clickedColoumn;
        return nextSmartMove;
        }
    }
}
function dropDiskAt(slot){
    var insertionSlot = slot;
    // colour the cell with above row and col value.
    for (var i = 0; i < stage.children.length; i++) {
    if (stage.children[i].val !== undefined && stage.children[i].val === insertionSlot) {
    if(currentplayer == "human")
    stage.children[i].tint = humanDisk;
    else stage.children[i].tint = AIsDisk;
    // update the lowest unfilled row with the new value
    if (slot.split('-')[0] < lowestUnfilledRow) {
    lowestUnfilledRow = slot.split('-')[0];
    }
    // finally update the board matrix for our internal calculation
    // add some non 0 value to know it's filled
    board[slot.split('-')[0]][slot.split('-')[1]] = currentplayer;
    renderer.render(stage);
    //change the player turn.
    changePlayer();
    }
    }
}


//function setComputerMoves() {
//    
//    
//    var nextMove = findNextMove();
//    for (var i = 0; i < stage.children.length; i++) {
//        if (stage.children[i].val !== undefined && stage.children[i].val === nextMove.slot[0] + "-" + nextMove.slot[1]) {
//            stage.children[i].tint = colorComb[gameSettings.active];
//            stage.removeChild(message);
//        }
//    }
//    updateGameBoard(nextMove.slot[0], nextMove.slot[1]);
//}


//#22, #23, #24 - check if next move is success move the given user.
function findNextMove(checkForPlayer) {
    var col = 0;
    while (col < 7) {
        var row = findEmptyRow(col, board.length - 1);
        if (row.available) {
            board[row.slot][col] = checkForPlayer;
            var isFourConnectPossiable = ( checkHorizontalConnect(checkForPlayer) ||
                                        checkVerticalConnection(checkForPlayer) ||
                                        checkDiagnolConnection(checkForPlayer))

            if (isFourConnectPossiable) {
                //reset back to original val
                board[row.slot][col] = 0;    
                return row.slot+"-"+col;
            }
             //reset back to original val
            board[row.slot][col] = 0;
        }
        col++;
    }
}

//
///*
//	Check for our three consecutive occurrence/then opponents
//	then Check for our two consecutive occurrence/then opponents
//	then Check for our one consecutive occurrence/then opponents	
//	
//	Priority is for players winning move, or else block opponents winning move
//*/
//function selectBestMove(checkNum) {
//    //exit condition for recursive function 
//    if (directionFunctions.filter(dirIterationCheck).length === 0 && checkNum === 0) {
//        return {
//            status: false
//        } //game Over
//    } else if (directionFunctions.filter(dirIterationCheck).length === 0) {
//        //reset direction object to start next iteration
//        checkNum--;
//        directionFunctions.map(function(a) {
//            a.visited = false;
//        });
//    }
//    //console.log(directionFunctions)
//    //alert(checkNum);
//    var dirObj = direction();
//    var availability = dirObj.dirFn(checkNum, dirObj.player);
//    if (availability === undefined) {
//        return selectBestMove(checkNum);
//    } else {
//        directionFunctions.map(function(a) {
//            a.visited = false;
//        });
//        return {
//            status: true,
//            slot: availability
//        };
//    }
//}
//
//
////provides which direction to check next for a successful move
//function direction() {
//    var nextDir = directionFunctions.filter(getNextDirection);
//
//    function getNextDirection(val) {
//        return val.visited === false;
//    }
//    nextDir = nextDir.slice(0, 1);
//    nextDir[0].visited = true;
//    return nextDir[0];
//}
//
////to check if any dirObj ele left unvisited 
//function dirIterationCheck(a) {
//    return a.visited === false;
//}
//
////Check for horizontal success move
//function horizontalCheck(checkNum, currentPlayer) {
//    for (var i = board.length - 1; i >= gameSettings.lowestUnfilledRow; i--) {
//        for (var j = 0; j < board[i].length; j++) {
//            var loc = j + checkNum - 1;
//            if (board[i][loc] !== undefined) {
//                var slicedArray = board[i].slice(j, j + checkNum);
//                //console.log("horiz");
//                //console.log(currentPlayer);
//                //console.log(slicedArray)
//                //consecutive occurrence check
//                var isConsecutive = checkConsecutive(slicedArray, checkNum, gameSettings[currentPlayer]);
//                //console.log(isConsecutive)
//                if (isConsecutive) {
//                    //console.log(board[i][j-1])
//                    //console.log(board[i][loc])
//                    //console.log(board[i][loc+1]);
//                    //check if slot next to it are available for insertion
//                    if (board[i][j - 1] !== undefined && board[i][j - 1] === 0) {
//                        if (findEmptyRow(parseInt(j - 1), board.length - 1).slot === parseInt(i)) {
//                            return [parseInt(i), parseInt(j - 1)];
//                        }
//
//                    } else if (board[i][loc + 1] !== undefined && board[i][loc + 1] === 0) {
//                        if (findEmptyRow(parseInt(loc + 1), board.length - 1).slot === parseInt(i)) {
//                            return [parseInt(i), parseInt(loc + 1)];
//                        }
//
//                    } else {
//                        break;
//                    }
//
//                }
//            } else {
//                break;
//            }
//        }
//    }
//    return undefined;
//}
//
////Check for vertical success move
//function verticalCheck(checkNum, currentPlayer) {
//    for (var i = board.length - 1; i >= 0; i--) {
//        var loc = i - checkNum;
//        if (board[loc] != undefined) {
//            for (var j = 0; j < board[i].length; j++) {
//                var slicedArray = [];
//                if (board[loc][j] !== undefined) { //array out of bound check
//                    var count = 0;
//                    while (count < checkNum) {
//                        slicedArray.push(board[i - count][j]);
//                        count++;
//                    }
//                    var isConsecutive = checkConsecutive(slicedArray, checkNum, gameSettings[currentPlayer]);
//                    if (isConsecutive && board[loc][j] === 0) {
//                        console.log("ver cond")
//                        return [loc, j];
//                    }
//                } else {
//                    break;
//                }
//            }
//        } else {
//            break;
//        }
//    }
//    return undefined;
//}
//
////gives the consecutive occurence of a color
//function checkConsecutive(a, limit, val) {
//    if (a.length < limit || a.indexOf(0) !== -1) {
//        return false;
//    } else {
//        for (var i = 1; i < a.length; i++) {
//            if (a[i - 1] !== a[i]) {
//                return false;
//            } else if (a[i] !== val) {
//                return false;
//            }
//        }
//    }
//    return true;
//}
