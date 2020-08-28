class Hit {
  constructor(x, y, value, isHeal = false) {
    this.id = getLaserID();
    this.x = x + HIT_OFFSET.x;
    this.y = y + HIT_OFFSET.y;
    this.value = value;
    this.color = isHeal ? "#49BE40" : "#ff0000";
    this.fontSize = 20;
    this.seq = 1;
    this.MAX_SEQUENCE = 700;
    this.font = "bold " + this.fontSize + "px sans-serif";
  }
  terminate() {
    HIT_LAYER.some((hit, i) => {
      if (hit.id == this.id) {
        HIT_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  fadeOut() {
    this.fontSize += DELTA_TIME / 30; //max font size will now be 44
    this.MAX_SEQUENCE -= DELTA_TIME;
    this.seq++;
    if (Math.round(this.MAX_SEQUENCE) <= 0) this.terminate();
  }
  draw() {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = "black"; //reset fillstyle
  }
  update() {
    this.fadeOut();
    this.font = "bold " + this.fontSize + "px sans-serif";
    this.draw();
  }
}
