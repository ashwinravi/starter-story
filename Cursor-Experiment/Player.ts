import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey?: Phaser.Input.Keyboard.Key;
  
  // Movement properties
  private moveSpeed = 300;
  private jumpPower = -500;
  private maxVelocity = 400;
  private drag = 300;
  
  // Coyote time properties
  private coyoteTime = 150; // milliseconds
  private coyoteTimer = 0;
  private wasOnGround = false;
  
  // Variable jump properties
  private jumpHoldTime = 0;
  private maxJumpHoldTime = 200; // milliseconds
  private isJumping = false;
  private jumpReleasePower = -300; // Reduced jump power when released early

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    
    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics body
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setDragX(this.drag);
    this.setMaxVelocity(this.maxVelocity);
    
    // Set up input
    this.setupInput(scene);
  }

  private setupInput(scene: Phaser.Scene): void {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = scene.input.keyboard.addKeys('W,S,A,D') as Phaser.Types.Input.Keyboard.CursorKeys;
      this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  }

  updatePlayer(): void {
    if (!this.body) return;

    this.handleMovement();
    this.handleCoyoteTime();
    this.handleJumping();
  }

  private handleMovement(): void {
    const leftKey = this.cursors?.left?.isDown || this.wasd?.left?.isDown;
    const rightKey = this.cursors?.right?.isDown || this.wasd?.right?.isDown;

    if (leftKey) {
      this.setAccelerationX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (rightKey) {
      this.setAccelerationX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
    }
  }

  private handleCoyoteTime(): void {
    const isOnGround = this.body!.touching.down;
    
    // Start coyote timer when leaving ground
    if (this.wasOnGround && !isOnGround) {
      this.coyoteTimer = this.coyoteTime;
    }
    
    // Decrease coyote timer
    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= 16; // Assuming 60fps (16ms per frame)
    }
    
    this.wasOnGround = isOnGround;
  }

  private handleJumping(): void {
    const jumpPressed = this.cursors?.up?.isDown || this.wasd?.up?.isDown || this.jumpKey?.isDown;
    const canJump = this.body!.touching.down || this.coyoteTimer > 0;
    
    // Start jump
    if (jumpPressed && canJump && !this.isJumping) {
      this.startJump();
    }
    
    // Continue jump (variable jump height)
    if (jumpPressed && this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
      this.continueJump();
    }
    
    // Release jump
    if (!jumpPressed && this.isJumping) {
      this.releaseJump();
    }
    
    // Reset jump state when on ground
    if (this.body!.touching.down && this.isJumping) {
      this.isJumping = false;
      this.jumpHoldTime = 0;
    }
  }

  private startJump(): void {
    this.setVelocityY(this.jumpPower);
    this.isJumping = true;
    this.jumpHoldTime = 0;
    this.coyoteTimer = 0; // Consume coyote time
  }

  private continueJump(): void {
    // Apply additional upward force while jump key is held
    const additionalForce = -50;
    this.setVelocityY(this.body!.velocity.y + additionalForce);
    this.jumpHoldTime += 16; // Assuming 60fps
  }

  private releaseJump(): void {
    if (this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
      // Apply reduced jump power for early release
      const currentVelocity = this.body!.velocity.y;
      if (currentVelocity < this.jumpReleasePower) {
        this.setVelocityY(this.jumpReleasePower);
      }
    }
    this.isJumping = false;
  }

  // Public methods for external access
  public getMoveSpeed(): number {
    return this.moveSpeed;
  }

  public setMoveSpeed(speed: number): void {
    this.moveSpeed = speed;
  }

  public getJumpPower(): number {
    return this.jumpPower;
  }

  public setJumpPower(power: number): void {
    this.jumpPower = power;
  }

  public getCoyoteTime(): number {
    return this.coyoteTime;
  }

  public setCoyoteTime(time: number): void {
    this.coyoteTime = time;
  }

  public isOnGround(): boolean {
    return this.body?.touching.down || false;
  }

  public getVelocity(): Phaser.Math.Vector2 {
    return this.body?.velocity || new Phaser.Math.Vector2(0, 0);
  }
}
