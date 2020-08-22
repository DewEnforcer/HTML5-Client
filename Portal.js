class Portal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.renderX = x - 100; //missing offset
    this.renderY = y - 100;
    this.sprite = new Image();
    this.state = "portalInactive";
    this.sequence = this.getSequence();
    this.frame = 1;
    this.maxFrames = 112;
    this.maxIdleFrames = 48;
    this.jumpInterval = 5000;
    this.shockwave = {
      src: `${PATH_TO_PORTALS}/jumpAnimation/`,
      frame: 1,
    };
    this.active = false;
  }
  getSequence() {
    return `${PATH_TO_PORTALS}/${this.state}/${this.frame}.png`;
  }
  deactivate() {
    this.frame = 1;
    this.shockwave.frame = 1;
    this.state = "portalInactive";
  }
  activate() {
    if (this.active) return;
    this.active = true;
    this.state = "portalActive";
    this.frame = 1;
    setInterval(() => {
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
    if (this.frame > this.maxIdleFrames) this.frame = 1;
  }
  draw() {
    this.sprite.src = this.sequence;
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  update() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight; //count real distance to render one to the center
    this.idle();
    this.sequence = this.getSequence();
    this.draw();
  }
}
