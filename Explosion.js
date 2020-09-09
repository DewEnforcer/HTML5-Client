class Explosion {
  constructor(x, y, type, qualLevel = 1) {
    this.ID = getLaserID();
    let randomOffset = 50;
    this.x = x + getRandomNumber(-randomOffset, randomOffset);
    this.y = y + getRandomNumber(-randomOffset, randomOffset);
    this.type = type;
    this.sprite = new Image();
    this.sprite.src = null;
    this.frame = 0;
    this.activateOn = 2;
    this.seq = 0;
    this.maxSeq = 20;
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 4;
    if (SETTINGS.settingsArr[this.settingMenu][this.settingIndex] != qualLevel)
      this.terminate();
    else {
      this.setSprite();
      this.sound = new Sound(
        `./spacemap/audio/explosions/rocketExplosion${this.type}.mp3`
      );
      this.sound.play();
    }
  }
  setSprite() {
    this.sprite.src = `./spacemap/pyroEffects/rocketExplosion${this.type}/${this.seq}.png`;
  }
  terminate() {
    EXPLOSION_LAYER.some((expl, i) => {
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
    ctx.drawImage(this.sprite, this.x, this.y);
  }
  update() {
    this.setSprite();
    this.draw();
    this.setSeq();
  }
}
