class Hit {
  constructor(x, y, value, isMiss, isHeal = false, isHero = false) {
    this.settingMenu = MENU_INTERFACE;
    this.settingIndex = 1;
    this.id = getLaserID();
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) {
      this.terminate();
    } else {
      this.x = x + OFFSET_DATA.HIT_OFFSET.x;
      this.y = y + OFFSET_DATA.HIT_OFFSET.y;
      this.value = value;
      if (isMiss) this.value = TEXT_TRANSLATIONS.miss_hit;
      this.color = isHeal ? "#49BE40" : isHero ? "#db63e2" : "#ff0000";
      this.fontSize = 20;
      this.seq = 1;
      this.MAX_SEQUENCE = 700;
      this.font = "bold " + this.fontSize + "px sans-serif";
    }
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
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = "black"; //reset fillstyle
    ctx.shadowBlur = 0;
  }
  update() {
    this.fadeOut();
    this.font = "bold " + this.fontSize + "px sans-serif";
    this.draw();
  }
}
