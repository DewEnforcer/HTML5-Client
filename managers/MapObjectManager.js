class MapObjectManager {
    static createCustomPortal(data) {
        data = trimData(data);
        const portalType = data[0];
        const x = data[1];
        const y = data[2];
        const id = data[3];
        MAP_PORTALS.push(new Portal(x, y, id, portalType));
    }
}