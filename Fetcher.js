class Fetcher {
  static fetchAll() {
    this.fetchData();
    this.fetchTranslations();
    this.fetchMapObjects();
    this.fetchDroneObjects();
    this.fetchEngineData();
    this.fetchLaserData();
    this.fetchActionbarData();
    this.fetchSpacemapInfo();
    this.fetchUiElements();
  }
  static PATH_TO_DATA = "./client/data"
  static async fetchData() {
    const res = await fetch(`${this.PATH_TO_DATA}/gameData.json`);
    const data = await res.json();

    DEFAULTS = data.defaults;
    COLORS = data.colors;
    UI_DATA = data.ui;
    GAME_MSGS = data.gameMsg;
    LASER_DATA = data.laser_data;
    SHIP_NAMES = data.shipNames;
    OFFSET_DATA = data.offsets;
    LENS_AMOUNTS = data.lensNumber;
    SPRITE_ID_LIST = data.spriteIDS;
    PORTAL_LIST_DATA = data.Portals;

    LOADER.dataLoaded("gameData");
  }
  static async fetchUiElements() {
    const res = await fetch(`${this.PATH_TO_DATA}/uiElements.json`);
    const {ui} = await res.json();
    UI_ELEMENTS_DATA = ui;

    LOADER.dataLoaded("uiElements");
  }
  static async fetchSpacemapInfo() {
    const res = await fetch(`${this.PATH_TO_DATA}/spacemap.json`);
    const data = await res.json();

    MAP_OVERVIEW_LIST = data;

    LOADER.dataLoaded("spacemap");
  }
  static async fetchTranslations(callback = null) {
    const res = await fetch(`${this.PATH_TO_DATA}/texts.json`);
    const data = await res.json();
  
    TEXT_TRANSLATIONS = data[CURRENT_LANGUAGE];
    
    if (callback) callback();
    LOADER.dataLoaded("Translations");
  }
  static async fetchMapObjects() {
    const res = await fetch(`${this.PATH_TO_DATA}/mapObjects.json`);
    const data = await res.json();

    MAP_OBJECTS_LIST = data;

    LOADER.dataLoaded("Map objects");
  }
  static async fetchDroneObjects() {
    const res = await fetch(`${this.PATH_TO_DATA}/dronePos.json`);
    const data = await res.json();

    DRONE_POSITIONS = data;

    LOADER.dataLoaded("dronePos");
  }
  static async fetchEngineData() {
    const res = await fetch(`${this.PATH_TO_DATA}/enginePos.json`);
    const data = await res.json();

    SHIPS_ENGINES = data;

    LOADER.dataLoaded("enginePos");
  }
  static async fetchLaserData() {
    const res = await fetch(`${this.PATH_TO_DATA}/laserPos.json`);
    const data = await res.json();

    LASER_POS = data;

    LOADER.dataLoaded("laserPos");
  }
  static async fetchActionbarData() {
    const res = await fetch(`${this.PATH_TO_DATA}/SubmenuItems.json`);
    const data = await res.json();

    SUB_MENU_ITEMS = data;
    
    LOADER.dataLoaded("submenuItems");
  }
}
