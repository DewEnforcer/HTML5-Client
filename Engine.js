class Engine {
  constructor(enginePoint) {
    this.enginePoint = enginePoint;
    this.smoke = [];
    this.maxSmokes = 10;
    this.fadeOutFrame = 11;
    this.startFrame = 0;
    this.seq = 0;
    this.frame = 0;
    this.activateOnFrame = 4; //2
    this.engineSprite = new Image();
    this.spriteOffset = OFFSET_DATA.ENGINE_OFFSETS[0];
    this.x = 0;
    this.y = 0;
    this.renderX = 0;
    this.renderY = 0;
    this.positionOffset = null;
    this.angle = 0;
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 5;
    this.setPosOffset();
    this.changePos();
    this.setAngle();
  }
  setAngle() {
    this.angle = this.enginePoint.pointingAngle;
  }
  changeRenderPos() {
    this.renderX = this.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY + halfScreenHeight;
  }
  changePos() {
    this.x = this.enginePoint.x + this.positionOffset.x;
    this.y = this.enginePoint.y + this.positionOffset.y;
  }
  setPosOffset() {
    this.positionOffset =
      SHIPS_ENGINES[this.enginePoint.engineClass][this.enginePoint.sequenceNum];
  }
  setSpriteSeq() {
    this.engineSprite.src = `./spacemap/engines/standard/${this.seq}.png`;
  }
  draw() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(
      this.engineSprite,
      -this.spriteOffset.x,
      -this.spriteOffset.y
    );
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  setEngineSeq() {
    if (this.enginePoint.isFly) {
      this.seq--;
    } else {
      this.seq++;
    }
    if (this.seq < this.startFrame) this.seq = this.startFrame;
    if (this.seq > this.fadeOutFrame) this.seq = this.fadeOutFrame;
    this.setSpriteSeq();
  }
  createSmoke() {
    if (
      SETTINGS.settingsArr[this.settingMenu][this.settingIndex] != 4 ||
      this.maxSmokes < this.smoke.length
    )
      return;
    this.smoke.push(new Smoke(this.x, this.y, "engineSmoke", this));
  }
  update() {
    this.setPosOffset();
    this.setAngle();
    if (this.frame % this.activateOnFrame == 0) {
      //add smoke manager
      this.setEngineSeq();
      this.frame = 0; //prevent overflow
      if (this.enginePoint.isFly) this.createSmoke();
    }
    this.frame++;
    this.changePos();
    this.changeRenderPos();
    this.draw();
    this.smoke.forEach((s) => s.update());
  }
}
