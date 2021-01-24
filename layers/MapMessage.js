class MapMessage {
  constructor(text, type = 1, fadeOutOn = true) {
    this.ID = getLaserID();
    this.text = text;
    this.type = type; //1 = standard message, 2 = big message, 3 = map title, 4 = dmz, 5 = radiation
    this.way = GAME_MSGS.msgFonts[type].way;
    this.font = `${GAME_MSGS.msgFonts[type].size} sans-serif`;
    this.shadowColor = GAME_MSGS.msgFonts[type].shadowC;
    this.shadowBlur = GAME_MSGS.msgFonts[type].shadowBlur;
    this.x = halfScreenWidth - getTextOffset(this.font, this.text);
    this.y = GAME_MSGS.msgFonts[type].y;
    this.fadeOutTime = 5000;
    this.fadeAlphaTime = 1000;
    this.fadeOutOn = fadeOutOn;
    this.fadeAlpha = 1 / this.fadeAlphaTime;
    this.alpha = 1;
    this.fadeSpeed = {
      x: 0,
      y: 0,
    };
    this.setFade();
    this.end = false;
  }
  changeFadeActive() {
    this.fadeOutTime = this.fadeAlphaTime; //start fading out instantly
    this.fadeOutOn = true;
  }
  setFade() {
    const speeds = [
      [-2, 0],
      [0, -2],
      [2, 0],
      [0, 2],
    ]; //left, top, right, bottom
    this.fadeSpeed.x = speeds[this.way][0];
    this.fadeSpeed.y = speeds[this.way][1];
  }
  setAlpha() {
    if (this.fadeOutTime > this.fadeAlphaTime) return;
    this.alpha -= this.fadeAlpha * GAME_MAP.getDeltaTime();
    if (this.alpha < 0) this.alpha = 0;
  }
  draw() {
    GAME_MAP.ctx.fillStyle = "white";
    GAME_MAP.ctx.font = this.font;
    GAME_MAP.ctx.shadowColor = this.shadowColor;
    GAME_MAP.ctx.shadowBlur = this.shadowBlur;
    this.setAlpha();
    GAME_MAP.ctx.globalAlpha = this.alpha;
    GAME_MAP.ctx.fillText(this.text, this.x, this.y);
    GAME_MAP.ctx.fillStyle = "black";
    GAME_MAP.ctx.shadowBlur = 0;
    GAME_MAP.ctx.globalAlpha = 1;
  }
  terminate() {
    MAP_MANAGER.MESSAGE_LAYER.some((msg, i) => {
      if (msg.ID == this.ID) {
        MAP_MANAGER.MESSAGE_LAYER.splice(i, 1);
        return true;
      }
    });
    this.end = true;
  }
  update() {
    if (this.end) return;
    this.draw();
    if (!this.fadeOutOn) return;
    if (!isNaN(GAME_MAP.getDeltaTime())) this.fadeOutTime -= GAME_MAP.getDeltaTime();
    if (this.fadeOutTime <= 0) this.terminate();
  }
}
