var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 'black',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 }
            }
        },
        scene: [ start, level_1 ]
    };

var config = new Phaser.Game(config);