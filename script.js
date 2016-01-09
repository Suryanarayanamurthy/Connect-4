doSomething = function (){
	
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99);
	
	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(640, 500);
	
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);
    
    Graphics = PIXI.Graphics;
	
	requestAnimationFrame( animate );
    
    var lowestUnfilledRow = 5;
    
    var currentplayer = "human";
	
	
	function animate() {
	  requestAnimationFrame( animate );
	  // render the stage   
	 renderer.render(stage);
	}
    
    // keep another matrix internally to keep track of which cell is set,
    // and by whome and who is the winner etc,. we need a 2 dimention matrix to impliment the logic.
    var board = [
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
        var tile = new Graphics();
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
    
//#15, #10, #9- finding the bottom most available row and fill a disc.
function onTilesClick(){    
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
    checkHorizontalConnect();
    if(currentplayer == "human"){
        currentplayer = "AI";
    }
    else{
        currentplayer = "human";
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
                console.log("winner " + currentplayer);
                return true;
            }
        }
    }
}
    

        
        
    
};