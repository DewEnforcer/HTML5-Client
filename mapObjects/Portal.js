class Portal {
  constructor(x, y, id, type = 0) {
    this.type =type;
    this.ID = id;
    this.x = x;
    this.y = y;
    this.renderX = x; //missing offset
    this.renderY = y;
    this.sprite = new Image();
    this.state = "idle";
    this.offset = getPortalOffset();
    this.frame = 1;
    this.maxFrames = PORTAL_LIST_DATA[type].sprite_active;
    this.maxIdleFrames = PORTAL_LIST_DATA[type].sprite_idle;
    this.jumpAnimationType = PORTAL_LIST_DATA[type].jump_animation;
    this.maxJumpAnimationFrames = PRELOADER.modelsData.portals.shockwave[this.jumpAnimationType][1];
    console.log(this.maxJumpAnimationFrames);
    this.jumpInterval = 2500; //in ms
    this.shockwaveSprite = null;
    this.idlePortalWay = 1;
    this.shockwave = {
      src: `${PATH_TO_PORTALS}/jumpAnimation${type}/`,
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
    this.sprite = PRELOADER.modelsBuffer.portals.portal[this.type][this.state][this.frame]
  }
  deactivate() {
    this.frame = 1;
    this.shockwave.frame = 1;
    this.state = "idle";
    this.idlePortalWay = 1;
    this.active = false;
    clearInterval(this.interval);
    HERO.ship.drones.forEach((d) => d.setDistPerFrame());
  }
  activate() {
    if (this.active) return;
    this.active = true;
    this.state = "active"
    this.frame = 1;
    this.interval = setInterval(() => {
      this.frame++;
      this.shockwave.frame++;
      if (this.shockwave.frame > this.maxJumpAnimationFrames) this.shockwave.frame = 1;
      if (this.frame >= this.maxFrames) {
        this.deactivate();
        return;
      }
    }, this.jumpInterval / this.maxFrames); //TODO
  }
  idle() {
    if (this.active) return;
    if (this.maxFrames > 1) {

      if (this.frame >= this.maxIdleFrames) this.idlePortalWay = -1;
      else if (this.frame <= 1) this.idlePortalWay = 1;
      this.frame += this.idlePortalWay;
    }
  }
  drawShockwave() {
    this.shockwaveSprite = PRELOADER.modelsBuffer.portals.shockwave[this.jumpAnimationType][this.shockwave.frame];
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
