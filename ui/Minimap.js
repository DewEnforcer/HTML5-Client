class Minimap {
  constructor() {
    this.sprite = new Image();
    this.sprite.src = null;
    this.portalIconSprite = new Image();
    this.portalIconSprite.src = `./spacemap/minimap/portal.png`;
    this.minimapNavigating = false;
    this.dotCoords = {
      x: null,
      y: null,
    };
    this.dotColor = "#2C87BF";
    this.settingMenu = MENU_INTERFACE;
    this.settingIndex = 3;
    this.changeBackground();
  }
  changeBackground() {
    this.sprite.src = `${PATH_TO_BG}/background${HERO.mapID}.jpg`;
  }
  setMinimapCoordinates() {
    const scaleDown = 100;
    MAIN.MINIMAP_TEXT.innerHTML = `<span>${mapName} ${Math.round(
      HERO.ship.x / scaleDown
    )}/${Math.round(HERO.ship.y / scaleDown)}</span>`;
  }
  minimapManager() {
    const offset = 1;
    let minimapX = MAIN.MINIMAP_C.width * (HERO.ship.x / realMapWidth);
    let minimapY = MAIN.MINIMAP_C.height * (HERO.ship.y / realMapHeight);
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
    MAIN.MINIMAP_CTX.lineWidth = 1;
    MAIN.MINIMAP_CTX.fillRect(
      2,
      2,
      MAIN.MINIMAP_C.width - 4,
      MAIN.MINIMAP_C.height - 4
    );
    if (SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) {
      MAIN.MINIMAP_CTX.drawImage(
        this.sprite,
        0,
        0,
        MAIN.MINIMAP_C.width,
        MAIN.MINIMAP_C.height
      );
    }
    this.drawPlanets();
    this.drawStations();
    this.drawPortals();
    this.drawShips(offset);
    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(0, minimapY); //draw left to middle
    MAIN.MINIMAP_CTX.lineTo(minimapX, minimapY);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, minimapY); //draw mid to right
    MAIN.MINIMAP_CTX.lineTo(MAIN.MINIMAP_C.width, minimapY);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, 0); //draw top to middle
    MAIN.MINIMAP_CTX.lineTo(minimapX, minimapY);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, minimapY); //draw mid to bottom
    MAIN.MINIMAP_CTX.lineTo(minimapX, MAIN.MINIMAP_C.height);
    MAIN.MINIMAP_CTX.stroke();
    this.setMinimapCoordinates();
    if (this.minimapNavigating) this.drawDestLine(minimapX, minimapY);
  }
  leadHero(ev) {
    let coords = EVENT_MANAGER.getCursorPosition(MAIN.MINIMAP_C, ev);
    this.dotCoords = { ...coords };
    coords.x = Math.round((coords.x / MAIN.MINIMAP_C.width) * realMapWidth);
    coords.y = Math.round((coords.y / MAIN.MINIMAP_C.height) * realMapHeight);
    HERO.processDestMinimap(coords);
    this.minimapNavigating = true;
  }
  drawDestLine(minimapX, minimapY) {
    MAIN.MINIMAP_CTX.strokeStyle = this.dotColor;
    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(minimapX, minimapY); //move to hero ship
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x, this.dotCoords.y); //draw to mid of the dest dot
    MAIN.MINIMAP_CTX.stroke();
    this.drawDestCross();
    //this.drawDestDot();
  }
  drawDestCross() {
    const crossLen = 5;
    MAIN.MINIMAP_CTX.strokeStyle = this.dotColor;
    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(this.dotCoords.x, this.dotCoords.y);
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x - crossLen, this.dotCoords.y);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(this.dotCoords.x, this.dotCoords.y);
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x + crossLen, this.dotCoords.y);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(this.dotCoords.x, this.dotCoords.y);
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x, this.dotCoords.y - crossLen);
    MAIN.MINIMAP_CTX.stroke();

    MAIN.MINIMAP_CTX.beginPath();
    MAIN.MINIMAP_CTX.moveTo(this.dotCoords.x, this.dotCoords.y);
    MAIN.MINIMAP_CTX.lineTo(this.dotCoords.x, this.dotCoords.y + crossLen);
    MAIN.MINIMAP_CTX.stroke();
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
      if (ship.isHero) return; //dont draw hero
      let minimapX = MAIN.MINIMAP_C.width * (ship.x / realMapWidth);
      let minimapY = MAIN.MINIMAP_C.height * (ship.y / realMapHeight);
      let color = COLORS.COLOR_ENEMY;
      if (ship.faction == HERO.ship.faction) color = COLORS.COLOR_ALLY;
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
    const offset = 5.5;
    MAP_PORTALS.forEach((portal) => {
      let minimapX = MAIN.MINIMAP_C.width * (portal.x / realMapWidth);
      let minimapY = MAIN.MINIMAP_C.height * (portal.y / realMapHeight);
      MAIN.MINIMAP_CTX.drawImage(
        this.portalIconSprite,
        minimapX - offset,
        minimapY - offset
      );
    });
  }
  drawPlanets() {
    if (!SETTINGS.settingsArr[MENU_GRAPHICS][1]) return;
    const minimapScaleX = MAIN.MINIMAP_C.width / realMapWidth;
    const minimapScaleY = MAIN.MINIMAP_C.height / realMapHeight;
    MAP_PLANETS.forEach((p) => {
      let minScaleX = minimapScaleX * p.minimapScale;
      let minScaleY = minimapScaleY * p.minimapScale;
      let minimapX = MAIN.MINIMAP_C.width * (p.x / realMapWidth) * p.z;
      let minimapY = MAIN.MINIMAP_C.height * (p.y / realMapHeight) * p.z;
      MAIN.MINIMAP_CTX.drawImage(
        p.sprite,
        minimapX - p.offset.x * minScaleX,
        minimapY - p.offset.y * minScaleY,
        p.offset.x * 2 * minScaleX,
        p.offset.y * 2 * minScaleY
      );
    });
  }
  drawStations() {
    const minimapScaleX = MAIN.MINIMAP_C.width / realMapWidth;
    const minimapScaleY = MAIN.MINIMAP_C.height / realMapHeight;
    MAP_STATIONS.forEach((sta) => {
      let minimapX = MAIN.MINIMAP_C.width * (sta.x / realMapWidth) * sta.z;
      let minimapY = MAIN.MINIMAP_C.height * (sta.y / realMapHeight) * sta.z;
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
