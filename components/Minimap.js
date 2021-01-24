class Minimap {
    constructor(data) {
        this.window = new Window(data);
        this.canvas = null;
        this.canvasWidth = null;
        this.canvasHeight = null;

        this.ctx = null;
        this.coordinateTextNodes = null;
        this.navigateByMinimap = false;

        this.defaultSprites = {
          portal: this.createIcon(`./spacemap/minimap/portal.png`)
        }

        this.dotCoords = {
            x: null,
            y: null,
        };

        this.lastX = null;
        this.lastY = null;

        this.COORDINATE_SCALE_RATE = 100;

        this.DOT_COLOR = "#2C87BF";
        this.FILL_STYLE = "black";
        this.STROKE_STYLE = "grey";
        this.LINE_WIDTH = 2;

        this.SETTING_MENU = MENU_INTERFACE;
        this.SETTING_INDEX = 3;

        this.PLANET_ICONS = {}

        this.init();
      }
      
      init() {
        this.createContent();
    }

    createIcon(src) {
      const image = new Image();
      image.src = src;

      return image;
    }

    createMinimapCanvas() {
        if (this.canvas) return;
        this.canvas = document.createElement("canvas");
        this.canvas.id = "minimap";
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height; 
        this.canvas.addEventListener("mousedown", this.leadHero);

        this.ctx = this.canvas.getContext("2d");

        return this.canvas;
    }
    resizeCanvas() { //remove magic numbers
      const scaleX = 21;
      const scaleY = 13;
      const offset = 0.2;
      let width = this.window.node.getBoundingClientRect()
        .width;
      let height = (width / scaleX) * scaleY;
  
      let offsetX = width * offset;
      let offsetY = height * offset;

      const trueWidth = width - offsetX;
      const trueHeight = height - offsetY;

      this.canvas.width = trueWidth;
      this.canvas.height = trueHeight
      this.canvasWidth = trueWidth;
      this.canvasHeight = trueHeight
    }
    createMinimapCoordinateBox() {
        const box = ElUtils.createBox("spacemap_coordinates_wrapper");
        
        const mapTextNode = document.createElement("span");
        mapTextNode.innerText = "???";

        const coordTextNode = document.createElement("span");
        coordTextNode.innerText = "?/?";

        this.coordinateTextNodes = {
            map: mapTextNode,
            coords: coordTextNode
        }

        box.appendChild(mapTextNode);
        box.appendChild(coordTextNode);

        return box;
    }
    createContent() {
        const {node} = this.window.body;

        node.appendChild(this.createMinimapCoordinateBox());
        node.appendChild(this.createMinimapCanvas());
        this.resizeCanvas();
    }
    updateMap(mapName) {
      this.coordinateTextNodes.map.innerText = mapName;
      this.setMapIcons();
    }
    setMapIcons() {
      this.PLANET_ICONS = {};
      MAP_MANAGER.MAP_PLANETS.forEach(p => (this.PLANET_ICONS[p.planetID] = this.createIcon(p.sprite.src)));
    }
    updateCoordinates(x,y) {
        x = Math.round(x / this.COORDINATE_SCALE_RATE);
        y = Math.round(y / this.COORDINATE_SCALE_RATE);
        if (this.lastX === x && this.lastY === y) return;

        this.coordinateTextNodes.coords.innerText = `${x}/${y}`;

        this.lastX = x;
        this.lastY = y;
    }
    getHeroMinimapPositon() {
        let x = 0, y = 0;
        if (!HERO.ship) return [x,y,0,0];

        x = this.canvasWidth * (HERO.ship.x / realMapWidth);
        y = this.canvasHeight * (HERO.ship.y / realMapHeight);
        
        return [x,y, HERO.ship.x, HERO.ship.y];
    }

    leadHero = (ev) => {
        let coords = EVENT_MANAGER.getCursorPosition(this.canvas, ev);
        this.dotCoords = { ...coords };
        coords.x = Math.round((coords.x / this.canvasWidth) * realMapWidth);
        coords.y = Math.round((coords.y / this.canvasHeight) * realMapHeight);
        HERO.processDestMinimap(coords);
        this.navigateByMinimap = true;
    }

    renderFrame() {
        const [x,y, heroX, heroY] = this.getHeroMinimapPositon();

        this.clearFrame();

        this.drawBackgroundImage();
        this.drawPlanets();
        this.drawStations();
        this.drawPortals();
        this.drawShips();
        this.drawPositionCross(x,y);
        this.updateCoordinates(heroX, heroY);   
        this.drawTargetElements(x,y);
    }
    clearFrame() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    //draw elements
    drawBackgroundImage() {
        if (!SETTINGS.settingsArr[this.SETTING_MENU][this.SETTING_INDEX]) return;

        this.ctx.drawImage(MAP_MANAGER.BG_LAYER.sprite, 0, 0, this.canvasWidth, this.canvasHeight);
    }
    drawPositionCross(x,y) {
        this.ctx.strokeStyle = this.STROKE_STYLE;

        Canvas.drawLine(this.ctx, 0, x, y, y); //left to mid
        Canvas.drawLine(this.ctx, x, this.canvasWidth, y, y); //mid to right
        Canvas.drawLine(this.ctx, x, x, 0, y); //top to mid
        Canvas.drawLine(this.ctx, x, x, y, this.canvasHeight); //mid to bottom
    }
    drawTargetElements(x,y) {
        if (!this.navigateByMinimap) return;

        this.drawTargetLine(x,y);
        this.drawTargetCross();
    }
    drawTargetLine(x,y) {
        this.ctx.strokeStyle = this.DOT_COLOR;
        Canvas.drawLine(this.ctx, x, this.dotCoords.x, y, this.dotCoords.y);
    }
    drawTargetCross() {
        const crossLength = 5;
        this.ctx.strokeStyle = this.DOT_COLOR;
        const {x, y} = this.dotCoords;

        Canvas.drawLine(this.ctx, x, x - crossLength, y, y);
        Canvas.drawLine(this.ctx, x, x + crossLength, y, y);
        Canvas.drawLine(this.ctx, x, x, y, y - crossLength);
        Canvas.drawLine(this.ctx, x, x, y, y + crossLength);
    }
    drawShips() {
        const offset = 1;

        MAP_MANAGER.MAP_SHIPS.forEach((ship) => {
          if (ship.isHero) return; //dont draw hero
          let minimapX = this.canvasWidth * (ship.x / realMapWidth);
          let minimapY = this.canvasHeight * (ship.y / realMapHeight);
          let color = COLORS.COLOR_ENEMY;
          if (ship.faction == HERO.ship.faction) color = COLORS.COLOR_ALLY;
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            minimapX - offset,
            minimapY - offset,
            offset * 2,
            offset * 2
          );
        });
      }
      drawPortals() {
        const offset = 5.5;
        MAP_MANAGER.MAP_PORTALS.forEach((portal) => {
          let minimapX = this.canvasWidth * (portal.x / realMapWidth);
          let minimapY = this.canvasHeight * (portal.y / realMapHeight);
          this.ctx.drawImage(
            this.defaultSprites.portal,
            minimapX - offset,
            minimapY - offset
          );
        });
      }
      drawPlanets() {
        if (!SETTINGS.settingsArr[MENU_GRAPHICS][1]) return;
        const minimapScaleX = this.canvasWidth / realMapWidth;
        const minimapScaleY = this.canvasHeight / realMapHeight;
        MAP_MANAGER.MAP_PLANETS.forEach(p => {
          let minScaleX = minimapScaleX * p.minimapScale;
          let minScaleY = minimapScaleY * p.minimapScale;
          let minimapX = this.canvasWidth * (p.x / realMapWidth) * p.z;
          let minimapY = this.canvasHeight * (p.y / realMapHeight) * p.z;

          this.ctx.drawImage(
            p.minimapSprite,
            minimapX - p.offset.x * minScaleX,
            minimapY - p.offset.y * minScaleY,
            p.offset.x * 2 * minScaleX,
            p.offset.y * 2 * minScaleY
          );
        });
      }
      drawStations() {
        const minimapScaleX = this.canvasWidth / realMapWidth;
        const minimapScaleY = this.canvasHeight / realMapHeight;
        MAP_MANAGER.MAP_STATIONS.forEach((sta) => {
          let minimapX = this.canvasWidth * (sta.x / realMapWidth) * sta.z;
          let minimapY = this.canvasHeight * (sta.y / realMapHeight) * sta.z;
          this.ctx.drawImage(
            sta.sprite,
            minimapX - sta.offset.x * minimapScaleX,
            minimapY - sta.offset.y * minimapScaleY,
            sta.offset.x * 2 * minimapScaleX,
            sta.offset.y * 2 * minimapScaleY
          );
        });
      }
}