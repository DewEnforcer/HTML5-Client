const displayShipStructure = (hp, shd, hpStart, shdStart, x, y) => {
  let hpPerc = (hp / hpStart) * 100;
  let shdPerc = (shd / shdStart) * 100;
  ctx.strokeStyle = "black";
  ctx.strokeRect(50 + x, y - 30, 100, 10); //countainer
  ctx.strokeRect(50 + x, y - 15, 100, 10); //container
  ctx.fillStyle = "green";
  ctx.fillRect(50 + x, y - 30, hpPerc, 8); //hp
  if (shdPerc > 0) {
    ctx.fillStyle = "blue";
    ctx.fillRect(50 + x, y - 15, shdPerc, 8); //shd
  }
  ctx.fillStyle = "black";
};
const drawName = (username, x, y) => {
  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(username, x + 100, y + 120); //add proper offset
  ctx.fillStyle = "black";
};
const drawRank = (rank, x, y) => {
  let rankSprite = new Image();
  rankSprite.src = `./spacemap/ui/rank/rank_${rank}.png`;
  ctx.drawImage(rankSprite, x + 30, y + 105);
};
const displayHit = (value, x, y, heal = false) => {
  color = "red";
  if (heal) color = "green";
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(value, x, y);
  ctx.fillStyle = "black";
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
const lockTarget = () => {
  if (HERO.targetID === 0) return;
  const ship = getShipById(HERO.targetID);
  if (ship == null) return;
  const targetRndrX = ship.renderX;
  const targetRndrY = ship.renderY;
  const shipOffset = ship.offset;
  ctx.beginPath();
  ctx.arc(
    //draw outter circle
    targetRndrX + shipOffset.x,
    targetRndrY + shipOffset.y,
    shipOffset.y * 1.1,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    //draw inner circle
    targetRndrX + shipOffset.x,
    targetRndrY + shipOffset.y,
    shipOffset.y,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "#C21807";
  ctx.lineWidth = 2;
  ctx.stroke();
};
const checkCollision = () => {
  let dist = null;
  return Object.values(MAP_SHIPS).some((ship) => {
    dist = getDistance(
      ship.renderX + ship.offset.x,
      ship.renderY + ship.offset.y,
      EVENT_MANAGER.mouse.x,
      EVENT_MANAGER.mouse.y
    );
    if (dist <= clickRange) {
      HERO.requestTarget(ship.ID);
      return true;
    }
  });
};
