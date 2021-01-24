class MapManager {
    constructor() {
        this.mapId = 1;
        this.mapName = "Unknown";

        //layers
        this.BG_LAYER = null;
        this.MAP_PLANETS = [];
        this.MAP_PORTALS = [];
        this.MAP_STATIONS = [];
        this.MAP_SHIPS = [];
        this.LASER_LAYER = [];
        this.ROCKET_LAYER = [];
        this.COMBAT_LAYER = [];
        this.HIT_LAYER = [];
        this.DRONES_LAYER = [];
        this.EXPLOSION_LAYER = [];
        this.MESSAGE_LAYER = [];
        this.LENSFLARE_LAYER = [];
        this.NEBULA_LAYER = [];

        this.MISC_LAYER = [];
    }

    updateMap(mapId) {
        if (this.mapId == mapId) return;

        this.mapId = mapId;
        const mapObjectList = MAP_OBJECTS_LIST[this.mapId];
        this.mapName = mapObjectList.name;


        GAME_MAP.setMapProperties(mapObjectList.scale);
        UI_MAIN.UI.spacemap.updateMap(this.mapName);
        if (this.BG_LAYER) this.BG_LAYER.setNewMap(this.mapId);

        this.cleanupObjects();
        this.setObjects(mapObjectList);
    }

    setObjects(mapObjectList) {
        if (!this.BG_LAYER) this.BG_LAYER = new Background(this.mapId);

        mapObjectList.planets.forEach(planet => this.MAP_PLANETS.push(new Planet(planet)));
        mapObjectList.portals.forEach(portal => this.MAP_PORTALS.push(new Portal(portal)));
        mapObjectList.stations.forEach(station => this.MAP_STATIONS.push(new Station(station)));
        mapObjectList.lensflares.forEach(lens => this.LENSFLARE_LAYER.push(new LensFlare(lens)));
        mapObjectList.nebulas.forEach(neb => this.NEBULA_LAYER.push(new Nebula(neb)));
    }
    cleanupObjects () {
        this.LENSFLARE_LAYER.splice(0, this.LENSFLARE_LAYER.length);
        this.NEBULA_LAYER.splice(0, this.NEBULA_LAYER.length);
        this.MAP_PLANETS.splice(0, this.MAP_PLANETS.length);
        this.MAP_PORTALS.splice(0, this.MAP_PORTALS.length);
        this.MAP_STATIONS.splice(0, this.MAP_STATIONS.length);
        this.MAP_SHIPS.splice(0, this.MAP_SHIPS.length - 1); //-1 to leave hero ship, new comment: WTH REWORK THIS
        this.DRONES_LAYER.splice(0, this.DRONES_LAYER.length);
        this.LASER_LAYER.splice(0, this.LASER_LAYER.length);
        this.ROCKET_LAYER.splice(0, this.ROCKET_LAYER.length);
        this.EXPLOSION_LAYER.splice(0, this.EXPLOSION_LAYER.length);
    };
}