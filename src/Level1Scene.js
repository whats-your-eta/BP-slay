import Phaser from "phaser";

class Level1Scene extends Phaser.Scene {
	constructor() {
		super("Level1Scene")
	}

	preload() {
		this.load.spritesheet("player", "assets/player2.png", {
			frameWidth: 680,
			frameHeight: 680,
		});

		this.load.image("brownroom", "assets/brownroom.png", {
			frameWidth: 1000,
			frameHeight: 650,
		});

		this.load.image("musicNote1", "assets/musicNote1.png"); // TODO add all types of music notes
		this.load.image("musicNote2", "assets/musicNote2.png");
		this.load.image("musicNote3", "assets/musicNote3.png");
		this.load.image("enemy", "assets/ghost.png");

		// this.load.audio("jump", ["assets/jump.ogg", "assets/jump.mp3"]);
		// this.load.audio("musicNote", ["assets/musicNote.ogg", "assets/musicNote.mp3"]); // TODO add all sounds of music notes
		// this.load.audio("dead", ["assets/dead.ogg", "assets/dead.mp3"]);

		// this.load.image("pixel", "assets/pixel.png");
	}

	/**
	 * Create any objects needed
	 */
	create() {
		this.add.image(1000, 650, 'level1bg');
		this.enemySpeed = 10

		// TODO: add variables needed
		this.totalMusicNotes = 3; // # of music notes player must collect in total 
		this.collectedMusicNotes = 0; // # of music notes player has collected, initialized at 0

		// bg 
		this.backgroundImage = this.add.image(500, 325, 'brownroom');
		
		// create the player sprite
		this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, "player");

		this.player.setScale(.2);
		// player movement animations
		// this.anims.create({
		// 				key: "right",
		// 	frames: this.anims.generateFrameNumbers("player", { frames: [1, 2] }),
		// 	frameRate: 8,
		// 	repeat: -1,
		// });
		// this.anims.create({
		// 	key: "left",
		// 	frames: this.anims.generateFrameNumbers("player", { frames: [3, 4] }),
		// 	frameRate: 8,
		// 	repeat: -1,
		// });

		// no gravity
		this.player.body.gravity.y = 0;

		// create arrow keys
		this.cursors = this.input.keyboard.createCursorKeys();

		this.createBounds();


		// this.musicNotes = this.physics.add.group();

		// this.musicNotes.create(42, 251, "musicNote1");
		// this.musicNotes.create(4, 21, "musicNote2");
		// this.musicNotes.create(442, 51, "musicNote3");
		// this.setNoteLocations();

		// If the player collides with a music note, change fact
		// this.physics.add.collider(this.player, this.musicNotes, () => {
		// 	this.handlePlayerDeath(); // TODO
		// });

		// Display the score
		// this.scoreLabel = this.add.text(30, 25, "score: 0", {
		// 	font: "18px Arial",
		// 	fill: "#ffffff",
		// });
		this.funFactLabel = this.add.text(0, 500, "Fun fact: In 4/4 time, the downbeat is the first beat of a measure and is the strongest beat. \nFunk Grooves are characterized by strong down beats. Examples include Average White Band \n– “Pick Up the Pieces” and Commodores – “Brick House”", {
			font: "18px Arial",
			fill: "#000000",
		});

		this.score = 0;

		// add enemies!
		this.enemies = this.physics.add.group();

		// call this.addEnemy() once every 2.2 seconds
		this.time.addEvent({
			delay: 2200,
			callback: () => this.addEnemy(),
			loop: true,
		});
		// If the player collides with an enemy, restart the game
		this.physics.add.collider(this.player, this.enemies, () => {
			this.handlePlayerDeath();
		});

		// this.jumpSound = this.sound.add("jump");
		// this.noteSound = this.sound.add("musicNote"); // TODO do for all music notes
		// this.deadSound = this.sound.add("dead");

		// particles for when the player dies
		// the initial location doesn't matter -- we'll set the location
		// in handlePlayerDeath()
		this.emitter = this.add.particles(0, 0, "pixel", {
			// how many particles
			quantity: 15,
			// min/max speed of the particles, in pixels per second
			speed: { min: -150, max: 150 },
			// scale the particles from 2x original size to 0.1x
			scale: { start: 2, end: 0.1 },
			// how long the particles last, milliseconds
			lifespan: 800,
			// don't start the explosion right away
			emitting: false,
		});

		// TODO switch scene to Level2Scene when character has achieved all music notes and transition plays (mb an animation plays???)
	}

	/**
	 * Creates the walls of the game: borders of screen rectangle & prevention of player moving up thru blackboard
	 */
	createBounds() {
		this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height, true, true, true, false);
		this.player.body.setCollideWorldBounds(true);
		// this.enemies.body.setCollideWorldBounds(true);
	}

	/**
	 * Phaser calls this function once a frame (60 times a second).
	 *
	 * Use this function to move the player in response to actions,
	 * check for win conditions, etc.
	 */
	update() {
		if (!this.player.active) {
			// the player is dead
			return;
		}

		for (let enemy of this.enemies.children.entries) {
			this.moveEnemyTowardsPlayer(enemy);

		}

		this.movePlayer();
		// this.checkCoinCollisions();

		// If the player goes out of bounds (ie. falls through a hole), TODO make player unable to go out of bounds
		// the player dies
		if (this.player.y > this.game.config.height || this.player.y < 0) {
			this.handlePlayerDeath();
		}
		// console.log(this.enemies);
		
	}

	/**
	 * Handles moving the player with the arrow keys
	 */
	moveEnemyTowardsPlayer(enemy) {
		let angle = Phaser.Math.Angle.Between(enemy.body.x, enemy.body.y, this.player.body.x, this.player.body.y);
		let enemySpeed = 150;
		enemy.body.velocity.x = Math.cos(angle) * enemySpeed;
		enemy.body.velocity.y = Math.sin(angle) * enemySpeed;

	}

	movePlayer() {
		// check for active input
		if (this.cursors.left.isDown) {
			// move left
			this.player.setVelocityX(-500);
			// this.player.body.velocity.x = -300;
			// this.player.anims.play("left", true);
		} else if (this.cursors.right.isDown) {
			// move right
			this.player.setVelocityX(500);
			// this.player.body.velocity.x = 300;
			// this.player.anims.play("right", true);
		} else {
			// stop moving horizontally
			this.player.setVelocityX(0);
			// this.player.body.velocity.x = 0;
		}
		
		if (this.cursors.up.isDown) {
			this.player.body.velocity.y = -500;
		} else if (this.cursors.down.isDown) {
			this.player.body.velocity.y = 500;
		
		} else {
			// stop moving in the horizontal
			this.player.body.velocity.y = 0;
			// this.player.setFrame(0);
		}

		if (this.cursors.up.isDown && this.player.body.onFloor()) {
			// jump if the player is on the ground
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
	}

	/**
	 * Check to see whether the player has collided with any music notes
	 */

	checkMusicNoteCollisions() {
		// update fun fact label
		console.log(this.musicNote1)
		console.log(this.musicNote2)
		console.log(this.musicNote3)
		if (this.physics.overlap(this.player, this.musicNote1) || this.physics.overlap(this.player, this.musicNote2) || this.physics.overlap(this.player, this.musicNote3)) {
    // Code to execute if any of the overlaps are true
			this.score +=5;
			this.scoreLabel.setText("score: " + this.score);
		}


		this.funFactLabel.setText("NEW FACT NOW!!! TODO");
		// if (this.physics.overlap(this.player, this.musicNote)) {
		// 	// the player has found a music note!

		// 	this.collectedMusicNotes++;
			
		// 	// update the score label
		// 	this.scoreLabel.setText("score: " + this.score); // TODO change to 'music notes left' maybe?
			
		// 	// TODO hide music note/make not visible and can no longer be collided with--check if this line works
		// 	this.musicNote.setVisible(false);

		// 	// // move the coin to a new spot
			//this.moveCoin();

		// 	// this.coinSound.play();
		// }
	}

	/**
	 * randomize music note locations
	 */
	setNoteLocations() {
		// // Define an array of possible positions for music notes
		// const possiblePositions = [
		// 	{ x: Phaser.Math.RND.between(0, 1000), y: Phaser.Math.RND.between(0, 650) },
		// 	{ x: Phaser.Math.RND.between(0, 1000), y: Phaser.Math.RND.between(0, 650) },
		// 	{ x: Phaser.Math.RND.between(0, 1000), y: Phaser.Math.RND.between(0, 650) },
		// 	{ x: Phaser.Math.RND.between(0, 1000), y: Phaser.Math.RND.between(0, 650) },
		// 	{ x: Phaser.Math.RND.between(0, 1000), y: Phaser.Math.RND.between(0, 650) },
		// 	// Add more positions if needed
		// ];
	
		// // Loop through each music note and set its position randomly
		// for (let note of this.musicNotes.children.entries) {
		// 	console.log(note);
		// 	// var i = Phaser.Math.RND.between(0,possiblePositions.length);
		// 	// const newPosition = possiblePositions[i]; // Get a random position from the array
		// 	note.setPosition(Phaser.Math.RND.between(0, 500), 
		// 		Phaser.Math.RND.between(0, 500));
		// 	// note.setPosition(newPosition.x, newPosition.y);
		// }
	
		// // this.coin.setScale(0);

		// // this.tweens.add({
		// // 	targets: this.coin,
		// // 	scale: 1,
		// // 	duration: 300,
		// // });
		// // this.tweens.add({
		// // 	targets: this.player,
		// // 	scale: 1.3,
		// // 	duration: 100,
		// // 	yoyo: true, // perform the tween forward then backward
		// // });
	}

	/**
	 * Create a new enemy
	 */
	addEnemy() {
		let enemy = this.enemies.create(this.game.config.width / 2, 0, "enemy");

		enemy.setScale(.3);

		// TODO 8: this below gravity/velocity code to use something based on randomness! 

		// add gravity to the enemy to make it fall
		enemy.body.gravity.y = 500;
		// randomly make the enemy move left or right
		enemy.body.velocity.x = Phaser.Math.RND.pick([-200, 200]);


		enemy.body.bounce.x = 1;

		// destroy the enemy after 15 seconds
		// this is roughly how long it takes to fall through the hole
		this.time.addEvent({
			delay: 15000,
			callback: () => enemy.destroy(),
		});
	}
	/*
	* Called when the player dies. Restart the level (scene)
	*/
	handlePlayerDeath() {
		// this.deadSound.play();
		this.emitter.explode(this.emitter.quantity, this.player.x, this.player.y);

		// we can't immediately restart the scene; otherwise our particles will disappear
		// delete the player
		this.player.setVisible(false);
		this.player.setActive(false);
		// delete all the enemies
		this.enemies.clear(true, true);


		// restart the scene after 1 second
		this.time.addEvent({
			delay: 800,
			callback: () => {
				this.scene.restart();
			}
		});
	}
}

export default Level1Scene;