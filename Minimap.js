class Minimap {
  constructor() {
    this.sprite = new Image();
    this.sprite.src = `${PATH_TO_BG}/background_${HERO.mapID}.jpg`;
  }
  setMinimapCoordinates() {
    MAIN.MINIMAP_TEXT.innerHTML = `<span>Map: ${
      mapNames[HERO.mapID]
    } X:${Math.round(HERO.x)} Y:${Math.round(HERO.y)}</span>`;
  }
  minimapManager() {
    const offset = 2.5;
    let minimapX = MAIN.MINIMAP_C.width * (HERO.x / mapWidth);
    let minimapY = MAIN.MINIMAP_C.height * (HERO.y / mapHeight);
    MAIN.MINIMAP_CTX.fillStyle = "black";
    MAIN.MINIMAP_CTX.strokeStyle = "grey";
    MAIN.MINIMAP_CTX.lineWidth = 2;
    MAIN.MINIMAP_CTX.clearRect(
      //clear minimap
      0,
      0,
      MAIN.MINIMAP_C.width,
      MAIN.MINIMAP_C.height
    );
    MAIN.MINIMAP_CTX.strokeRect(
      //create border
      0,
      0,
      MAIN.MINIMAP_C.width,
      MAIN.MINIMAP_C.height
    );
    MAIN.MINIMAP_CTX.fillRect(
      //fill black
      2,
      2,
      MAIN.MINIMAP_C.width - 4,
      MAIN.MINIMAP_C.height - 4
    );
    MAIN.MINIMAP_CTX.drawImage(
      this.sprite,
      0,
      0,
      MAIN.MINIMAP_C.width,
      MAIN.MINIMAP_C.height
    );
    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(0, minimapY); //draw left to middle
    MAIN.MINIMAP_CTX.lineTo(minimapX - offset, minimapY);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX + offset, minimapY); //draw mid to right
    MAIN.MINIMAP_CTX.lineTo(MAIN.MINIMAP_C.width, minimapY);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, 0); //draw top to middle
    MAIN.MINIMAP_CTX.lineTo(minimapX, minimapY - offset);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, minimapY + offset); //draw mid to bottom
    MAIN.MINIMAP_CTX.lineTo(minimapX, MAIN.MINIMAP_C.height);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.fillStyle = "blue"; //draw hero dot
    MAIN.MINIMAP_CTX.fillRect(
      minimapX - offset,
      minimapY - offset,
      offset * 2,
      offset * 2
    );
    this.setMinimapCoordinates();
    this.drawShips();
    this.drawPortals();
  }
  leadHero(ev) {
    let coords = EVENT_MANAGER.getCursorPosition(MAIN.MINIMAP_C, ev);
    coords.x = Math.round((coords.x / MAIN.MINIMAP_C.width) * mapWidth);
    coords.y = Math.round((coords.y / MAIN.MINIMAP_C.height) * mapHeight);
    console.log(coords);
    HERO.setDestinationMinimap(coords);
  }
  drawShips() {
    MAP_SHIPS.forEach((ship) => {
      let minimapX = MAIN.MINIMAP_C.width * (ship.x / mapWidth);
      let minimapY = MAIN.MINIMAP_C.height * (ship.y / mapHeight);
      MAIN.MINIMAP_CTX.fillStyle = "red";
      MAIN.MINIMAP_CTX.fillRect(
        minimapX - offset,
        minimapY - offset,
        offset,
        offset
      );
    });
  }
  drawPortals() {
    const offset = 4.5;
    const iconSprite = new Image();
    iconSprite.src = `./spacemap/minimap/portal.png`;
    MAP_PORTALS.forEach((portal) => {
      let minimapX = MAIN.MINIMAP_C.width * (portal.x / mapWidth);
      let minimapY = MAIN.MINIMAP_C.height * (portal.y / mapHeight);
      MAIN.MINIMAP_CTX.drawImage(iconSprite, minimapX, minimapY);
    });
  }
}
