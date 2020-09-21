class Background {
  constructor(mapID) {
    this.mapID = mapID;
    this.x = 0;
    this.y = 0;
    this.renderX = null;
    this.renderY = null;
    this.sprite = new Image();
    this.sprite.src = `${PATH_TO_BG}/background${this.mapID}.jpg`;
    this.relativeX = 10;
    this.relativeY = 10;
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 0;
    this.setCoords();
  }
  setCoords() {
    this.x = ((mapScale - 1) * realMapWidth) / 4 / 10;
    this.y = ((mapScale - 1) * realMapHeight) / 4 / 10;
  }
  setNewMap() {
    this.mapID = HERO.mapID;
    this.sprite.src = `${PATH_TO_BG}/background${this.mapID}.jpg`;
    this.setCoords();
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.renderX = this.x - CAMERA.followX / this.relativeX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY / this.relativeY + halfScreenHeight; //count real distance to render one to the center
    this.draw();
  }
}
