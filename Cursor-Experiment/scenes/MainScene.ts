import Phaser from 'phaser';
import Player from '../Player';

export default class MainScene extends Phaser.Scene {
  private player?: Player;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Create platforms using graphics instead of images
    this.platforms = this.physics.add.staticGroup();

    // Create ground platform using graphics
    const ground = this.add.graphics();
    ground.fillStyle(0x8B4513); // Brown color
    ground.fillRect(0, 0, 960, 32);
    ground.generateTexture('ground', 960, 32);
    ground.destroy();
    this.platforms.create(480, 520, 'ground').refreshBody();
    
    // Create floating platforms using graphics
    const platform1 = this.add.graphics();
    platform1.fillStyle(0x4169E1); // Blue color
    platform1.fillRect(0, 0, 128, 16);
    platform1.generateTexture('platform', 128, 16);
    platform1.destroy();
    
    this.platforms.create(200, 400, 'platform').refreshBody();
    this.platforms.create(760, 350, 'platform').refreshBody();
    this.platforms.create(480, 250, 'platform').refreshBody();

    // Create player using graphics
    const playerGraphic = this.add.graphics();
    playerGraphic.fillStyle(0x00ff00); // Green color
    playerGraphic.fillRect(0, 0, 32, 32);
    playerGraphic.generateTexture('player', 32, 32);
    playerGraphic.destroy();
    
    this.player = new Player(this, 100, 300, 'player');

    // Collisions
    this.physics.add.collider(this.player, this.platforms);

    // Add some text
    this.add.text(16, 16, 'Phaser 3 TypeScript Game\nArrow Keys or WASD to move\nSpace or Up to jump\nHold jump for variable height', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    
    console.log('Game objects created successfully');
  }

  override update() {
    if (!this.player) return;

    // Update player (handles all movement and jumping logic)
    this.player.updatePlayer();
  }
}
