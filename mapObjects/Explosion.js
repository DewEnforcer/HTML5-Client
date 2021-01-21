class Explosion extends MapObject {
  constructor(
    x,
    y,
    type,
    explType,
    explTypeKey,
    offset,
    setOffset = false,
    maxSeq = 20,
    qualLevel = 1,
  ) {
      super(x,y);
      EXPLOSION_LAYER.push(this);
      this.ID = getLaserID();

      this.offset = {
        x: offset/2,
        y: offset/2
      }

      this.type = type;

      this.frame = 0;
      this.activateOn = 2;
      this.seq = 0;
      this.maxSeq = maxSeq;
      this.explTypeKey = explTypeKey;

      this.sound = null;
      this.soundType = explType;

      this.settingMenu = MENU_GRAPHICS;
      this.settingIndex = 4;

      this.setSprite();
      this.playExplosionSound();
      if (setOffset) this.setRandomCoords();
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
    this.sprite = PRELOADER.modelsBuffer.explosions[this.explTypeKey][this.type][this.seq];
  }
  terminate() { //this doesnt belong here, rework!!
    for (let i = 0; i < EXPLOSION_LAYER.length; i++) {
      if (EXPLOSION_LAYER[i] === this.ID) return EXPLOSION_LAYER.splice(i, 1);
    }
  }
  setSeq() {
    this.seq++;
    if (this.seq > this.maxSeq) this.terminate();
  }
  update() {
    if (SETTINGS.settingsArr[this.settingMenu][this.settingIndex] < qualLevel) return this.terminate(); 
    this.calculateRenderPos();
    this.setSprite();
    this.draw();
    this.setSeq();
  }
}
