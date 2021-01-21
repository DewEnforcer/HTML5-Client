class Planet extends MapObject {
  constructor(planetID, x, y, z, minimapScale) {
    super(x,y,z);

    this.planetID = planetID;
    this.minimapScale = minimapScale;

    this.sprite.src = `${PATH_TO_PLANETS}/planet${this.planetID}.png`;
    this.offset = getPlanetOffset(planetID);
    
    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 1;
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.calculateRenderPos();
    this.draw();
  }
}
