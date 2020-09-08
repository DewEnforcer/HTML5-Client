function toDegs(rad) {
  return Math.abs(rad * (180 / Math.PI));
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
const numberFormated = (val, seperator = ".") => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
};
function calcAngle(x, y, destX, destY) {
  let angle = ((Math.atan2(destX - x, destY - y) * 180) / Math.PI + 360) % 360;
  return toRadians(angle);
}
function returnVectorLen(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
function capitalizeString(str) {
  return str[0].toUpperCase() + str.slice(1, str.length);
}
function getDistance(x, y, targetx, targety) {
  let distanceX = targetx - x;
  let distanceY = targety - y;
  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}
function speedVelocity(shipSpeed, vectorAngle) {
  let velocity = {
    x: Math.round(shipSpeed * Math.sin(vectorAngle)),
    y: Math.round(shipSpeed * Math.cos(vectorAngle)),
  };
  return velocity;
}
function getOffset(shipID) {
  return OFFSET_DATA.SHIP_OFFSETS[shipID];
}
function getPortalOffset() {
  return { x: 100, y: 100 }; //change once more portal types appear
}
function getStationOffset(id) {
  const stationOffsets = {
    Mmo: { x: 851.5, y: 979 },
    Eic: { x: 1000.5, y: 1000.5 },
    Vru: { x: 1000.5, y: 1000.5 },
    Pirate: { x: 1500.5, y: 993 },
    Low: { x: 500.5, y: 500.5 },
  };
  let offsets = { x: 0, y: 0 };
  if (id in stationOffsets === true) offsets = stationOffsets[id];
  return offsets;
}
function getPlanetOffset(id) {
  const planetOffsets = {
    1: { x: 256, y: 256 },
    2: { x: 128, y: 128 },
    3: { x: 256, y: 256 },
    25: { x: 256, y: 256 },
    26: { x: 256, y: 256 },
    27: { x: 64, y: 64 },
  };
  let offset = { x: 0, y: 0 };
  if (id in planetOffsets === true) offset = planetOffsets[id];
  return offset;
}
function getLensOffset(type, id) {
  const lensOffsets = {
    0: {
      1: { x: 85.5, y: 89 },
      2: { x: 38, y: 38 },
      3: { x: 17, y: 17.5 },
      4: { x: 25, y: 24 },
      5: { x: 68.5, y: 68 },
    },
  };
  let offset = { x: 0, y: 0 };
  if (type in lensOffsets === true) {
    if (id in lensOffsets[type] === true) {
      offset = lensOffsets[type][id];
    }
  }
  return offset;
}
function convertToMapCoords({ x, y }) {
  x = CAMERA.followX + (x - halfScreenWidth);
  y = CAMERA.followY + (y - halfScreenHeight);
  return { x, y };
}
function getLaserID() {
  return Date.now();
}
function getNearestPortal() {
  let range = null;
  let portalID = null;
  MAP_PORTALS.forEach((port) => {
    let dist = getDistance(HERO.ship.x, HERO.ship.y, port.x, port.y);
    if (range === null || dist < range) {
      range = dist;
      portalID = port.ID;
    }
  });
  return portalID;
}
function trimData(data, index = 2) {
  data.splice(0, index);
  return data;
}
function getShip(ID) {
  if (ID === "HERO") return HERO;
  return getShipById(ID);
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getLaserClass(shipID) {
  const laserClasses = {
    0: 0,
    1: 1,
    2: 2,
    3: 2,
  };
  return laserClasses[shipID];
}
/* remove later on */
function decompileData(data) {
  let positions = {};
  data = data.replace(/\s/g, "");
  data = data.split(",");
  data.forEach((item, i) => {
    if (i % 2 == 0) {
      positions = { ...positions, [i]: { x: Number(item), y: null } };
      return;
    }
    positions[i - 1] = { x: positions[i - 1].x, y: Number(item) };
  });
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," +
      encodeURIComponent(JSON.stringify(positions))
  );
  element.setAttribute("download", "Data");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function fixData(pos) {
  let data = LASER_POS[2][pos];
  let newObject = {};
  const order = [];
  for (let i = 50; i > 0; i -= 2) {
    order.push(i);
  }
  order.push(64, 62, 60, 58, 56, 54, 52);
  order.forEach((item, i) => {
    newObject = { ...newObject, [i]: data[item] };
  });
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," +
      encodeURIComponent(JSON.stringify(newObject))
  );
  element.setAttribute("download", "Data");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function addFetchOffset() {
  fetch("./js/client/offsetImage.json")
    .then((res) => res.json())
    .then((data) => {
      let offsets = data;
      for (j in offsets[2]) {
        Object.keys(LASER_POS[2]).forEach((key) => {
          LASER_POS[2][key][j].x += offsets[2][j].x;
          LASER_POS[2][key][j].y += offsets[2][j].y;
        });
      }
    });
}
