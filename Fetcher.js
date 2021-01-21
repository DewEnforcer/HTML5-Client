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
  static fetchData() {
    fetch(`${this.PATH_TO_DATA}/gameData.json`)
      .then((res) => res.json())
      .then((data) => {
        DEFAULTS = data.defaults;
        progress++;
        COLORS = data.colors;
        progress++;
        UI_DATA = data.ui;
        progress++;
        GAME_MSGS = data.gameMsg;
        progress++;
        LASER_DATA = data.laser_data;
        progress++;
        SHIP_NAMES = data.shipNames;
        progress++;
        OFFSET_DATA = data.offsets;
        progress++;
        LENS_AMOUNTS = data.lensNumber;
        SPRITE_ID_LIST = data.spriteIDS;
        PORTAL_LIST_DATA = data.Portals;
        manageLoadingBar();
      });
  }
  static async fetchUiElements() {
    const res = await fetch(`${this.PATH_TO_DATA}/uiElements.json`);
    const {ui} = await res.json();
    UI_ELEMENTS_DATA = ui;
  }
  static fetchSpacemapInfo() {
    fetch(`${this.PATH_TO_DATA}/spacemap.json`)
      .then((res) => res.json())
      .then((data) => {
        MAP_OVERVIEW_LIST = data;
      });
  }
  static fetchTranslations(callback = null) {
    fetch(`${this.PATH_TO_DATA}/texts.json`)
      .then((res) => res.json())
      .then((data) => {
        TEXT_TRANSLATIONS = data[CURRENT_LANGUAGE];
        progress++;
        manageLoadingBar();
        if (callback != null) callback();
      });
  }
  static fetchMapObjects() {
    fetch(`${this.PATH_TO_DATA}/mapObjects.json`)
      .then((res) => res.json())
      .then((data) => {
        MAP_OBJECTS_LIST = data;
        progress++;
        manageLoadingBar();
      });
  }
  static fetchDroneObjects() {
    fetch(`${this.PATH_TO_DATA}/dronePos.json`)
      .then((res) => res.json())
      .then((data) => {
        DRONE_POSITIONS = data;
        progress++;
        manageLoadingBar();
      });
  }
  static fetchEngineData() {
    fetch(`${this.PATH_TO_DATA}/enginePos.json`)
      .then((res) => res.json())
      .then((data) => {
        SHIPS_ENGINES = data;
        progress++;
        manageLoadingBar();
      });
  }
  static fetchLaserData() {
    fetch(`${this.PATH_TO_DATA}/laserPos.json`)
      .then((res) => res.json())
      .then((data) => {
        LASER_POS = data;
        progress++;
        manageLoadingBar();
      });
  }
  static fetchActionbarData() {
    fetch(`${this.PATH_TO_DATA}/SubmenuItems.json`)
      .then((res) => res.json())
      .then((data) => {
        SUB_MENU_ITEMS = data;
        progress++;
        manageLoadingBar();
      });
  }
}
