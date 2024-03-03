import Phaser from "phaser";
import Level1Scene from "./Level1Scene";

// config! 
const config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 650,
	// TODO 5: Add WelcomeScene to the list of scenes. Think about the order!
	scene: [Level1Scene], 
	physics: {
		default: "arcade",
	},
	backgroundColor: "#3498db",
};


const game = new Phaser.Game(config);
