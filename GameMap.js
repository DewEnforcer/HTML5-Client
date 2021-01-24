class GameMap {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mapId = HERO.mapID;
        this.terminated = false;
        this.lightLevel = 1;

        this.LAST_UPDATE = null;
        this.DELTA_TIME = null;
        
        this.init();
    }
    init() {
        this.createCanvas();
        this.resizeCanvas();
    }
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "gamemap";
        this.canvas.classList.add("canvas");

        this.ctx = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        halfScreenWidth = Number(this.canvas.width) / 2;
        halfScreenHeight = Number(this.canvas.height) / 2;
        screenWidth = this.canvas.width;
        screenHeight = this.canvas.height;
    }
    updateLightLevel() {
        if (this.lightLevel > 1) this.lightLevel = 1;
        if (this.lightLevel < 0) this.lightLevel = 0;
        this.CANVAS.style.opacity = this.lightLevel;
    }
    setMapProperties(scale) {
        mapScale = scale ? scale : 1;
        realMapWidth = mapWidth * mapScale;
        realMapHeight = mapHeight * mapScale;
    }
    calculateDeltaTime(timestamp) {
        this.DELTA_TIME = timestamp - this.LAST_UPDATE;
        this.LAST_UPDATE = timestamp;
    }
    getDeltaTime() {
        return this.DELTA_TIME;
    }
    updateLayer(layer) {
        for (let i = 0, n = layer.length; i < n; i++) {
            if (!layer[i]) continue;
            layer[i].update();
        }
    }
    renderFrame = (timestamp) => {
        if (this.terminated) return;

        this.calculateDeltaTime(timestamp);

        requestAnimationFrame(this.renderFrame);
        this.cleanupFrame();

        MAP_MANAGER.BG_LAYER.update();
        this.updateLayer(MAP_MANAGER.LENSFLARE_LAYER);
        this.updateLayer(MAP_MANAGER.NEBULA_LAYER);
        this.updateLayer(MAP_MANAGER.MAP_PLANETS);
        this.updateLayer(MAP_MANAGER.MAP_STATIONS);
        this.updateLayer(MAP_MANAGER.MAP_PORTALS);
        this.updateLayer(MAP_MANAGER.MAP_SHIPS);
        this.updateLayer(MAP_MANAGER.COMBAT_LAYER);
        this.updateLayer(MAP_MANAGER.DRONES_LAYER);
        this.updateLayer(MAP_MANAGER.LASER_LAYER);
        this.updateLayer(MAP_MANAGER.ROCKET_LAYER);
        this.updateLayer(MAP_MANAGER.EXPLOSION_LAYER);
        this.updateLayer(MAP_MANAGER.MESSAGE_LAYER);
        this.updateLayer(MAP_MANAGER.HIT_LAYER);

        UI_MAIN.UI.spacemap.renderFrame();
    }
    cleanupFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}