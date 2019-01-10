var config = {
        type: Phaser.AUTO,
        width: 40*16,
        height: 40*16,
        backgroundColor: 'black',
        zoom: 4,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 }
            }
        },
        scene: [ start, level_1 ]
    };

var config = new Phaser.Game(config);