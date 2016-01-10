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
            var clickedColoumn = Number(this.val.split("-")[1]);
            var rowLength = board.length;
            var rowObj = findEmptyRow(clickedColoumn, rowLength - 1);
            //execute if empty slot present in that coloumn
            if (rowObj.available) {
                var insertionSlot = rowObj.slot + "-" + clickedColoumn;
                // colour the cell with above row and col value.
                for (var i = 0; i < stage.children.length; i++) {
                    if (stage.children[i].val !== undefined && stage.children[i].val === insertionSlot) {
                        if(currentplayer == "human")
                        stage.children[i].tint = 0xfff000;
                        else stage.children[i].tint = 0x000fff;

                        // finally update the board matrix for our internal calculation
                        if (rowObj.slot < lowestUnfilledRow) {
                            lowestUnfilledRow = rowObj.slot;
                            }
                        // add some non 0 value to know it's filled
                        board[rowObj.slot][clickedColoumn] = currentplayer;
                        //change the player turn.
                        changePlayer();
                    }
                }
            }
            renderer.render(stage);    
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
    
    
// #11, #12 - alternate the player turns
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
}
    
//#17 - check for horizontal connection winner.
function checkHorizontalConnect(){
    for (var i = board.length - 1; i >= lowestUnfilledRow; i--) {
        for (var j = 0; j < board[i].length; j++) {
            //check if the middle col has opposite players number
            var midCol = board[0].length - 4;
            var middleElement = board[i][midCol];
            if (middleElement !== currentplayer || middleElement === 0) {
                //No chance of horizontal match with this condition
                break;
            }
            //Horizontal Checker
            if (currentplayer === board[i][j] &&
                board[i][j] === board[i][j + 1] &&
                board[i][j] === board[i][j + 2] &&
                board[i][j] === board[i][j + 3] &&
                board[i][j + 3] !== undefined) {
                console.log("horizontal connection winner " + currentplayer);
                //displayMessage("horizontal connection winner " + currentplayer);
                return true;
            }
            else return false;
        }
    }
}
//#18 -  check for vertical connection winner.
function checkVerticalConnection(){
     for (var i = board.length - 1; i >= lowestUnfilledRow; i--) {
            for (var j = 0; j < board[i].length; j++) {
                if (i - 3 < 0) {
                    break;
                }
                if (currentplayer === board[i][j] &&
                    board[i][j] === board[i - 1][j] &&
                    board[i - 1][j] === board[i - 2][j] &&
                    board[i - 2][j] === board[i - 3][j] &&
                    board[i - 3] !== undefined) {
                    console.log("virtical connection winner "+currentplayer);
                    return true;
                }
                else return false;
            }
        }
}
//#19 - check for diagonal connection winner.
function checkDiagnolConnection(){
    //diagonally towards left
    for (var i = board.length - 1; i >= 3; i--) {
        for (var j = board[i].length - 1; j >= 0; j--) {
            if (board[i - 3] !== undefined &&
            currentplayer === board[i][j] &&
            board[i][j] === board[i - 1][j - 1] &&
            board[i - 1][j - 1] === board[i - 2][j - 2] &&
            board[i - 2][j - 2] === board[i - 3][j - 3]) {
                console.log("left diagnol connect winner "+currentplayer);
                return true;
            }
            else return false;
        }
    }

    //diagonally towards right
    for (var i = board.length - 1; i >= 3; i--) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i - 3] !== undefined &&
            currentplayer === board[i][j] &&
            board[i][j] === board[i - 1][j + 1] &&
            board[i - 1][j + 1] === board[i - 2][j + 2] &&
            board[i - 2][j + 2] === board[i - 3][j + 3]) {
                console.log("right diagnol connect winner "+currentplayer);
                return true;
            }
            else return false;
        }
    }
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
    if( checkHorizontalConnect() ||
    checkVerticalConnection() ||
    checkDiagnolConnection()){
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