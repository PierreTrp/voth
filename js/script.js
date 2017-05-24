/*  scrolling level */

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'TutContainer', { preload: preload, create: create, update:update });
var upKey;
var downKey;
var leftKey;
var rightKey;
//level array
var levelData=
        [[1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]];

//x & y values of the direction vector for character movement
var dX=0;
var dY=0;
var tileWidth=50;// the width of a tile
var borderOffset = new Phaser.Point(250,50);//to centralise the isometric level display
var wallGraphicHeight=98;
var floorGraphicWidth=103;
var floorGraphicHeight=53;
var heroGraphicWidth=41;
var heroGraphicHeight=62;
var wallHeight=wallGraphicHeight-floorGraphicHeight;
var heroHeight=(floorGraphicHeight/2)+(heroGraphicHeight-floorGraphicHeight)+6;//adjustments to make the legs hit the middle of the tile for initial load
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2);//for placing hero at the middle of the tile
var facing='south';//direction the character faces
var sorcerer;//hero
var sorcererShadow;//duh
var shadowOffset=new Phaser.Point(heroWidth+7,11);
var bmpText;//title text
var normText;//text to display hero coordinates
var gameScene;//this is the render texture onto which we draw depth sorted scene
var floorSprite;
var wallSprite;
var heroMapTile=new Phaser.Point(3,3);//hero tile making him stand at centre of scene
var heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
var hero2DVolume = new Phaser.Point(30,30);//now that we dont have a minimap & hero map sprite, we need this
var cornerMapPos=new Phaser.Point(0,0);
var cornerMapTile=new Phaser.Point(0,0);
var halfSpeed=0.7;
var visibleTiles=new Phaser.Point(6,6);



var doWalk = false;
var targetMap = {};
var canAlreadyMove = true;


function update() {

    //check key press
    detectKeyInput();
    //if no key is pressed then stop else play walking animation
    if (dY == 0 && dX == 0) {
        sorcerer.animations.stop();
        sorcerer.animations.currentAnim.frame = 0;
    } else {
        if (sorcerer.animations.currentAnim != facing) {
            sorcerer.animations.play(facing);
        }
    }


    /*custom handle move */

    var currentMapTile = getTileCoordinates(heroMapPos, tileWidth);

    if (dY == -1 && canAlreadyMove == true) {

        targetMap.x = currentMapTile.x;
        targetMap.y = currentMapTile.y - 1;

        doWalk = true;
    }
    else if (dY == 1 && canAlreadyMove == true) {

        targetMap.x = currentMapTile.x;
        targetMap.y = currentMapTile.y + 1;

        doWalk = true;
    }
    else if (dX == -1 && canAlreadyMove == true) {

        targetMap.x = currentMapTile.x - 1;
        targetMap.y = currentMapTile.y;

        doWalk = true;
    }
    else if (dX == 1 && canAlreadyMove == true) {

        targetMap.x = currentMapTile.x + 1;
        targetMap.y = currentMapTile.y;

        doWalk = true;
    }


    if (doWalk) {

        doWalk = false;

        var tileType = levelData[targetMap.y][targetMap.x];

        if (tileType == 0) {
            heroMapTile.x = targetMap.x;
            heroMapTile.y = targetMap.y;
            canAlreadyMove = false;

            setTimeout(function () {
                canAlreadyMove = true;
            }, 250);

            //centralise the hero on the tile
            heroMapPos.x = (heroMapTile.x * tileWidth) + (tileWidth / 2);
            heroMapPos.y = (heroMapTile.y * tileWidth) + (tileWidth / 2);

            cornerMapPos.x -= 50 * dX;
            cornerMapPos.y -= 50 * dY;
            cornerMapTile = getTileCoordinates(cornerMapPos, tileWidth);

            renderScene();
        }
    }
}


function preload() {
    game.load.crossOrigin='Anonymous';
    //load all necessary assets
    game.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0');
    game.load.image('greenTile', 'https://dl.dropboxusercontent.com/s/nxs4ptbuhrgzptx/green_tile.png?dl=0');
    game.load.image('redTile', 'https://dl.dropboxusercontent.com/s/zhk68fq5z0c70db/red_tile.png?dl=0');
    game.load.image('heroTile', 'https://dl.dropboxusercontent.com/s/8b5zkz9nhhx3a2i/hero_tile.png?dl=0');
    game.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0');
    // game.load.image('floor', 'https://dl.dropboxusercontent.com/s/h5n5usz8ejjlcxk/floor.png?dl=0');
    // game.load.image('wall', 'https://dl.dropboxusercontent.com/s/uhugfdq1xcwbm91/block.png?dl=0');
    //game.load.atlasJSONArray('hero', 'https://dl.dropboxusercontent.com/s/hradzhl7mok1q25/hero_8_4_41_62.png?dl=0', 'https://dl.dropboxusercontent.com/s/95vb0e8zscc4k54/hero_8_4_41_62.json?dl=0');

    game.load.image('floor', 'img/grid1.png');
    game.load.image('wall', 'img/grid2.png');
    game.load.atlasJSONArray('hero', 'img/char.png', 'https://dl.dropboxusercontent.com/s/95vb0e8zscc4k54/hero_8_4_41_62.json?dl=0');
}


function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Scroll Tutorial', 18);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    game.stage.backgroundColor = '#cccccc';
    //we draw the depth sorted scene into this render texture
    gameScene=game.add.renderTexture(game.width,game.height);
    game.add.sprite(0, 0, gameScene);
    floorSprite= game.make.sprite(0, 0, 'floor');
    wallSprite= game.make.sprite(0, 0, 'wall');
    sorcererShadow=game.make.sprite(0,0,'heroShadow');
    sorcererShadow.scale= new Phaser.Point(0.5,0.6);
    sorcererShadow.alpha=0.4;
    createLevel();
    normText=game.add.text(10,360,"tap to change visible area "+visibleTiles.y +' x '+visibleTiles.x);

    game.input.activePointer.leftButton.onUp.add(changeVisibleTiles)
}
function changeVisibleTiles(){
    visibleTiles.x=Math.min(visibleTiles.x+1,levelData[0].length);
    visibleTiles.y=Math.min(visibleTiles.y+1,levelData.length);
    normText.text='visible : '+visibleTiles.y +' x '+visibleTiles.x;
}


function createLevel(){//create minimap
    addHero();
    heroMapPos=new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
    heroMapPos.x+=(tileWidth/2);
    heroMapPos.y+=(tileWidth/2);
    heroMapTile=getTileCoordinates(heroMapPos,tileWidth);
    renderScene();//draw once the initial state
}


function addHero(){
    // sprite
    sorcerer = game.add.sprite(-50, 0, 'hero', '1.png');// keep him out side screen area

    // animation
    sorcerer.animations.add('southeast', ['1.png','2.png','3.png','4.png'], 6, true);
    sorcerer.animations.add('south', ['5.png','6.png','7.png','8.png'], 6, true);
    sorcerer.animations.add('southwest', ['9.png','10.png','11.png','12.png'], 6, true);
    sorcerer.animations.add('west', ['13.png','14.png','15.png','16.png'], 6, true);
    sorcerer.animations.add('northwest', ['17.png','18.png','19.png','20.png'], 6, true);
    sorcerer.animations.add('north', ['21.png','22.png','23.png','24.png'], 6, true);
    sorcerer.animations.add('northeast', ['25.png','26.png','27.png','28.png'], 6, true);
    sorcerer.animations.add('east', ['29.png','30.png','31.png','32.png'], 6, true);
}


function renderScene(){
    gameScene.clear();//clear the previous frame then draw again
    var tileType=0;
    //let us limit the loops within visible area
    var startTileX=Math.max(0,0-cornerMapTile.x);
    var startTileY=Math.max(0,0-cornerMapTile.y);
    var endTileX=Math.min(levelData[0].length,startTileX+visibleTiles.x);
    var endTileY=Math.min(levelData.length,startTileY+visibleTiles.y);
    startTileX=Math.max(0,endTileX-visibleTiles.x);
    startTileY=Math.max(0,endTileY-visibleTiles.y);
    //check for border condition
    for (var i = startTileY; i < endTileY; i++)
    {
        for (var j = startTileX; j < endTileX; j++)
        {
            tileType=levelData[i][j];
            drawTileIso(tileType,i,j);
            if(i==heroMapTile.y&&j==heroMapTile.x){
                drawHeroIso();
            }
        }
    }
}


function drawHeroIso(){
    var isoPt= new Phaser.Point();//It is not advisable to create points in update loop
    var heroCornerPt=new Phaser.Point(heroMapPos.x-hero2DVolume.x/2+cornerMapPos.x,heroMapPos.y-hero2DVolume.y/2+cornerMapPos.y);
    isoPt=cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
    gameScene.renderXY(sorcererShadow,isoPt.x+borderOffset.x+shadowOffset.x, isoPt.y+borderOffset.y+shadowOffset.y, false);//draw shadow to render texture
    gameScene.renderXY(sorcerer,isoPt.x+borderOffset.x+heroWidth, isoPt.y+borderOffset.y-heroHeight, false);//draw hero to render texture
}


function drawTileIso(tileType,i,j){//place isometric level tiles
    var isoPt= new Phaser.Point();//It is not advisable to create point in update loop
    var cartPt=new Phaser.Point();//This is here for better code readability.
    cartPt.x=j*tileWidth+cornerMapPos.x;
    cartPt.y=i*tileWidth+cornerMapPos.y;
    isoPt=cartesianToIsometric(cartPt);
    //we could further optimise by not drawing if tile is outside screen.
    if(tileType==1){
        gameScene.renderXY(wallSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, false);
    }else{
        gameScene.renderXY(floorSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y, false);
    }
}


function detectKeyInput(){//assign direction for character & set x,y speed components
    if (upKey.isDown)
    {
        dY = -1;
    }
    else if (downKey.isDown)
    {
        dY = 1;
    }
    else
    {
        dY = 0;
    }
    if (rightKey.isDown)
    {
        dX = 1;
        if (dY == 0)
        {
            facing = "east";
        }
        else if (dY==1)
        {
            facing = "southeast";
            dX = dY=halfSpeed;
        }
        else
        {
            facing = "northeast";
            dX=halfSpeed;
            dY=-1*halfSpeed;
        }
    }
    else if (leftKey.isDown)
    {
        dX = -1;
        if (dY == 0)
        {
            facing = "west";
        }
        else if (dY==1)
        {
            facing = "southwest";
            dY=halfSpeed;
            dX=-1*halfSpeed;
        }
        else
        {
            facing = "northwest";
            dX = dY=-1*halfSpeed;
        }
    }
    else
    {
        dX = 0;
        if (dY == 0)
        {
            //facing="west";
        }
        else if (dY==1)
        {
            facing = "south";
        }
        else
        {
            facing = "north";
        }
    }
}

function cartesianToIsometric(cartPt){
    var tempPt=new Phaser.Point();
    tempPt.x=cartPt.x-cartPt.y;
    tempPt.y=(cartPt.x+cartPt.y)/2;
    return (tempPt);
}
function getTileCoordinates(cartPt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=Math.floor(cartPt.x/tileHeight);
    tempPt.y=Math.floor(cartPt.y/tileHeight);
    return(tempPt);
}
function getCartesianFromTileCoordinates(tilePt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=tilePt.x*tileHeight;
    tempPt.y=tilePt.y*tileHeight;
    return(tempPt);
}