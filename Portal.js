class Portal {
  constructor(x, y, id) {
    this.ID = id;
    this.x = x;
    this.y = y;
    this.renderX = x; //missing offset
    this.renderY = y;
    this.sprite = new Image();
    this.state = "portalInactive";
    this.sequence = this.getSequence();
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
  }
  getSequence() {
    return `${PATH_TO_PORTALS}/${this.state}/${this.frame}.png`;
  }
  deactivate() {
    this.frame = 1;
    this.shockwave.frame = 1;
    this.state = "portalInactive";
    this.active = false;
    clearInterval(this.interval);
  }
  activate() {
    if (this.active) return;
    this.active = true;
    this.state = "portalActive";
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
    this.shockwaveSprite.src =
      this.shockwave.src + this.shockwave.frame + ".png";
    ctx.drawImage(
      this.shockwaveSprite,
      this.renderX - this.offset.x,
      this.renderY - this.offset.y
    );
  }
  draw() {
    this.sprite.src = this.sequence;
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
    this.sequence = this.getSequence();
    this.draw();
  }
}
