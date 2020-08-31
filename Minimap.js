class Minimap {
  constructor() {
    this.sprite = new Image();
    this.sprite.src = null;
    this.minimapNavigating = false;
    this.dotCoords = {
      x: null,
      y: null,
    };
    this.dotColor = "#2C87BF";
    this.changeBackground();
  }
  changeBackground() {
    this.sprite.src = `${PATH_TO_BG}/background${HERO.mapID}.jpg`;
  }
  setMinimapCoordinates() {
    const scaleDown = 100;
    MAIN.MINIMAP_TEXT.innerHTML = `<span>${mapNames[HERO.mapID]} ${Math.round(
      HERO.ship.x / scaleDown
    )}/${Math.round(HERO.ship.y / scaleDown)}</span>`;
  }
  minimapManager() {
    const offset = 2.5;
    let minimapX = MAIN.MINIMAP_C.width * (HERO.ship.x / mapWidth);
    let minimapY = MAIN.MINIMAP_C.height * (HERO.ship.y / mapHeight);
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
    this.drawPlanets();
    this.drawStations();
    this.drawPortals();
    this.drawShips(offset);
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
    this.setMinimapCoordinates();
    if (this.minimapNavigating) this.drawDestLine(minimapX, minimapY);
  }
  leadHero(ev) {
    let coords = EVENT_MANAGER.getCursorPosition(MAIN.MINIMAP_C, ev);
    this.dotCoords = { ...coords };
    coords.x = Math.round((coords.x / MAIN.MINIMAP_C.width) * mapWidth);
    coords.y = Math.round((coords.y / MAIN.MINIMAP_C.height) * mapHeight);
    HERO.processDestMinimap(coords);
    this.minimapNavigating = true;
  }
  drawDestLine(minimapX, minimapY) {
    MAIN.MINIMAP_CTX.strokeStyle = this.dotColor;
    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, minimapY); //move to hero ship
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x, this.dotCoords.y); //draw to mid of the dest dot
    MAIN.MINIMAP_CTX.stroke();
    this.drawDestDot();
  }
  drawDestDot() {
    const MINIMAP_DOT_RAD = 7;
    MAIN.MINIMAP_CTX.arc(
      this.dotCoords.x,
      this.dotCoords.y,
      MINIMAP_DOT_RAD,
      0,
      2 * Math.PI,
      false
    );
    MAIN.MINIMAP_CTX.fillStyle = this.dotColor;
    MAIN.MINIMAP_CTX.fill();
  }
  drawShips(offset) {
    MAP_SHIPS.forEach((ship) => {
      let minimapX = MAIN.MINIMAP_C.width * (ship.x / mapWidth);
      let minimapY = MAIN.MINIMAP_C.height * (ship.y / mapHeight);
      let color = COLOR_ENEMY;
      if (ship.isHero) color = COLOR_HERO;
      else if (ship.faction == HERO.ship.faction) color = COLOR_ALLY;
      MAIN.MINIMAP_CTX.fillStyle = color;
      MAIN.MINIMAP_CTX.fillRect(
        minimapX - offset,
        minimapY - offset,
        offset * 2,
        offset * 2
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
      MAIN.MINIMAP_CTX.drawImage(
        iconSprite,
        minimapX - offset,
        minimapY - offset
      );
    });
  }
  drawPlanets() {
    const minimapScaleX = MAIN.MINIMAP_C.width / mapWidth;
    const minimapScaleY = MAIN.MINIMAP_C.height / mapHeight;
    MAP_PLANETS.forEach((p) => {
      let minScaleX = minimapScaleX * p.minimapScale;
      let minScaleY = minimapScaleY * p.minimapScale;
      let minimapX = MAIN.MINIMAP_C.width * (p.x / mapWidth) * p.z;
      let minimapY = MAIN.MINIMAP_C.height * (p.y / mapHeight) * p.z;
      const iconSprite = new Image();
      iconSprite.src = `${PATH_TO_PLANETS}/planet${p.planetID}.png`;
      MAIN.MINIMAP_CTX.drawImage(
        iconSprite,
        minimapX - p.offset.x * minScaleX,
        minimapY - p.offset.y * minScaleY,
        p.offset.x * 2 * minScaleX,
        p.offset.y * 2 * minScaleY
      );
    });
  }
  /* 
          let width = p.offset.x * sizeScale;
      let height = p.offset.y * sizeScale;
      const iconSprite = new Image();
      iconSprite.src = `${PATH_TO_PLANETS}/planet_${p.planetID}.png`;
      MAIN.MINIMAP_CTX.drawImage(
        iconSprite,
        minimapX - (p.offset.x + p.offset.x * 8) * minimapScaleX,
        minimapY - (p.offset.y + p.offset.y * 8) * minimapScaleY,
        width * minimapScaleX,
        height * minimapScaleY
      );
  */
  drawStations() {
    const minimapScaleX = MAIN.MINIMAP_C.width / mapWidth;
    const minimapScaleY = MAIN.MINIMAP_C.height / mapHeight;
    MAP_STATIONS.forEach((sta) => {
      let minimapX = MAIN.MINIMAP_C.width * (sta.x / mapWidth) * sta.z;
      let minimapY = MAIN.MINIMAP_C.height * (sta.y / mapHeight) * sta.z;
      MAIN.MINIMAP_CTX.drawImage(
        sta.sprite,
        minimapX - sta.offset.x * minimapScaleX,
        minimapY - sta.offset.y * minimapScaleY,
        sta.offset.x * 2 * minimapScaleX,
        sta.offset.y * 2 * minimapScaleY
      );
    });
  }
}
