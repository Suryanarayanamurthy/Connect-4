doSomething = function (){
	
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99);
	
	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(640, 500);
	
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);
    
    Graphics = PIXI.Graphics;
	
	requestAnimationFrame( animate );
	
	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("resourses/bunny.png");
	// create a new Sprite using the texture
	var bunny = new PIXI.Sprite(texture);
	
	// center the sprites anchor point
	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;
	
	// move the sprite t the center of the screen
	bunny.position.x = 200;
	bunny.position.y = 150;
	
	stage.addChild(bunny);
	
	function animate() {
	
	    requestAnimationFrame( animate );
	
	    // just for fun, lets rotate mr rabbit a little
	    bunny.rotation += 0.1;
		
	    // render the stage   
	    renderer.render(stage);
	}
    
// create a board with tiles and set click event for each of them.
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
    function onTilesClick()
    {
    }
    
    

};
