import Phaser from "phaser";

class Level1Scene extends Phaser.Scene {
	constructor() {
		super("Stage1Part1")
	}

	preload() {
		this.load.spritesheet("player", "assets/player.png", {
			frameWidth: 20,
			frameHeight: 20,
		});

		this.load.image("ghost", "assets/ghost.png");

	}

	/**
	 * Called once. Create any objects you need here!
	 */
	create() {

		this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, "player");

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

		// add gravity to make the player fall
		this.player.body.gravity.y = 500;

		// create arrow keys
		this.cursors = this.input.keyboard.createCursorKeys();

		this.createWalls();

		// Make the player collide with walls
		this.physics.add.collider(this.player, this.walls);

		// add enemies!
		this.enemies = this.physics.add.group();
		// call this.addEnemy() once every 2.2 seconds
		this.time.addEvent({
			delay: 5000,
			callback: () => this.addEnemy(),
			loop: true,
		});
		// Make the enemies and walls collide
		this.physics.add.collider(this.enemies, this.walls);
		// If the player collides with an enemy, restart the game
		this.physics.add.collider(this.player, this.enemies, () => {
			this.handlePlayerDeath();
		});

	}

	
	createWalls() {
		
		this.walls.setCollision(1);
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

		// If the player goes out of bounds (ie. falls through a hole),
		// the player dies
		if (this.player.y > this.game.config.height || this.player.y < 0) {
			this.handlePlayerDeath();
		}
	}

	/**
	 * Handles moving the player with the arrow keys
	 */
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
		}
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
	* Called when the player dies. Restart the game
	*/
	handlePlayerDeath() {
		// we can't immediately restart the scene; otherwise our particles will disappear
		// delete the player
		this.player.setVisible(false);
		this.player.setActive(false);
		// delete all the enemies
		this.enemies.clear(true, true);

		// TODO 7.4: decrement lives and update the lives label


		// restart the scene after 1 second
		this.time.addEvent({
			delay: 800,
			callback: () => {
				this.scene.restart();
				// TODO 7.5: we don't just want to restard, we want to change based on if we have lives left!! 
				
			}
		});
	}
}

export default Stage1Part1;