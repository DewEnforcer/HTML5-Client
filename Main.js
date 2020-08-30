const HOST = "ws://localhost:8080";
const TEXT_TRANSLATIONS = {
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
const BTN_FPS = "f";
const BTN_ATTACK = " ";
const BTN_LOGOUT = "l";
const BTN_PORT = "j";
const BTN_SHIP = "q";
const BTN_RNDMOV = "é";
const BTN_SWITCH = ["+", "ě"];
const DEFAULT_NICK_Y = 120;
const SHIP_OFFSETS = {
  0: { x: 100, y: 61.5, nickY: DEFAULT_NICK_Y },
  1: { x: 100, y: 61.5, nickY: DEFAULT_NICK_Y },
  2: { x: 84.5, y: 75, nickY: DEFAULT_NICK_Y + 35 },
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
  1: "Alpha",
  2: "Beta",
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
const ships = ["starhawk", "sr100", "enforcer"];
let SHIPS_ENGINES = null;
const engineOFFSET = {
  x: 30.5,
  y: 30.5,
};
let LASER_POS = null;
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
//
let EVENT_MANAGER, MAIN, HERO, SOCKET, BG_LAYER, MINIMAP, PRELOADER, CAMERA;
let halfScreenWidth;
let halfScreenHeight;
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
const initiatePostHero = () => {
  PRELOADER.preload();
  //initiates game objects after hero is init
  MINIMAP = new Minimap();
  BG_LAYER = new Background(HERO.mapID);
  setGamemapObjects();
  gameInit = true;
  drawGame();
};
const setGamemapObjects = () => {
  //init all planets, portals on the map
  MAP_OBJECTS_LIST[HERO.mapID].planets.forEach((planet) => {
    MAP_PLANETS.push(new Planet(planet.id, planet.x, planet.y, planet.z));
  });
  MAP_OBJECTS_LIST[HERO.mapID].portals.forEach((portal) => {
    MAP_PORTALS.push(new Portal(portal.x, portal.y, portal.id));
  });
  MAP_OBJECTS_LIST[HERO.mapID].stations.forEach((sta) => {
    MAP_STATIONS.push(
      new Station(sta.x, sta.y, sta.z, sta.rotation, sta.type, sta.id)
    );
  });
};
const cleanupGameobjects = () => {
  MAP_PLANETS.splice(0, MAP_PLANETS.length);
  MAP_PORTALS.splice(0, MAP_PORTALS.length);
  MAP_STATIONS.splice(0, MAP_STATIONS.length);
  MAP_SHIPS.splice(0, MAP_SHIPS.length - 1); //-1 to leave hero ship
  DRONES_LAYER.splice(0, DRONES_LAYER.length);
  LASER_LAYER.splice(0, LASER_LAYER.length);
  ROCKET_LAYER.splice(0, ROCKET_LAYER.length);
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
  MAP_PLANETS.forEach((planet) => planet.update());
  MAP_PORTALS.forEach((portal) => portal.update());
  MAP_STATIONS.forEach((sta) => sta.update());
  MAP_SHIPS.forEach((ship) => ship.update());
  DRONES_LAYER.forEach((drone) => drone.update());
  LASER_LAYER.forEach((laser) => laser.update());
  ROCKET_LAYER.forEach((rocket) => rocket.update());
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
  addFetchOffset();
  EVENT_MANAGER = new EventManager();
  MAIN = new Client();
  SOCKET = new Socket(HOST);
  PRELOADER = new Preloader(Models);
};
