const lockOnSprite = new Image();
lockOnSprite.src = `./spacemap/ui/lockOn.png`;
function getTextOffset (font, txt) {
  GAME_MAP.ctx.font = font;
  return Math.ceil(GAME_MAP.ctx.measureText(txt).width / 2);
}
const checkXVis = (x, off) => {
  return x - off > screenWidth * 1.1 || x + off < -100;
};
const checkYVis = (y, off) => {
  return y - off > screenHeight * 1.1 || y + off < -100;
};
const controlVisibility = (x, offX, y, offY) => {
  //return if object is visible
  if (checkXVis(x, offX) || checkYVis(y, offY)) {
    return false;
  } else {
    return true;
  }
};
//
const drawCenter = (ship) => {
  GAME_MAP.ctx.fillStyle = "red";
  GAME_MAP.ctx.fillRect(
    ship.render.renderX + ship.offset.x - 5,
    ship.render.renderY + ship.offset.y - 5,
    10,
    10
  );
  GAME_MAP.ctx.fillStyle = "black";
};
const drawBounds = (ship) => {
  GAME_MAP.ctx.strokeStyle = "red";
  GAME_MAP.ctx.strokeRect(
    ship.render.renderX,
    ship.render.renderY,
    ship.offset.x * 2,
    ship.offset.y * 2
  );
  GAME_MAP.ctx.strokeStyle = "black";
};
const displayShipStructure = (hp, shd, hpStart, shdStart, x, y) => {
  const width = 60;
  const height = 3;
  const top = y - 30;
  const margin = 7;
  const start = x - width / 2;
  let hpPerc = (hp / hpStart) * width;
  let shdPerc = (shd / shdStart) * width;
  GAME_MAP.ctx.strokeStyle = "black";
  GAME_MAP.ctx.strokeRect(start, top, width, height); //container border
  GAME_MAP.ctx.fillStyle = COLORS.STRUCTURE_BG;
  GAME_MAP.ctx.fillRect(start, top, width, height); //bgcont
  GAME_MAP.ctx.fillStyle = COLORS.HP_COLOR;
  GAME_MAP.ctx.fillRect(start, top, hpPerc, height); //hp
  if (shdPerc > 0) {
    GAME_MAP.ctx.strokeRect(start, top + margin, width, height); //container
    GAME_MAP.ctx.fillStyle = COLORS.STRUCTURE_BG;
    GAME_MAP.ctx.fillRect(start, top + margin, width, height); //bgcont
    GAME_MAP.ctx.fillStyle = COLORS.SHD_COLOR;
    GAME_MAP.ctx.fillRect(start, top + margin, shdPerc, height); //shd
  }
  GAME_MAP.ctx.fillStyle = "black";
};
const getDroneOffset = (drnString) => {
  return getTextOffset(DEFAULTS.DRONE_SIMPLE_FONT, drnString);
};
const drawUserShipInfo = (
  rankSprite,
  rank,
  factionSprite,
  factionID,
  x,
  y,
  usernameOffsetX,
  offsetY,
  isHero,
  username
) => {
  if (!SETTINGS.settingsArr[MENU_INTERFACE][0]) return;
  const xRankMargin = 18;
  const xFactionMargin = 2;
  const marginTop = 14;
  if (rank >= 0) {
    GAME_MAP.ctx.drawImage(
      rankSprite,
      x - xRankMargin - usernameOffsetX,
      y + offsetY - marginTop
    );
  }
  if (factionID > 0) {
    GAME_MAP.ctx.drawImage(
      factionSprite,
      x + xFactionMargin + usernameOffsetX,
      y + offsetY - marginTop + 2
    );
  }
  let color = COLORS.COLOR_ENEMY;
  if (isHero) color = COLORS.COLOR_HERO;
  else if (factionID == HERO.ship.faction) color = COLORS.COLOR_ALLY;
  GAME_MAP.ctx.shadowColor = "black";
  GAME_MAP.ctx.shadowBlur = 4;
  GAME_MAP.ctx.textAlign = "left";
  GAME_MAP.ctx.font = DEFAULTS.USERNAME_FONT;
  GAME_MAP.ctx.fillStyle = color;
  GAME_MAP.ctx.fillText(username, x - usernameOffsetX, Math.round(y + offsetY)); //add proper offset
  GAME_MAP.ctx.fillStyle = "black";
  GAME_MAP.ctx.shadowBlur = 0;
};
const drawLeech = (width, height, x, y, seq) => {
  const leechSize = 301;
  x += (width - leechSize) / 2;
  y += (height - leechSize) / 2;
  GAME_MAP.ctx.drawImage(PRELOADER.modelsBuffer[7][seq], x, y);
};
// TODO
const drawFormation = (formation, x, y) => {
  const top = 30;
  const marginX = 65;
  GAME_MAP.ctx.drawImage(formation, x - marginX, y - top);
};
const drawGateRings = (numOfRings, x, y, offsetY) => {
  const xMargin = 19;
  const margin = 22;
  x -= xMargin;
  y += offsetY - margin;
  const sprite = new Image();
  let i = 1;
  if (numOfRings > 6) {
    sprite.src = `./spacemap/rings/crown.png`;
    i = 7;
  } else sprite.src = `./spacemap/rings/ring.png`;
  for (i = i; i <= numOfRings; i++) {
    if (i > 4 && i < 7) GAME_MAP.ctx.globalAlpha = 0.7;
    const pos = OFFSET_DATA.GATE_RING_OFFSETS[i - 1];
    GAME_MAP.ctx.drawImage(sprite, x + pos.x, y + pos.y);
    GAME_MAP.ctx.globalAlpha = 1;
  }
};
const manageLogoutWindow = () => {
  if (HERO.isLogout) {
    document.querySelector(".logout_window").remove();
    MAIN.writeToLog("logout_cancel", true);
  } else {
    MAIN.writeToLog("logout_init", true);
    let window = document.createElement("div");
    window.classList.add("logout_window", "body_active");
    window.innerHTML = `<div class="header header_active"><div><img src="./spacemap/ui/uiIcon/logout_normal.png"></div><span>${
      TEXT_TRANSLATIONS.logout_label
    }</span></div><div class="main logout_main"><span class="translate_txt" transl_key="logout_txt_top">${
      TEXT_TRANSLATIONS.logout_txt_top
    }</span><span id="logout_countdown">${LOGOUT_TIME / 1000}</span><span>${
      TEXT_TRANSLATIONS.logout_txt_bottom
    }</span></div>`;
    const btn = document.createElement("button");
    btn.innerText = TEXT_TRANSLATIONS.cancel;
    btn.classList.add("logout_btn");
    btn.addEventListener("click", (ev) =>
      EVENT_MANAGER.handleLogoutRequest(true)
    );
    document.body.appendChild(window);
    document.querySelector(".logout_main").appendChild(btn);
    initLogoutCountdown();
  }
};
const initLogoutCountdown = () => {
  let time = document.querySelector("#logout_countdown");
  let TIME_LEFT = LOGOUT_TIME;
  setInterval(() => {
    if (!HERO.isLogout || TIME_LEFT <= 0) return;
    TIME_LEFT -= 1000;
    time.innerText = TIME_LEFT / 1000;
  }, 1000);
};
const manageFpsWindow = () => {
  if (SHOW_FPS) {
    document.querySelector(".fps_display").remove();
    SHOW_FPS = false;
  } else {
    let fpsBox = document.createElement("div");
    fpsBox.classList.add("fps_display");
    document.body.appendChild(fpsBox);
    SHOW_FPS = true;
    displayFPS();
  }
};
const displayFPS = () => {
  if (!SHOW_FPS) return;
  let fps = Math.round(1000 / GAME_MAP.getDeltaTime());
  document.querySelector(
    ".fps_display"
  ).innerHTML = `<span>FPS: ${fps} | Rendering ${SHIPS_ON_SCREEN} ships | V${BUILD_VERSION}</span>`;
};
//game objects interactions
const handlePortalJump = (data) => {
  data = trimData(data);
  const portal = getPortalById(data[0]);
  if (portal == null) return;
  HERO.ship.drones.forEach((d) => d.setDistPerFrame(true));
  const sound = new Sound(`./spacemap/audio/portal/portalJump.mp3`);
  const voice = new Sound(`./spacemap/audio/portal/voicePortalJump.mp3`);
  voice.play();
  sound.play();
  portal.activate();
};
const handlePortalRange = () => {
  MAIN.writeToLog(TEXT_TRANSLATIONS.port_away);
};
const getShipById = (id) => {
  let ship = null;
  MAP_MANAGER.MAP_SHIPS.some((item) => {
    if (item.ID == id) {
      ship = item;
      return true;
    }
  });
  return ship;
};
const getPortalById = (id) => {
  let portal = null;
  MAP_MANAGER.MAP_PORTALS.some((p) => {
    if (p.ID == id) {
      portal = p;
      return true;
    }
  });
  return portal;
};
const getLockOffset = (id) => {
  return OFFSET_DATA.LOCK_OFFSETS[id];
};
const lockTarget = () => {
  if (HERO.ship.targetID === 0) return;
  const ship = getShipById(HERO.ship.targetID);
  if (ship == null) return;
  const targetRndrX = ship.render.renderX;
  const targetRndrY = ship.render.renderY;
  const offset = getLockOffset(ship.shipID);
  GAME_MAP.ctx.drawImage(
    lockOnSprite,
    targetRndrX + offset.x - DEFAULTS.LOCKON_RING,
    targetRndrY + offset.y
  );
};
const checkCollision = () => {
  let dist = null;
  return Object.values(MAP_MANAGER.MAP_SHIPS).some((ship) => {
    dist = getDistance(
      ship.render.renderX + ship.offset.x,
      ship.render.renderY + ship.offset.y,
      EVENT_MANAGER.mouse.x,
      EVENT_MANAGER.mouse.y
    );
    if (dist <= clickRange) {
      HERO.requestTarget(ship.ID);
      return true;
    }
  });
};
