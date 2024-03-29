class Engine {
  constructor(enginePoint) {
    this.engineType = 0;
    this.enginePoint = enginePoint;
    this.z = 1;
    this.smoke = [];
    this.maxSmokes = 10;
    this.fadeOutFrame = 11;
    this.startFrame = 0;
    this.seq = 0;
    this.frame = 0;
    this.activateOnFrame = 4; //2
    this.engineSprite = null;
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
    this.engineSprite = PRELOADER.modelsBuffer.engines[this.engineType][this.seq];
  }
  draw() {
    GAME_MAP.ctx.translate(this.renderX, this.renderY);
    GAME_MAP.ctx.rotate(-this.angle);
    GAME_MAP.ctx.drawImage(
      this.engineSprite,
      -this.spriteOffset.x,
      -this.spriteOffset.y
    );
    GAME_MAP.ctx.rotate(this.angle);
    GAME_MAP.ctx.translate(-this.renderX, -this.renderY);
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
    this.smoke.push(new Smoke(this.x, this.y, this.z, "engineSmoke", this));
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
