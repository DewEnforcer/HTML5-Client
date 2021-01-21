class Nebula extends MapObject {
  constructor(x, y, z, type, id) {
    super(x,y,z);
    this.type = type;

    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 2;
    
    this.initializeSprite(type, id);
  }
  initializeSprite(type, id) {
    this.sprite.src = `./spacemap/nebulas/${type}/${id}.png`;    
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.calculateRenderPos();
    this.draw();
  }
}
