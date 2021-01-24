class Background extends MapObject {
  constructor(mapID, x = 0, y = 0, z = 10) {
    super(x,y,z);

    this.mapID = mapID;

    this.sprite.src = `${PATH_TO_BG}/background${this.mapID}.jpg`;

    this.settingMenu = MENU_GRAPHICS;
    this.settingIndex = 0;

    this.musicTheme = null;
    this.music = null;
    this.setCoords();
  }
  setTheme(theme, isInit = false) { //this doesnt belong here, seperation of concerns!!
    if (theme == this.musicTheme) return;
    this.musicTheme = theme;
    if (!isInit) this.music.stop();
    this.music = new Sound(
      "./spacemap/audio/themes/" + theme + ".mp3",
      true,
      1
    );
    this.music.play();
  }
  setCoords() {
    this.x = ((mapScale - 1) * realMapWidth) / 4 / 10;
    this.y = ((mapScale - 1) * realMapHeight) / 4 / 10;
  }
  setNewMap(mapId) {
    this.mapID = mapId;
    this.sprite.src = `${PATH_TO_BG}/background${this.mapID}.jpg`;
    this.setCoords();
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) return;
    this.calculateRenderPos();
    this.draw();
  }
}
