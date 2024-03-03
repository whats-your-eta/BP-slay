import Phaser from "phaser";

class Level1Scene extends Phaser.Scene {
	constructor() {
		super("Level1Scene")
	}

	preload() {
		this.load.spritesheet("player", "assets/player2.png", {
			frameWidth: 20,
			frameHeight: 20,
		});

		this.load.image("brownroom", "assets/brownroom.png", {
			frameWidth: 1000,
			frameHeight: 650,
		});

		this.load.image("musicNote", "assets/musicNote.png"); // TODO add all types of music notes
		this.load.image("enemy", "assets/enemy.png");

		this.load.audio("jump", ["assets/jump.ogg", "assets/jump.mp3"]);
		this.load.audio("musicNote", ["assets/musicNote.ogg", "assets/musicNote.mp3"]); // TODO add all sounds of music notes
		this.load.audio("dead", ["assets/dead.ogg", "assets/dead.mp3"]);

		this.load.image("pixel", "assets/pixel.png");
	}

	/**
	 * Create any objects needed
	 */
	create() {
		this.add.image(1000, 650, 'level1bg');
		this.enemySpeed = 10

		// TODO: add variables needed
		this.totalMusicNotes = 5; // # of music notes player must collect in total 
		this.collectedMusicNotes = 0; // # of music notes player has collected, initialized at 0

		// create the player sprite
		this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, "player");

		// bg 
		this.backgroundImage = this.add.image(500, 325, 'brownroom');
		// player movement animations
		this.anims.create({
						key: "right",
			frames: this.anims.generateFrameNumbers("player", { frames: [1, 2] }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", { frames: [3, 4] }),
			frameRate: 8,
			repeat: -1,
		});

		// no gravity
		this.player.body.gravity.y = 0;

		// create arrow keys
		this.cursors = this.input.keyboard.createCursorKeys();

		this.createBounds();


		this.musicNote = this.physics.add.sprite(0, 0, "musicNote");
		this.moveCoin();

		// Display the score
		this.scoreLabel = this.add.text(30, 25, "score: 0", {
			font: "18px Arial",
			fill: "#ffffff",
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

		this.jumpSound = this.sound.add("jump");
		this.noteSound = this.sound.add("musicNote"); // TODO do for all music notes
		this.deadSound = this.sound.add("dead");

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
		this.physics.world.setBounds(0, 0, gameState.width, gameState.height, true, true, true, false);
		gameState.player.setCollideWorldBounds(true);
		gameState.enemies.setCollideWorldBounds(true);
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

		this.movePlayer();
		this.checkCoinCollisions();

		// If the player goes out of bounds (ie. falls through a hole), TODO make player unable to go out of bounds
		// the player dies
		if (this.player.y > this.game.config.height || this.player.y < 0) {
			this.handlePlayerDeath();
		}
			var angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
			enemy.x += Math.cos(angle) * speed;
			enemy.y += Math.sin(angle) * speed;
		}

	/**
	 * Handles moving the player with the arrow keys
	 */
	moveEnemyTowardsPlayer() {
		let angle = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
		let enemySpeed = 150;
		this.enemy.body.velocity.x = Math.cos(angle) * enemySpeed;
		this.enemy.body.velocity.y = Math.sin(angle) * enemySpeed;

	}
	movePlayer() {
		// check for active input
		if (this.cursors.left.isDown) {
			// move left
			this.player.body.velocity.x = -200;
			this.player.anims.play("left", true);
		} else if (this.cursors.right.isDown) {
			// move right
			this.player.body.velocity.x = 200;
			this.player.anims.play("right", true);
		} else {
			// stop moving in the horizontal
			this.player.body.velocity.x = 0;
			this.player.setFrame(0);
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
		if (this.physics.overlap(this.player, this.musicNote)) {
			// the player has found a music note!

			this.collectedMusicNotes++;
			
			// update the score label
			this.scoreLabel.setText("score: " + this.score); // TODO change to 'music notes left' maybe?
			
			// TODO hide music note/make not visible and can no longer be collided with--check if this line works
			this.musicNote.setVisible(false);

			// // move the coin to a new spot
			// this.moveCoin();
			// this.coinSound.play();
		}
	}

	/**
	 * randomize music note locations
	 */
	setNoteLocations() { // TODO make this for multiple music notes
		// // these are the possible positions the coin can move to
		// let positions = [
		// 	{ x: 120, y: 135 }, { x: 680, y: 135 },
		// 	{ x: 120, y: 295 }, { x: 680, y: 295 },
		// 	{ x: 120, y: 455 }, { x: 680, y: 455 }
		// ];

		// // don't move to the same location it was already at
		// positions = positions.filter((p) => !(p.x === this.coin.x && p.y === this.coin.y));

		// let newPosition = Phaser.Math.RND.pick(positions);
		// this.coin.setPosition(newPosition.x, newPosition.y);
		// this.coin.setScale(0);

		// this.tweens.add({
		// 	targets: this.coin,
		// 	scale: 1,
		// 	duration: 300,
		// });
		// this.tweens.add({
		// 	targets: this.player,
		// 	scale: 1.3,
		// 	duration: 100,
		// 	yoyo: true, // perform the tween forward then backward
		// });
	}

	/**
	 * Create a new enemy
	 */
	addEnemy() {
		let enemy = this.enemies.create(this.game.config.width / 2, 0, "enemy");


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
		this.deadSound.play();
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