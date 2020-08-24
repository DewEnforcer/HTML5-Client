class ShipManager {
  static createShip(data) {
    data.splice(0, 2);
    MAP_SHIPS.push(new Ship(...data));
  }
  static shipData(data) {
    data.splice(0, 2);
    const ship = getShipById(data[0]);
    ship.HP = Number(data[1]);
    ship.SHD = Number(data[2]);
    ship.maxHP = Number(data[3]);
    ship.maxSHD = Number(data[4]);
  }
}
