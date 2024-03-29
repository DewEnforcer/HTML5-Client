const BUILD_VERSION = "0.7.9";
let CURRENT_LANGUAGE = "en";
const HOST = "ws://localhost:8080";
const CHAT_HOST = "ws://localhost:9338";
//karnival, replacement, turkey, winterGiftBox
//loading bar data
let loadingStatus = false;
let progress = 0;
const maxProgress = 13 + 26; //fix magic numbers
//vars awaiting fetch
let TEXT_TRANSLATIONS;
let DEFAULTS;
let COLORS;
let UI_DATA;
let GAME_MSGS;
let LASER_DATA;
let SHIP_NAMES;
let OFFSET_DATA;
let SUB_MENU_ITEMS;
let SHIPS_ENGINES = null;
let LASER_POS = null;
let MAP_OBJECTS_LIST = null;
let LENS_AMOUNTS = null;
let DRONE_POSITIONS;
let DEFAULT_SHIP_SPRITE_OFFSET = 0;
let SPRITE_ID_LIST;
let UI_ELEMENTS_DATA = null;
let MAP_OVERVIEW_LIST = null;
let PORTAL_LIST_DATA = null;
// btns
const BTN_FPS = 102;
const BTN_ATTACK = 32;
const BTN_LOGOUT = 108;
const BTN_PORT = 106;
const BTN_FULLSCREEN = 122;
const BTN_SWITCH = [43, 283, 353, 269, 345, 382, 253, 225, 237, 233];
const BTN_CONFIG = 99;
const BTN_ACTIONBAR_SUBMENU = 116;
//game vars not fetched
const REFRESH_TIME = 100;
const DRONE_SPEED = 200;
const LASER_SPEED = 100;
const ELA_SPEED = 500;
const MISSILE_SPEED = 1000;
const MAX_MISSILE_FLY_TIME = 5000;
const clickRange = 100;
const mapWidth = 21000;
const mapHeight = 13000;
let realMapWidth, realMapHeight, mapScale;
const LOGOUT_TIME = 5000;
let END = false;
let SHOW_FPS = false;
let DELTA_TIME = new Date() * 1;
let LAST_UPDATE = 0;
let FPS = 0;
let gameInit = false;
let mapName = "";
const CLOAK_ALPHA = 0.5;
const MENU_GRAPHICS = 0;
const MENU_GAMEPLAY = 1;
const MENU_INTERFACE = 2;
const MENU_SOUND = 3;
const MENU_KEYBOARD = 4;
const langNameToKey = {
  English: "en",
  Česky: "cz",
};
let SHIPS_ON_SCREEN = 0;
const averageRefreshRate = [];
const LASER_ANGLE_TOLERATION = toRadians(20);
//PATHS
const PATH_TO_PORTALS = `./spacemap/portals`;
const PATH_TO_PLANETS = `./spacemap/planets`;
const PATH_TO_BG = `./spacemap/backgrounds`;
const PATH_TO_EFFECTS = `./spacemap/effects`;
// fly sound - sort later, 2 sounds required to create proper sound - fix later too
const flySound = new Sound(`./spacemap/audio/misc/flying.mp3`, true);
const flySound2 = new Sound(`./spacemap/audio/misc/flying.mp3`, true);
let isPlayingFly = false;
//layers
const MAP_PLANETS = [];
const MAP_PORTALS = [];
const MAP_STATIONS = [];
const MAP_SHIPS = [];
const LASER_LAYER = [];
const ROCKET_LAYER = [];
const COMBAT_LAYER = [];
const HIT_LAYER = [];
const DRONES_LAYER = [];
const EXPLOSION_LAYER = [];
const MESSAGE_LAYER = [];
const LENSFLARE_LAYER = [];
const NEBULA_LAYER = [];
// class vars/context
let EVENT_MANAGER,
  MAIN,
  HERO,
  SOCKET,
  BG_LAYER,
  MINIMAP,
  PRELOADER,
  CAMERA,
  SETTINGS,
  SPACEMAP,
  CHAT_SOCKET,
  CHAT_UI,
  LANGUAGE_MANAGER;
let halfScreenWidth;
let halfScreenHeight;
let screenWidth;
let screenHeight;
let ctx;
//MAIN FUNCTIONS
const initiatePostHero = () => {
  new UserInfo(MAIN.UI_ELEMENTS[1]);
  new ShipInfo(MAIN.UI_ELEMENTS[2]);
  SETTINGS = new Settings();
  SETTINGS.genUi();
  MINIMAP = new Minimap();
  setGamemapObjects(true);
  SPACEMAP = new Spacemap();
  gameInit = true;
  LANGUAGE_MANAGER.translateGame(true);
  CHAT_SOCKET = new ChatSocket(CHAT_HOST);
  const welcome = new Sound(`./spacemap/audio/start/welcomeSound.mp3`);
  const voice = new Sound(`./spacemap/audio/start/voiceReady.mp3`);
  voice.play();
  welcome.play();
  MAIN.writeToLog("welcome_log", true);
  displayFPS();
  drawGame();
};
const setGamemapObjects = (init = false) => {
  let multiplier = 1;
  const mapObjectList = MAP_OBJECTS_LIST[HERO.mapID];
  if ("scale" in mapObjectList === true) {
    multiplier = mapObjectList.scale;
  }
  mapScale = multiplier;
  realMapWidth = mapWidth * multiplier;
  realMapHeight = mapHeight * multiplier;
  if (init) BG_LAYER = new Background(HERO.mapID);
  if ("music" in mapObjectList === true)
    BG_LAYER.setTheme(mapObjectList.music, init);
  else BG_LAYER.setTheme("default", init);
  mapObjectList.planets.forEach((planet) => {
    MAP_PLANETS.push(
      new Planet(planet.id, planet.x, planet.y, planet.z, planet.mScale)
    );
  });
  mapObjectList.portals.forEach((portal) => {
    MAP_PORTALS.push(new Portal(portal.x, portal.y, portal.id));
  });
  mapObjectList.stations.forEach((sta) => {
    MAP_STATIONS.push(
      new Station(sta.x, sta.y, sta.z, sta.rotation, sta.type, sta.id)
    );
  });
  mapObjectList.lensflares.forEach((lens) => {
    LENSFLARE_LAYER.push(
      new LensFlare(lens.id, lens.x, lens.y, lens.z, LENS_AMOUNTS[lens.id])
    );
  });
  mapObjectList.nebulas.forEach((neb) => {
    NEBULA_LAYER.push(new Nebula(neb.x, neb.y, neb.z, neb.type, neb.id));
  });
  mapName = mapObjectList.name;
  if (!mapName) mapName = TEXT_TRANSLATIONS["unknown_map"];
  MESSAGE_LAYER.push(
    new MapMessage(`${TEXT_TRANSLATIONS["map_name_title"]} ${mapName}`, 3)
  );
};
const cleanupGameobjects = () => {
  LENSFLARE_LAYER.splice(0, LENSFLARE_LAYER.length);
  NEBULA_LAYER.splice(0, NEBULA_LAYER.length);
  MAP_PLANETS.splice(0, MAP_PLANETS.length);
  MAP_PORTALS.splice(0, MAP_PORTALS.length);
  MAP_STATIONS.splice(0, MAP_STATIONS.length);
  MAP_SHIPS.splice(0, MAP_SHIPS.length - 1); //-1 to leave hero ship
  DRONES_LAYER.splice(0, DRONES_LAYER.length);
  LASER_LAYER.splice(0, LASER_LAYER.length);
  ROCKET_LAYER.splice(0, ROCKET_LAYER.length);
  EXPLOSION_LAYER.splice(0, EXPLOSION_LAYER.length);
};
const drawGame = (timestamp) => {
  if (END) return;
  DELTA_TIME = timestamp - LAST_UPDATE;
  LAST_UPDATE = timestamp;
  displayFPS();
  FPS++;
  requestAnimationFrame(drawGame);
  MAIN.cleanup();
  BG_LAYER.update();
  //HERO.processDest();
  updateLayer(LENSFLARE_LAYER);
  updateLayer(NEBULA_LAYER);
  updateLayer(MAP_PLANETS);
  updateLayer(MAP_STATIONS);
  updateLayer(MAP_PORTALS);
  SHIPS_ON_SCREEN = 0;
  updateLayer(MAP_SHIPS);
  updateLayer(COMBAT_LAYER);
  updateLayer(DRONES_LAYER);
  updateLayer(LASER_LAYER);
  updateLayer(ROCKET_LAYER);
  updateLayer(EXPLOSION_LAYER);
  updateLayer(MESSAGE_LAYER);
  lockTarget();
  updateLayer(HIT_LAYER);
  MINIMAP.minimapManager();
};
const updateLayer = (layer) => {
  for (let i = 0, n = layer.length; i < n; i++) {
    if (!layer[i]) continue;
    layer[i].update();
  }
};
const resetGamemap = () => {
  const sound = new Sound(`./spacemap/audio/portal/mapChange.mp3`);
  cleanupGameobjects();
  setGamemapObjects();
  sound.play();
  MINIMAP.changeBackground();
  BG_LAYER.setNewMap();
};
const terminateGame = () => {
  END = true;
  window.close();
};
const handleLogoutResult = (bool) => {
  if (bool == true) {
    SOCKET.terminate();
    terminateGame();
  }
  else if (HERO.isLogout) HERO.setLogout();
};
const stopFlySound = () => {
  isPlayingFly = false;
  flySound.stop();
  flySound2.stop();
};
const playFlySound = () => {
  if (isPlayingFly) return; //prevent multiple fly sounds
  isPlayingFly = true;
  flySound.play();
  setTimeout(() => {
    flySound2.play();
  }, 250);
};
const manageLoadingBar = () => {
  const loadingBarReal = document.querySelector(".loading_bar_real");
  if (loadingBarReal == null) return;
  const width = (progress / maxProgress) * 100 + "%";
  document.querySelector(".loading_bar_real").style.width = width;
  if (progress >= maxProgress) {
    loadingStatus = true;
    document
      .querySelector(".loading_bar_wrapper")
      .classList.add("loading_bar_ready");
    document.querySelector(".loading_bar_real").innerText = "START";
  }
};
window.onload = () => {
  Fetcher.fetchAll();
  EVENT_MANAGER = new EventManager();
  MAIN = new Client();
  SOCKET = new Socket(HOST);
  PRELOADER = new Preloader(Models);
  PRELOADER.preload();
  LANGUAGE_MANAGER = new LanguageManager();
};
