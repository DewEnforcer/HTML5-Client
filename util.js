function toDegs(rad) {
  return Math.abs(rad * (180 / Math.PI));
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
function calcAngle(x, y, destX, destY) {
  let angle = ((Math.atan2(destX - x, destY - y) * 180) / Math.PI + 360) % 360;
  return toRadians(angle);
}
function returnVectorLen(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
function getDistance(x, y, targetx, targety) {
  let distanceX = targetx - x;
  let distanceY = targety - y;
  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}
function speedVelocity(shipSpeed, vectorAngle) {
  let velocity = {
    x: shipSpeed * Math.sin(vectorAngle),
    y: shipSpeed * Math.cos(vectorAngle),
  };
  return velocity;
}
function getOffset(shipID) {
  return {
    x: 100,
    y: 61.5,
  };
}
function getShipCoords(shipID) {
  return { x: 100, y: 61.5 }; //todo
}
function convertToMapCoords({ x, y }) {
  x = HERO.x + (x - halfScreenWidth);
  y = HERO.y + (y - halfScreenHeight);
  return { x, y };
}
function getNearestPortal() {
  let range = null;
  let portalID = null;
  Object.values(MAP_PORTALS).forEach((port) => {
    let dist = getDistance(HERO.x, HERO.y, port.x, port.y);
    if (range === null || dist < range) {
      range = dist;
      portalID = port.ID;
    }
  });
  return portalID;
}
