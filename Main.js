const BUILD_VERSION = "0.3.5";

const HOST = "ws://localhost:8080";

const TEXT_TRANSLATIONS = {
  welcome_log: "Welcome to LOGIS-Systems",
  ship_label: "Ship",
  user_label: "User",
  minimap_label: "Minimap",
  log_label: "Log",
  attack: "Commencing attack!",
  no_range: "Out of range",
  end_attack: "Weapons offline",
  disconnected: "You are currently disconnected from our servers!",
  port_away: "Jump failed, there are no portals nearby!",
  logout_cancel: "Logout has been canceled",
  logout_init: "Logging out, please standby!",
};
//
const displayDrones = false;
const HP_COLOR = "#49BE40";
const SHD_COLOR = "#338FCC";
const STRUCTURE_BG = "#6D6D6D";
const COLOR_ENEMY = "red";
const COLOR_ALLY = "#7CFC00";
const COLOR_HERO = "white";
const COLOR_HAVOC = "#FF0000";
const COLOR_HERCULES = "#328fcc";
// UI
let SUB_MENU_ITEMS;
//
const elements = {
  shipInfo: [
    { name: "HP", isBar: true, color: HP_COLOR, icon: "iconHp" },
    { name: "SHD", isBar: true, color: SHD_COLOR, icon: "iconShd" },
    { name: "CFG", isBar: false, color: "white", icon: "iconCfg" },
    { name: "CARGO", isBar: true, color: "yellow", icon: "iconCargo" },
    { name: "SPEED", isBar: false, color: "white", icon: "iconSpd" },
  ],
  userInfo: [
    { name: "EP", isBar: false, color: "white", icon: "iconEp" },
    { name: "CRED", isBar: false, color: "white", icon: "iconCreds" },
    { name: "LVL", isBar: false, color: "white", icon: "iconLevel" },
    { name: "URI", isBar: false, color: "white", icon: "iconUri" },
    { name: "HON", isBar: false, color: "white", icon: "iconHon" },
  ],
};
const controllers = [
  { type: "log", x: 0, y: 78, icon: "log_" },
  { type: "userinfo", x: 0, y: 0, icon: "user_" },
  { type: "shipinfo", x: -20, y: 39, icon: "ship_" },
  { type: "spacemap", x: 20, y: 39, icon: "minimap_" },
];
//
const fonts = {
  1: { size: "20px", shadowC: 0, shadowBlur: 0, way: 1 },
  2: { size: "50px", shadowC: 0, shadowBlur: 0, way: 1 },
  3: { size: "bold 48px", shadowC: "#0000ff", shadowBlur: 10, way: 1 },
};
//
const BTN_FPS = "f";
const BTN_ATTACK = " ";
const BTN_LOGOUT = "l";
const BTN_PORT = "j";
const BTN_SHIP = "q";
const BTN_RNDMOV = "=";
const BTN_SWITCH = ["+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é"];
const DEFAULT_NICK_Y = 120;
const SHIP_OFFSETS = {
  0: { x: 100, y: 61.5, nickY: DEFAULT_NICK_Y },
  1: { x: 100, y: 61.5, nickY: DEFAULT_NICK_Y },
  2: { x: 84.5, y: 75, nickY: DEFAULT_NICK_Y + 35 },
  3: { x: 84.5, y: 75, nickY: DEFAULT_NICK_Y + 35 },
};
const MISSILE_OFFSETS = {
  1: { x: 3, y: 13.5 },
  2: { x: 3.5, y: 13.5 },
  3: { x: 5, y: 17.5 },
  4: { x: 4, y: 13 },
};
const LOCKON_RING = 15;
const LOCK_OFFSETS = {
  0: { x: 40 - LOCKON_RING, y: 0 },
  1: { x: 40 - LOCKON_RING, y: 0 },
  2: { x: 27 - LOCKON_RING, y: 20 },
  3: { x: 27 - LOCKON_RING, y: 20 },
};
//
const USERNAME_FONT = "bold 16px sans-serif";
const REFRESH_TIME = 100;
const LASER_SPEED = 3000;
const MISSILE_SPEED = 1000;
const MAX_MISSILE_FLY_TIME = 5000;
const HIT_OFFSET = {
  x: 50,
  y: -50,
};
//PATHS
const PATH_TO_PORTALS = `./spacemap/portals`;
const PATH_TO_PLANETS = `./spacemap/planets`;
const PATH_TO_BG = `./spacemap/backgrounds`;
//
const mapNames = {
  1: "1-1",
  2: "1-2",
  14: "4-2",
};
const messageFonts = {
  1: "16px sans-serif",
};
//
const lockOnSprite = new Image();
lockOnSprite.src = `./spacemap/ui/lockOn.png`;
let DRONE_POSITIONS = null;
const DRONE_DISTANCE = 100;
const DRONE_SIMPLE_Y = -5;
const DRONE_SIMPLE_MARGIN_X = 3;
//
const clickRange = 100;
const mapWidth = 21000;
const mapHeight = 13000;
//
const LOGOUT_TIME = 5000;
let END = false;
let SHOW_FPS = false;
let DELTA_TIME = new Date() * 1;
let LAST_UPDATE = 0;
let gameInit = false;
const ships = ["starhawk", "sr100", "enforcer", "bastion"];
let SHIPS_ENGINES = null;
const engineOFFSET = {
  x: 30.5,
  y: 30.5,
};
let LASER_POS = null;
const SHIP_LASER_CLASS = [0, 0, 2, 2];
const LASER_DISTRIBUTION = {
  0: [],
  1: [],
  2: [
    ["LeftRearIn", "RightRearIn"],
    ["LeftFrontIn", "RightFrontIn", "CenterRear"],
    ["LeftFrontOut", "RightFrontOut"],
    ["LeftRearOut", "RightRearOut", "CenterFront"],
  ],
};
let MAP_OBJECTS_LIST = null;
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
//
let EVENT_MANAGER,
  MAIN,
  HERO,
  SOCKET,
  BG_LAYER,
  MINIMAP,
  PRELOADER,
  CAMERA,
  UIcls;
let halfScreenWidth;
let halfScreenHeight;
let screenWidth;
let screenHeight;
let ctx;
const fetchMapObjects = () => {
  fetch("./js/client/mapObjects.json")
    .then((res) => res.json())
    .then((data) => {
      MAP_OBJECTS_LIST = data;
    });
};
const fetchDroneObjects = () => {
  fetch("./js/client/dronePos.json")
    .then((res) => res.json())
    .then((data) => {
      DRONE_POSITIONS = data;
    });
};
const fetchEngineData = () => {
  fetch("./js/client/enginePos.json")
    .then((res) => res.json())
    .then((data) => {
      SHIPS_ENGINES = data;
    });
};
const fetchLaserData = () => {
  fetch("./js/client/laserPos.json")
    .then((res) => res.json())
    .then((data) => {
      LASER_POS = data;
    });
};
const fetchActionbarData = () => {
  fetch("./js/client/SubmenuItems.json")
    .then((res) => res.json())
    .then((data) => {
      SUB_MENU_ITEMS = data;
    });
};
const initiatePostHero = () => {
  PRELOADER.preload();
  //initiates game objects after hero is init
  MINIMAP = new Minimap();
  BG_LAYER = new Background(HERO.mapID);
  UIcls = new UI();
  setGamemapObjects();
  gameInit = true;
  const welcome = new Sound(`./spacemap/audio/start/welcomeSound.mp3`);
  welcome.play();
  drawGame();
  MAIN.writeToLog("welcome_log", true);
};
const setGamemapObjects = () => {
  //init all planets, portals on the map
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
  MESSAGE_LAYER.push(new MapMessage("MAP 1-1", 3));
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
window.onload = () => {
  fetchMapObjects();
  fetchDroneObjects();
  fetchEngineData();
  fetchLaserData();
  fetchActionbarData();
  //addFetchOffset();
  EVENT_MANAGER = new EventManager();
  MAIN = new Client();
  SOCKET = new Socket(HOST);
  PRELOADER = new Preloader(Models);
};
