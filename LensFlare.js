class LensFlare {
  constructor(id, x, y, z, lenses = 5) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
    this.id = id;
    this.sprite = null;
    this.lenses = [];
    this.seq = 0;
    this.frame = 0;
    this.activateOn = 4;
    this.maxSeq = id > 0 ? 0 : 14;
    this.angle = 0;
    this.maxAngle = 360;
    this.renderX = x;
    this.renderY = y;
    this.offset = OFFSET_DATA.LENS_OFFSETS[this.id];
    this.display = false;
    this.lensesAmount = lenses;
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 3;
    this.setSprite();
    this.changeRenderPos();
    this.generateLenses();
  }
  checkXVis() {
    return this.renderX > screenWidth || this.renderX < 0;
  }
  checkYVis() {
    return this.renderY > screenHeight || this.renderY < 0;
  }
  controlVisibility() {
    if (this.checkXVis() || this.checkYVis()) {
      this.display = false;
    } else {
      this.display = true;
    }
    this.updateLenses();
  }
  updateLenses() {
    let display = this.display;
    if (SETTINGS.settingsArr[this.settingMenu][this.settingIndex] != 4) {
      display = false;
    }
    this.lenses.forEach((lens) => (lens.display = display));
  }
  generateLenses() {
    for (let i = 1; i <= this.lensesAmount; i++) {
      this.lenses.push(new Lens(this, i));
    }
  }
  resetSequence() {
    this.seq = 0;
  }
  resetAngle() {
    if (this.angle > this.maxAngle) this.angle = 0;
  }
  setFrame() {
    this.frame++;
    if (this.frame % this.activateOn == 0) {
      this.frame = 0;
      this.rotate();
    }
  }
  setSequence() {
    if (this.maxSeq == 0) return;
    this.seq++;
    if (this.seq > this.maxSeq) this.resetSequence();
    this.setSprite();
  }
  setSprite() {
    this.sprite = PRELOADER.modelsBuffer.lensflares[this.id][this.seq];
  }
  rotate() {
    this.angle++;
  }
  changeRenderPos() {
    this.renderX = this.x - CAMERA.followX / this.z + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY / this.z + halfScreenHeight; //count real distance to render one to the center
  }
  draw() {
    if (!this.display) return;
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-toRadians(this.angle));
    ctx.drawImage(this.sprite, -this.offset.x, -this.offset.y);
    ctx.rotate(toRadians(this.angle));
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.setFrame();
    this.setSequence();
    this.changeRenderPos();
    this.controlVisibility();
    this.draw();
    this.lenses.forEach((lens) => lens.update());
  }
}
