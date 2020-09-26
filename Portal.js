class Portal {
  constructor(x, y, id) {
    this.ID = id;
    this.x = x;
    this.y = y;
    this.renderX = x; //missing offset
    this.renderY = y;
    this.sprite = new Image();
    this.state = 0;
    this.offset = getPortalOffset();
    this.frame = 1;
    this.maxFrames = 112;
    this.maxIdleFrames = 48;
    this.jumpInterval = 2500; //in ms
    this.shockwaveSprite = new Image();
    this.shockwave = {
      src: `${PATH_TO_PORTALS}/jumpAnimation/`,
      frame: 1,
    };
    this.active = false;
    this.interval = null;
    this.spriteModelsIndexes = [
      DEFAULT_SHIP_SPRITE_OFFSET + SPRITE_ID_LIST.port_idle,
      DEFAULT_SHIP_SPRITE_OFFSET + SPRITE_ID_LIST.port_active,
      DEFAULT_SHIP_SPRITE_OFFSET + SPRITE_ID_LIST.jump_animat,
    ];
    this.getSequence();
  }
  getSequence() {
    this.sprite =
      PRELOADER.modelsBuffer[this.spriteModelsIndexes[this.state]][this.frame];
  }
  deactivate() {
    this.frame = 1;
    this.shockwave.frame = 1;
    this.state = 0;
    this.active = false;
    clearInterval(this.interval);
    HERO.ship.drones.forEach((d) => d.setDistPerFrame());
  }
  activate() {
    if (this.active) return;
    this.active = true;
    this.state = 1;
    this.frame = 1;
    this.interval = setInterval(() => {
      this.frame++;
      this.shockwave.frame++;
      if (this.frame >= this.maxFrames) {
        this.deactivate();
        return;
      }
    }, this.jumpInterval / this.maxFrames);
  }
  idle() {
    if (this.active) return;
    this.frame++;
    if (this.frame >= this.maxIdleFrames) this.frame = 1;
  }
  drawShockwave() {
    this.shockwaveSprite =
      PRELOADER.modelsBuffer[this.spriteModelsIndexes[2]][this.shockwave.frame];
    ctx.drawImage(
      this.shockwaveSprite,
      this.renderX - this.offset.x,
      this.renderY - this.offset.y
    );
  }
  draw() {
    if (!controlVisibility(this.renderX, this.renderY)) return; //save resources
    ctx.drawImage(
      this.sprite,
      this.renderX - this.offset.x,
      this.renderY - this.offset.y
    );
    if (this.active) this.drawShockwave();
  }
  update() {
    this.renderX = this.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY + halfScreenHeight; //count real distance to render one to the center
    this.idle();
    this.getSequence();
    this.draw();
  }
}
