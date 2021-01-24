const BUILD_VERSION = "0.7.9";
let CURRENT_LANGUAGE = "en";
const HOST = "ws://localhost:8080";
const CHAT_HOST = "ws://localhost:9338";
//karnival, replacement, turkey, winterGiftBox
//loading bar data
let loadingStatus = true;
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
// class vars/context
let EVENT_MANAGER,
  UI_MAIN,
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
  GAME_MAP,
  MAP_MANAGER,
  LOADER,
  CONNECTION,
  LANGUAGE_MANAGER;
let halfScreenWidth;
let halfScreenHeight;
let screenWidth;
let screenHeight;
let ctx;

window.onload = () => {
    LOADER = new Loader();

    Fetcher.fetchAll();
    PRELOADER = new Preloader(Models);
    PRELOADER.preload();

    SOCKET = new Socket(HOST);
    UI_MAIN = new Client();
    EVENT_MANAGER = new EventManager();
    LANGUAGE_MANAGER = new LanguageManager();
}
const handleGameStart = () => {
    if (!loadingStatus) return;

    CONNECTION = new Connection();
    SOCKET.initiateConnection();
}
const handleHeroLoaded = data => {
    data = trimData(data);

    HERO = new Hero(data);
    CAMERA = new Camera();
    UI_MAIN.init();
    UI_MAIN.UI.settings.setWindowStates();
    GAME_MAP = new GameMap();
    MAP_MANAGER = new MapManager();
    MAP_MANAGER.updateMap(HERO.mapID);
    EVENT_MANAGER.initListeners();
    HERO.setShip();
    CAMERA.setCameraTarget(HERO.getShip());
    LANGUAGE_MANAGER.translateGame();

    SETTINGS = UI_MAIN.UI.settings

    UI_MAIN.UI.log.addLogMessage("welcome_log", true);
    gameInit = true;

    GAME_MAP.renderFrame();
    //displayFPS();
    //drawGame();
}
const terminateGame = () => {
  SOCKET.terminate();
  window.close();
}