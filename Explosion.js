class Explosion {
  constructor(
    x,
    y,
    type,
    explType,
    offset,
    setOffset = false,
    maxSeq = 20,
    qualLevel = 1
  ) {
    EXPLOSION_LAYER.push(this);
    this.ID = getLaserID();
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 4;
    console.log(
      Number(SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) <
        qualLevel
    );
    if (
      Number(SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) <
      qualLevel
    ) {
      this.terminate();
    } else {
      this.x = x;
      this.y = y;
      this.renderX;
      this.renderY;
      this.offsetSprite = offset / 2;
      this.type = type;
      this.sprite = new Image();
      this.sprite.src = null;
      this.frame = 0;
      this.activateOn = 2;
      this.seq = 0;
      this.maxSeq = maxSeq;
      this.sound = null;
      this.soundType = explType;
      if (setOffset) this.setRandomCoords();
      this.setSprite();
      this.playExplosionSound();
    }
  }
  playExplosionSound() {
    this.sound = new Sound(
      `./spacemap/audio/explosions/${this.soundType + this.type}.mp3`
    );
    this.sound.play();
  }
  setRandomCoords() {
    let randomOffset = 50;
    this.x += getRandomNumber(-randomOffset, randomOffset);
    this.y += getRandomNumber(-randomOffset, randomOffset);
  }
  setSprite() {
    this.sprite.src = `./spacemap/pyroEffects/${this.soundType + this.type}/${
      this.seq
    }.png`;
  }
  terminate() {
    EXPLOSION_LAYER.some((expl, i) => {
      console.log(expl.ID, this.ID);
      if (expl.ID == this.ID) {
        EXPLOSION_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  setSeq() {
    this.seq++;
    if (this.seq > this.maxSeq) this.terminate();
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  updateRender() {
    this.renderX =
      this.x - this.offsetSprite - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY =
      this.y - this.offsetSprite - CAMERA.followY + halfScreenHeight;
  }
  update() {
    this.updateRender();
    this.setSprite();
    this.draw();
    this.setSeq();
  }
}
