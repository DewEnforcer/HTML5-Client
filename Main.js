const HOST = "ws://localhost:8080";
const TEXT_TRANSLATIONS = {
  attack: "Commecing attack!",
  no_range: "Out of range",
  end_attack: "Weapons offline",
  disconnected: "You are currently disconnected from our servers!",
  port_away: "Jump failed, there are no portals nearby!",
  logout_cancel: "Logout has been canceled",
  logout_init: "Logging out, please standby!",
};
const BTN_FPS = "f";
const BTN_ATTACK = " ";
const BTN_LOGOUT = "l";
const BTN_PORT = "j";
const REFRESH_TIME = 100;
//PATHS
const PATH_TO_PORTALS = `./spacemap/portals`;
const PATH_TO_PLANETS = `./spacemap/planets`;
const PATH_TO_BG = `./spacemap/backgrounds`;
//
const mapNames = {
  1: "Alpha",
  2: "Beta",
};
const mapWidth = 10000;
const mapHeight = 7000;
//
const LOGOUT_TIME = 5000;
let END = false;
let SHOW_FPS = false;
let DELTA_TIME = new Date() * 1;
let LAST_UPDATE = 0;
let gameInit = false;
const ships = ["starhawk", "sr100"];
let MAP_OBJECTS_LIST = null;
const MAP_PLANETS = [];
const MAP_PORTALS = [];
const MAP_SHIPS = [];
let EVENT_MANAGER, MAIN, HERO, SOCKET, BG_LAYER, MINIMAP, PRELOADER;
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
const initiatePostHero = () => {
  PRELOADER.preload();
  //initiates game objects after hero is init
  MINIMAP = new Minimap();
  BG_LAYER = new Background(HERO.mapID);
  //init all planets, portals on the map
  MAP_OBJECTS_LIST[HERO.mapID].planets.forEach((planet) => {
    MAP_PLANETS.push(new Planet(planet.id, planet.x, planet.y));
  });
  MAP_OBJECTS_LIST[HERO.mapID].portals.forEach((portal) => {
    MAP_PORTALS.push(new Portal(portal.x, portal.y));
  });
  gameInit = true;
  drawGame();
};
const drawGame = (timestamp) => {
  if (END) return;
  DELTA_TIME = timestamp - LAST_UPDATE;
  LAST_UPDATE = timestamp;
  displayFPS();
  requestAnimationFrame(drawGame);
  MAIN.cleanup();
  BG_LAYER.update();
  MAP_PLANETS.forEach((planet) => planet.update());
  MAP_PORTALS.forEach((portal) => portal.update());
  HERO.update();
  MINIMAP.minimapManager();
};
const terminateGame = () => {
  END = true;
  window.close();
};
const handleLogoutResult = (bool) => {
  if (bool == 1) terminateGame();
  else HERO.setLogout();
};
window.onload = () => {
  fetchMapObjects();
  EVENT_MANAGER = new EventManager();
  MAIN = new Client();
  SOCKET = new Socket(HOST);
  PRELOADER = new Preloader(Models);
};
