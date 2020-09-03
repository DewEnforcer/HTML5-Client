class MapMessage {
  constructor(text, type = 1) {
    this.ID = getLaserID();
    this.text = text;
    this.type = type; //1 = standard message, 2 = big message, 3 = map title
    this.way = fonts[type].way;
    this.font = `${fonts[type].size} sans-serif`;
    this.shadowColor = fonts[type].shadowC;
    this.shadowBlur = fonts[type].shadowBlur;
    this.x = halfScreenWidth - getTextOffset(this.font, this.text);
    this.y = 300;
    this.fadeOutTime = 5000;
    this.fadeAlphaTime = 1000;
    this.fadeAlpha = 1 / this.fadeAlphaTime;
    this.alpha = 1;
    this.fadeSpeed = {
      x: 0,
      y: 0,
    };
    this.setFade();
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
    this.alpha -= this.fadeAlpha;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.font = this.font;
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    this.setAlpha();
    ctx.globalAlpha = this.alpha;
    ctx.fillText(this.text, this.x, this.y);
    ctx.fillStyle = "black";
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
  terminate() {
    MESSAGE_LAYER.some((msg, i) => {
      if (msg.ID == this.ID) {
        MESSAGE_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  update() {
    if (!isNaN(DELTA_TIME)) this.fadeOutTime -= DELTA_TIME;
    this.draw();
    if (this.fadeOutTime <= 0) this.terminate();
  }
}
