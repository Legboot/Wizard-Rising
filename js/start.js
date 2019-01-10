var enemies;
var player;
var scene;
var cursors;
var platforms;
var deathCounter = 0;
var move = 70;

//	FIRE
var lastFired = 0;
var fireBalls;
var fire;
var fireButton;

// JUMPS
var jumpButton;
var jump = -105;
var maxjumps = 1;
var extrajump = maxjumps;

//
var camera;
var layer;
var speed=0;

///

var FireBall = new Phaser.Class({

	Extends: Phaser.Physics.Arcade.Image,

	initialize:

	function fireBall (scene)
	{
		Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'bullet', null);

        this.setDepth(1);
        this.collideWorldBounds = true;
        this.speed = 100;
        this.lifespan = 1500;
        this.setScale(0.3,0.3);
        
        this._temp = new Phaser.Math.Vector2();
	},

	fire: function (player)
	{
		this.lifespan = 8000;
		
		this.exploded = false;
		this.setActive(true);	
		this.setVisible(true);
		
		this.body.reset(player.x, player.y);
        this.body.setSize(10, 10, true);
        
        if (player.body.rotation != -90)
        {
        	if(player.looking == 'left')
        	{	        			
        		player.body.rotation = 180;
    			this.x = player.x - 10;
        	}
        	else if (player.looking == 'right')
    		{
    			this.x = player.x + 10;
    		}
        }

		this.setAngle(player.body.rotation);
        var angle = Phaser.Math.DegToRad(player.body.rotation);

        var x = this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
	},

	update: function (time, delta)
    {			
        this.lifespan -= delta;
        
        if (this.lifespan <= 0)
        {
            this.kill();
        }    
	    else if (this.body.position.x < 10 || this.body.position.y < 10 || this.body.position.x > scene.cameras.main.width - 10 || this.body.position.y > scene.cameras.main.height - 10)
		{
		    this.kill();
		}
    },

    kill: function ()
    {	
		var boom = scene.physics.add.staticSprite(this.body.position.x, this.body.position.y);
		boom.setScale(0.4,0.4);	
		boom.anims.play('boom');
		
	    this.setActive(false);
	    this.setVisible(false);
	    this.body.stop();
	    this.destroy();
    }
});

var Enemy = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:

    function Enemy (scene)
    {
        this.sprite = Phaser.Physics.Arcade.Sprite.call(this, scene,100,100,'cachapa');

        this.setDepth(1);

        this.speed = 100;
        this.live = 3;
        this.checkOutOfBounds = false;
       	this.enableBody = true;
        //this.target = new Phaser.Math.Vector2();
    },
    /*
    launch: function ()
    {
      //  this.play('mine-anim');

        this.checkOutOfBounds = false;

      //  var p = Phaser.Geom.Rectangle.RandomOutside(spaceOuter, spaceInner);
        
      //  spaceInner.getRandomPoint(this.target);

        this.speed = Phaser.Math.Between(100, 400);

        this.setActive(true);
        this.setVisible(true);
        //this.setPosition(p.x, p.y);

       // this.body.reset(p.x, p.y);

        //var angle = Phaser.Math.Angle.BetweenPoints(p, this.target);

        //this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    },
	*/
    update: function (time, delta)
    {
    	if (Math.round(this.y) == Math.round(player.y + 8))
    	{	
  			
    		if (Math.round(this.x) == Math.round(player.x)) 
    		{	

    		}
	    		else
	    		{	
	    			this.body.velocity.x = -200;
	    		}

    	}
    	
    	
    	/*
       // var withinGame = spaceInner.contains(this.x, this.y);

        if (!this.checkOutOfBounds && withinGame)
        {
            this.checkOutOfBounds = true;
        }
        else if (this.checkOutOfBounds && !withinGame)
        {
            this.kill();
        }
        */
    },
    
    hit: function (x)
    {
    	this.live = this.live - x;
    	if (this.live <= 0)
    	{
    		this.kill();
    	}
    },

    kill: function ()
    {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
        this.destroy();
       // this.scene.launchEnemy();
    }

});

class start extends Phaser.Scene{

	preload()
	{
		this.load.image('start','assets/img/start.png');
		this.load.image('bullet','assets/bullet.png');
		this.load.image('cachapa','assets/New Piskel.png');
		this.load.spritesheet('Explosion','assets/explosion.bmp',{ frameWidth:16,frameHeight:16 });
		this.load.spritesheet('dude','assets/dude.png',{ frameWidth:32,frameHeight:48 });
	    this.load.image('tiles', 'assets/mytiles.png');
		scene = this;
	}

	create()
	{	
		//this.image = this.add.image(400,300,'start');
		camera = this.cameras.main;
		
		camera.setPosition(0, 0);
	    camera.setZoom(3);
	    
	    generar(5,5);
	    
	    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
	    var tiles = map.addTilesetImage('tiles');
	    
	    layer = map.createStaticLayer(0, tiles, 0, 0);
	    layer.enableBody = true;
	    map.setCollisionBetween(1, 3000);
	 
		fireBalls = this.physics.add.group({
	        classType: FireBall,
	        maxSize: 30,
	        runChildUpdate: true
    	});
		
		player = this.physics.add.sprite((startroom*16*8)+16, 60, 'dude');
	    player.setScale(0.3,0.3);
		player.setCollideWorldBounds(true);
		player.looking = 'right';
		
		camera.startFollow(player);
		
		//var group = this.add.group();
    	
	    enemies = this.physics.add.group({
	    	key: 'cachapa',
	        classType: Enemy,
	        repeat: 0,
	        maxSize: 60,
	        runChildUpdate: true,
	        setXY: { x: 300, y: 100, stepX: 50 }
	    });
	        
	    //var enemy = group.get(400,100);
	    //enemy.setActive(true).setVisible(true).setTint(Phaser.Display.Color.RandomRGB().color);
	    //console.log(enemy);

	    //console.log(enemies);
	    
	    platforms = this.physics.add.staticGroup();
	    
	    // INPUTS
	    	
	    cursors = this.input.keyboard.createCursorKeys();
	    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
	    jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	    
	    // OVERLAPS
	    
	    this.physics.add.overlap(fireBalls, enemies,  this.hitEnemy, this.checkBulletVsEnemy, this);
	    //this.physics.add.overlap(fireBalls, layer, this.hitPlatform, null, this);
	    
	    // COLLIDES
	    
	    this.physics.add.collider(player, layer);
    	this.physics.add.collider(enemies, platforms);
    	this.physics.add.collider(fireBalls,layer,this.hitPlatform);
    	

	    // platforms.create(400, 570, 'ground').setScale(25,2).refreshBody();
    	// platforms.create(300, 500, 'ground');
    	// platforms.create(400, 400, 'ground').setScale(10,1).refreshBody();
    	
    	this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('Explosion', { start: 0, end: 5 }),
            frameRate: 20,
            repeat: 0,
            hideOnComplete:true
        });
    	
    	this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turnL',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'turnR',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

	}

	checkBulletVsEnemy (bullet, enemy)
	{
		return (bullet.active && enemy.active);
	}

	hitShip (ship, enemy)
	{
	}

	hitEnemy (bullet, enemy)
	{
		bullet.kill();
		enemy.hit(1);
	}

	hitPlatform (bullet, platform)
	{	
		bullet.kill();
	}
	
	update()
	{
		if(player.body.onFloor())
		{
			//console.log(speed);
			if(speed >= 200){
				console.log("Menos vida");
				speed = 0;
			}
				
	        jumpButton.timeDown = 0;
	        extrajump = maxjumps;
	    }
		else
		{
			speed = player.body.velocity.y;
		}

		if(cursors.left.isDown)
		{	
			player.setVelocityX(-move);
			player.body.rotation = 180;
			player.anims.play('left', true);
			player.looking = 'left';
		}
		else if(cursors.right.isDown)
		{	
			player.setVelocityX(move);
			player.body.rotation = 0;
			player.anims.play('right', true);
			player.looking = 'right';
		}
		else
		{
			player.setVelocityX(0);
			
			if(player.looking == 'right')
			{
				player.anims.play('turnR', true);
			}
			else
			{
				player.anims.play('turnL', true);
			}
		}
		
		if (jumpButton._justDown)
		{
			
	        if(player.body.onFloor())
	        {
			    player.setVelocityY(jump); 
	        }           
	        else if(extrajump > 0 && jumpButton.timeDown > 0)
	        {
	            player.setVelocityY(jump);
	            extrajump--;
	        }
		}


		if(fireButton.isDown && this.time.now > lastFired)
		{	
			let fire = fireBalls.get();
			if (fire)
			{		
				if (cursors.up.isDown)
				{
					player.body.rotation = -90;
				}

				fire.fire(player);
				lastFired = this.time.now + 500;			
			}
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////
	function rand(min,max){
		max++;
		return Math.floor((Math.random()*(max-1))+min);
	}
	
	function matrixer(cols,rows){
		var matrix = new Array(cols);
		for(var i=0;i<cols;i++){
			matrix[i] = new Array(rows);
			for(var j=0;j<rows;j++)
				matrix[i][j] = 0;
		}
		return matrix;
	}
	
	function down(matrix,col,row){
		if(row.row < matrix[0].length-1){
			if(matrix[col.col][row.row] == 3)
				matrix[col.col][row.row] = 4;
			else	
				matrix[col.col][row.row] = 2;
			
			row.row++;
			matrix[col.col][row.row] = 3;
			return false;
		}
		else
			return true;
	}
	
	function left(matrix,col,row){
		if(col.col > 0) {
			col.col--;
			if(matrix[col.col][row.row] == 0)
				matrix[col.col][row.row] = 1;
			return false;
		}
		else
			return right(matrix,col,row);
		}
	
		function right(matrix,col,row){
			if(col.col < matrix.length-1) {
				col.col++;
				if(matrix[col.col][row.row] == 0)
					matrix[col.col][row.row] = 1;
				return false;
			}
			else
				return left(matrix,col,row);
	}

	function path(matrix){
		var cols = matrix.length;
		var rows = matrix[0].length;
		var start = rand(0,cols-1);
		startroom = start;
		var col = {col:start};
		var row = {row:0};
		matrix[col.col][row.row] = 1;
		var end = false;
		while(!end) {
			var aux=rand(1,5);
			if(aux==1 || aux == 2){
				end = left(matrix,col,row);
			}
			else if(aux==3 || aux == 4){
				end = right(matrix,col,row);
			}
			else if(aux==5){
				end = down(matrix,col,row);
			}
			if(end == true){
				//console.log("Start: "+ start +" , 0");
				//console.log("Exit: "+ col.col + " , "+(rows-1));
			}
			
		}
		return matrix;
	}

	function linear(line,i){
		var count = i*8;
		var aux = new Array();
		for(var j=0;j<line.length;j++){
			for(k=0;k<8;k++)
				aux = aux.concat(line[j].array[k+count]);
		}
		return aux;
	}

	function makeMap(matrix,Templates){
		var tileset = new Array();
		var line;
		for(var i=0;i<matrix[0].length;i++){
			line = new Array();
			for(var j=0;j<matrix.length;j++){
				//Al ser 0 toma otro al azar
				if(matrix[j][i] == 0) matrix[j][i] = rand(1,4);
				switch(matrix[j][i]){
					case 1:
						line.push(Templates.T1[rand(0,Templates.T1.length-1)]);
						break;
					case 2:
						line.push(Templates.T2[rand(0,Templates.T2.length-1)]);
						break;
					case 3:
						line.push(Templates.T3[rand(0,Templates.T3.length-1)]);
						break;
					case 4:
						line.push(Templates.T4[rand(0,Templates.T4.length-1)]);
						break;
					default:	
						//line.push(Templates.T0[rand(0,Templates.T1.length-1)]);
						//Temporalmente tomara al azar otro template
						break;
				}			
			}
			for(var k=0;k<8;k++){
				tileset.push(linear(line,k));
			}
		}
		level = tileset;
	}
	
	function generar(w,h){
			var Templates = {};
			Templates.T0 = new Array();
			Templates.T1 = new Array();
			Templates.T2 = new Array();
			Templates.T3 = new Array();
			Templates.T4 = new Array();
			
			var matrix = matrixer(w,h);
			matrix = path(matrix);
			//No Importan
			var template0 = {cols:8, type:0, array:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};
			Templates.T0.push(template0);
			//Izq y Der
			var template1 = {cols:8, type:1, array:[1,1,1,1,1,1,1,1,1,4,-1,1,1,-1,1,1,1,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,1,-1,-1,1,1,3,3,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1]};
			Templates.T1.push(template1);
			//Izq, Der y Abajo
			var template2 = {cols:8, type:2, array:[1,1,1,1,1,1,1,1,1,1,1,2,-1,1,1,1,1,1,1,1,-1,1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,1,1,-1,3,-1,-1,-1,-1,-1,1,3,1,1,-1,-1,-1,1,1,1]};
			Templates.T2.push(template2);
			//Izq, Der y Arriba
			var template3 = {cols:8, type:3, array:[1,-1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,1,1,-1,1,1,-1,-1,-1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1]};
			Templates.T3.push(template3);
			//Izq, Der, Arriba y Abajo
			var template4 = {cols:8, type:4, array:[1,-1,1,-1,-1,1,1,1,1,2,-1,-1,-1,1,1,1,1,1,-1,-1,-1,1,5,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,1,-1,1,-1,-1,-1,-1,3,1,3,1,1,-1,-1,3,1,1,1,1,-1,-1,-1,1,1]};
			Templates.T4.push(template4);
			makeMap(matrix,Templates);
	}