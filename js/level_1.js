class level_1 extends Phaser.Scene{

	constructor()
	{
		super({key:'level_1'});
	}

	create()
	{	
		this.text = this.add.text(0,0,'Nivel 1',{ font:'40px Impact'});
		
		this.key_Esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	}

	update()
	{
		if (this.key_Esc.isDown)
			this.scene.start('start');
	}

}