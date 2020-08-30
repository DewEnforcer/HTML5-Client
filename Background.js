class Background {
  constructor(mapID) {
    this.mapID = mapID;
    this.x = 0;
    this.y = 0;
    this.renderX = null;
    this.renderY = null;
    this.sprite = new Image();
    this.sprite.src = `${PATH_TO_BG}/background_${this.mapID}.jpg`;
    this.relativeX = mapWidth / 2100;
    this.relativeY = mapHeight / 1310;
  }
  setNewMap() {
    this.mapID = HERO.mapID;
    this.sprite.src = `${PATH_TO_BG}/background_${this.mapID}.jpg`;
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  update() {
    this.renderX = this.x - CAMERA.followX / this.relativeX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY / this.relativeY + halfScreenHeight; //count real distance to render one to the center
    this.draw();
  }
}
