class Planet {
  constructor(planetID, x, y, z, minimapScale) {
    this.planetID = planetID;
    this.x = x;
    this.y = y;
    this.z = z;
    this.minimapScale = minimapScale;
    this.renderX = null;
    this.renderY = null;
    this.sprite = new Image();
    this.sprite.src = `${PATH_TO_PLANETS}/planet${this.planetID}.png`;
    this.offset = getPlanetOffset(planetID);
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 1;
  }
  draw() {
    ctx.drawImage(
      this.sprite,
      this.renderX - this.offset.x,
      this.renderY - this.offset.y
    );
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.renderX = this.x - CAMERA.followX / this.z + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY / this.z + halfScreenHeight; //count real distance to render one to the center
    this.draw();
  }
}
