const displayShipStructure = (hp, shd, hpStart, shdStart, x, y) => {
  let hpPerc = (hp / hpStart) * 100;
  let shdPerc = (shd / shdStart) * 100;
  ctx.strokeStyle = "black";
  ctx.strokeRect(50 + x, y - 30, 100, 10); //countainer
  ctx.strokeRect(50 + x, y - 15, 100, 10); //container
  ctx.fillStyle = "green";
  ctx.fillRect(50 + x, y - 30, hpPerc, 8); //hp
  ctx.fillStyle = "blue";
  ctx.fillRect(50 + x, y - 15, shdPerc, 8); //shd
  ctx.fillStyle = "black";
};
const drawName = (username, x, y) => {
  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(username, x + 100, y + 120); //add proper offset
  ctx.fillStyle = "black";
};
const writeToLog = (log, msg, isTranslate = false) => {
  if (isTranslate) {
    msg = TEXT_TRANSLATIONS[msg];
  }
  log.append(`<span>${msg}</span>`);
};
const manageFpsWindow = () => {
  if (SHOW_FPS) {
    document.querySelector(".fps_display").remove();
    SHOW_FPS = false;
  } else {
    let fpsBox = document.createElement("div");
    fpsBox.classList.add("fps_display");
    INTERFACE.appendChild(fpsBox);
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
const lockTarget = () => {
  if (HERO.targetID === 0) return;
  const targetRndrX = MAP_SHIPS[HERO.targetID].renderX;
  const targetRndrY = MAP_SHIPS[HERO.targetID].renderY;
  const shipOffset = MAP_SHIPS[HERO.targetID].offset;
  ctx.beginPath();
  ctx.arc(
    //draw outter circle
    targetRndrX + shipOffset,
    targetRndrY + shipOffset,
    this.offsetY * 1.1,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    //draw inner circle
    targetRndrX + shipOffset,
    targetRndrY + shipOffset,
    this.offsetY,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "#C21807";
  ctx.lineWidth = 2;
  ctx.stroke();
};
const checkCollision = () => {
  let dist = null;
  const clickRange = 100; //change later
  return Object.values(MAP_SHIPS).some((ship) => {
    dist = getDistance(ship.renderX, ship.renderY, mouse.x, mouse.y);
    if (dist <= clickRange) {
      HERO.setTarget(ship.ID);
      return true;
    }
  });
};
