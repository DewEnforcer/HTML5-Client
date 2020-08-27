const getTextOffset = (font, txt) => {
  ctx.font = font;
  return Math.ceil(ctx.measureText(txt).width / 2);
};
const displayShipStructure = (hp, shd, hpStart, shdStart, x, y) => {
  const width = 70;
  const height = 5;
  const top = y - 30;
  const margin = 7;
  const start = x - width / 2;
  let hpPerc = (hp / hpStart) * width;
  let shdPerc = (shd / shdStart) * width;
  ctx.strokeStyle = "black";
  ctx.strokeRect(start, top, width, height); //countainer
  ctx.fillStyle = HP_COLOR;
  ctx.fillRect(start, top, hpPerc, height); //hp
  if (shdPerc > 0) {
    ctx.strokeRect(start, top + margin, width, height); //container
    ctx.fillStyle = SHD_COLOR;
    ctx.fillRect(start, top + margin, shdPerc, height); //shd
  }
  ctx.fillStyle = "black";
};
const drawName = (offsetX, username, faction, isHero, x, y, offsetY = 120) => {
  let color = COLOR_ENEMY;
  if (faction == HERO.faction) color = COLOR_ALLY;
  if (isHero) color = COLOR_HERO;
  ctx.textAlign = "left";
  ctx.font = USERNAME_FONT;
  ctx.fillStyle = color;
  ctx.fillText(username, x - offsetX, y + offsetY); //add proper offset
  ctx.fillStyle = "black";
};
const drawRank = (rank, x, y, offsetY) => {
  const xMargin = 18; //16 + 2
  const marginTOP = 16; //accounts for rank height
  let rankSprite = new Image();
  rankSprite.src = `./spacemap/ui/rank/rank_${rank}.png`;
  ctx.drawImage(rankSprite, x - xMargin, y + offsetY - marginTOP);
};
const drawFaction = (x, y, faction, offsetY) => {
  const xMargin = 2;
  const marginTOP = 12; //accounts for faction height
  let factionSprite = new Image();
  factionSprite.src = `./spacemap/ui/faction/${faction}.png`;
  ctx.drawImage(factionSprite, x + xMargin, y + offsetY - marginTOP);
};
const drawEngine = (x, y, shipSeq, angle, engineClass, seq) => {
  const sprite = new Image();
  sprite.src = `./spacemap/engines/standard/${seq}.png`;
  const offset = SHIPS_ENGINES[engineClass][shipSeq];
  let renderX = x + offset.x;
  let renderY = y + offset.y;
  ctx.translate(renderX, renderY);
  ctx.rotate(-angle);
  ctx.drawImage(sprite, -engineOFFSET.x, -engineOFFSET.y);
  ctx.rotate(angle);
  ctx.translate(-renderX, -renderY);
};
const manageLogoutWindow = () => {
  if (HERO.loggingOut) {
    document.querySelector(".logout_window").remove();
    MAIN.writeToLog("logout_cancel", true);
  } else {
    MAIN.writeToLog("logout_init", true);
    let window = document.createElement("div");
    window.classList.add("logout_window", true);
    window.innerHTML = `<span>Logging out in:</span><span id="logout_countdown">${
      LOGOUT_TIME / 1000
    }</span>`;
    document.body.appendChild(window);
    initLogoutCountdown();
  }
};
const initLogoutCountdown = () => {
  let time = document.querySelector("#logout_countdown");
  let TIME_LEFT = LOGOUT_TIME;
  setInterval(() => {
    if (!HERO.loggingOut || TIME_LEFT <= 0) return;
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
  }
};
const displayFPS = () => {
  if (!SHOW_FPS) return;
  let fps = Math.round(1000 / DELTA_TIME);
  document.querySelector(".fps_display").innerHTML = `<span>FPS: ${fps}</span>`;
};
//game objects interactions
const handlePortalJump = ({ portalID, newMap, isHeroJump = false }) => {
  const portal = MAP_PORTALS[portalID];
  if (portal === "") return;
  portal.activate(newMap, isHeroJump);
};
const handlePortalRange = () => {
  writeToLog(TEXT_TRANSLATIONS.port_away, true);
};
const getShipById = (id) => {
  let ship = null;
  MAP_SHIPS.some((item) => {
    if (item.ID == id) {
      ship = item;
      return true;
    }
  });
  return ship;
};
const getLockOffset = (id) => {
  return LOCK_OFFSETS[id];
};
const lockTarget = () => {
  if (HERO.targetID === 0) return;
  const ship = getShipById(HERO.targetID);
  if (ship == null) return;
  const targetRndrX = ship.render.renderX;
  const targetRndrY = ship.render.renderY;
  const offset = getLockOffset(ship.shipID);
  ctx.drawImage(lockOnSprite, targetRndrX + offset.x, targetRndrY + offset.y);
};
const checkCollision = () => {
  let dist = null;
  return Object.values(MAP_SHIPS).some((ship) => {
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
