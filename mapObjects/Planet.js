class Planet extends MapObject {
  constructor({id, x, y, z, mScale}) {
    super(x,y,z);

    this.planetID = id;
    this.minimapScale = mScale;
    this.minimapSprite = new Image();
    this.minimapSprite.src = `./spacemap/minimap/planet${this.planetID}.png`;

    this.sprite.src = `${PATH_TO_PLANETS}/planet${this.planetID}.png`;
    this.offset = getPlanetOffset(this.planetID);
    
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 1;
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.calculateRenderPos();
    this.draw();
  }
}
