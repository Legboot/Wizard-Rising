var player;
var cursors;
var cursorEnter;
var score = 0;
var scoreText;
var lives = 5;
var livesText;
var lifeLostText;
var textStyle;
var loseButton;

class start extends Phaser.Scene{

	constructor()
	{
		super({key:'start'});
	}

	preload()
	{
		this.load.image('start','assets/img/start.png');
		this.load.image('button','assets/img/button.jpg');
		//this.load.image('ground','assets/img/ground.png');
		//this.load.audio('start_sound','assets/audio/start.mp3');
	}

	create()
	{	
		//	IMAGEN DE FONDO
		this.image = this.add.image(400,300,'start');

		//	TEXTO DE PUNTOS Y VIDA
		textStyle = { fontSize: '32px', fill: '#fff' };
		scoreText = this.add.text(20, 20, 'puntos: 0', textStyle);
		livesText = this.add.text(20, 50, 'vidas:'+ lives , textStyle);
		lifeLostText = this.add.text(20,100, 'Has perdido, presiona cualquier tecla para continuar', textStyle);
		lifeLostText.visible = false;

		// BOTON  AL PERDER

		loseButton = this.add.text(100, 300, 'Volver a Intentar', textStyle)
							 .setInteractive({ useHandCursos: true })
							 .on('pointerdown', () => this.volverIntentar())
							 .on('pointerover', () => this.buttonHoverState())
							 .on('pointerout',  () => this.buttonResetState());
		loseButton.visible = false;


		// SONIDO
		//this.soundFX = this.sound.add('start_sound',{loop:'true'});
		//this.soundFX.play();
		//this.text = this.add.text(300,200,'Ninja Game', {font:'40px Impact'});

		// PLATAFORMAS
		var platforms = this.physics.add.staticGroup();

		// SET SCALE = ESCALA DE LA PLATAFORMA, REFRESH BODY = QUE NO TRANSPASE LA PLATAFORMA
    	platforms.create(100, 550, 'ground').setScale(0.5,0.5).refreshBody();

    	// AGREGAR AL JUGADOR EN UNA POSICION ESPECIFICA
    	player = this.physics.add.sprite(100, 450, 'dude');

    	//	REBOTE
    	player.setBounce(0.2);

    	// COLISION ENTRE TODO EL CUADRO 
    	player.setCollideWorldBounds(true);

    	// COLISION ENTRE LAS PLATAFORMAS Y EL JUGADOR
    	this.physics.add.collider(player, platforms);

    	// SE ENCARGA DE LEER LOS CURSORES
		cursors = this.input.keyboard.createCursorKeys();
		cursorEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

	}

	update(delta)
	{	

		if(cursors.left.isDown)
		{
			player.setVelocityX(-160);
			// ESTO FUE DE PRUEBA, AHORA HAY QUE USARLO CUANDO COLISIONE CON ALGO
			this.perderVidas();
		}
		else if(cursors.right.isDown)
		{	
			player.setVelocityX(160);
		}
		else
		{
			player.setVelocityX(0);
		}

		if (cursors.up.isDown && player.body.touching.down)
		{	
			player.setVelocityY(-300);
			// PRUEBA DE LOS PUNTOS
			score++;
			scoreText.setText('puntos: ' + score);
		}
	}

	perderVidas()
	{
		lives--;

		if(lives)
		{
			livesText.setText('vida: ' + lives);
		}
		else
		{	
			// TEXTO HAS PERDIDO
			livesText.setText('vida: 0');
			lifeLostText.visible = true;

			// PAUSAR EL JUEGO
			//this.scene.pause();

			// ACTIVAR EL BOTON
			loseButton.visible = true;
		}
	}

	volverIntentar()
	{	
		lives = 5;
		this.scene.restart();
	}

	buttonHoverState()
	{
		loseButton.setStyle({ fill: '#ff0' });
	}

	buttonResetState()
	{
		loseButton.setStyle({ fill: '#fff' });
	}
}
