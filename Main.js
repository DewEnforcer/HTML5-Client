const BUILD_VERSION = "0.4.1";
const CURRENT_LANGUAGE = "en";
const HOST = "ws://localhost:8080";
//loading bar data
let loadingStatus = false;
let progress = 0;
const maxProgress = 13;
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
let DRONE_POSITIONS;
// btns
const BTN_FPS = "f";
const BTN_ATTACK = " ";
const BTN_LOGOUT = "l";
const BTN_PORT = "j";
const BTN_SHIP = "q";
const BTN_RNDMOV = "=";
const BTN_SWITCH = ["+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é"];
//game vars not fetched
const REFRESH_TIME = 100;
const LASER_SPEED = 1100;
const ELA_SPEED = 500;
const MISSILE_SPEED = 1000;
const MAX_MISSILE_FLY_TIME = 5000;
const clickRange = 100;
const mapWidth = 21000;
const mapHeight = 13000;
const LOGOUT_TIME = 5000;
let END = false;
let SHOW_FPS = false;
let DELTA_TIME = new Date() * 1;
let LAST_UPDATE = 0;
let gameInit = false;
let mapName = "";
const CLOAK_ALPHA = 0.5;
//PATHS
const PATH_TO_PORTALS = `./spacemap/portals`;
const PATH_TO_PLANETS = `./spacemap/planets`;
const PATH_TO_BG = `./spacemap/backgrounds`;
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
const HIT_LAYER = [];
const DRONES_LAYER = [];
const EXPLOSION_LAYER = [];
const MESSAGE_LAYER = [];
const LENSFLARE_LAYER = [];
// class vars/context
let EVENT_MANAGER,
  MAIN,
  HERO,
  SOCKET,
  BG_LAYER,
  MINIMAP,
  PRELOADER,
  CAMERA,
  UIcls,
  SETTINGS;
let halfScreenWidth;
let halfScreenHeight;
let screenWidth;
let screenHeight;
let ctx;
//MAIN FUNCTIONS
const initiatePostHero = () => {
  PRELOADER.preload();
  MINIMAP = new Minimap();
  BG_LAYER = new Background(HERO.mapID);
  UIcls = new UI();
  SETTINGS = new Settings();
  setGamemapObjects();
  gameInit = true;
  const welcome = new Sound(`./spacemap/audio/start/welcomeSound.mp3`);
  welcome.play();
  drawGame();
  MAIN.writeToLog("welcome_log", true);
};
const setGamemapObjects = () => {
  MAP_OBJECTS_LIST[HERO.mapID].planets.forEach((planet) => {
    MAP_PLANETS.push(
      new Planet(planet.id, planet.x, planet.y, planet.z, planet.mScale)
    );
  });
  MAP_OBJECTS_LIST[HERO.mapID].portals.forEach((portal) => {
    MAP_PORTALS.push(new Portal(portal.x, portal.y, portal.id));
  });
  MAP_OBJECTS_LIST[HERO.mapID].stations.forEach((sta) => {
    MAP_STATIONS.push(
      new Station(sta.x, sta.y, sta.z, sta.rotation, sta.type, sta.id)
    );
  });
  MAP_OBJECTS_LIST[HERO.mapID].lensflares.forEach((lens) => {
    LENSFLARE_LAYER.push(new LensFlare(lens.id, lens.x, lens.y, lens.z));
  });
  mapName = MAP_OBJECTS_LIST[HERO.mapID].name;
  if (typeof mapName === "undefined") mapName = "Unknown";
  MESSAGE_LAYER.push(new MapMessage(`MAP ${mapName}`, 3));
};
const cleanupGameobjects = () => {
  MAP_PLANETS.splice(0, MAP_PLANETS.length);
  MAP_PORTALS.splice(0, MAP_PORTALS.length);
  MAP_STATIONS.splice(0, MAP_STATIONS.length);
  MAP_SHIPS.splice(0, MAP_SHIPS.length - 1); //-1 to leave hero ship
  DRONES_LAYER.splice(0, DRONES_LAYER.length);
  LASER_LAYER.splice(0, LASER_LAYER.length);
  ROCKET_LAYER.splice(0, ROCKET_LAYER.length);
  LENSFLARE_LAYER.splice(0, LENSFLARE_LAYER.length);
  EXPLOSION_LAYER.splice(0, EXPLOSION_LAYER.length);
};
const drawGame = (timestamp) => {
  if (END) return;
  DELTA_TIME = timestamp - LAST_UPDATE;
  LAST_UPDATE = timestamp;
  displayFPS();
  requestAnimationFrame(drawGame);
  MAIN.cleanup();
  BG_LAYER.update();
  HERO.processDest();
  LENSFLARE_LAYER.forEach((lens) => lens.update());
  MAP_PLANETS.forEach((planet) => planet.update());
  MAP_PORTALS.forEach((portal) => portal.update());
  MAP_STATIONS.forEach((sta) => sta.update());
  MAP_SHIPS.forEach((ship) => ship.update());
  DRONES_LAYER.forEach((drone) => drone.update());
  LASER_LAYER.forEach((laser) => laser.update());
  ROCKET_LAYER.forEach((rocket) => rocket.update());
  EXPLOSION_LAYER.forEach((exp) => exp.update());
  MESSAGE_LAYER.forEach((msg) => msg.update());
  lockTarget();
  HIT_LAYER.forEach((hit) => hit.update());
  MINIMAP.minimapManager();
};
const resetGamemap = () => {
  const sound = new Sound(`./spacemap/audio/portal/mapChange.mp3`);
  cleanupGameobjects();
  sound.play();
  MINIMAP.changeBackground();
  BG_LAYER.setNewMap();
  setGamemapObjects();
};
const terminateGame = () => {
  END = true;
  window.close();
};
const handleLogoutResult = (bool) => {
  if (bool == 1) terminateGame();
  else HERO.setLogout();
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
};
