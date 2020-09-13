class ShipManager {
  static createShip(data, splice = true, isHero = false) {
    if (splice) data.splice(0, 2);
    const newShip = new Ship(...data);
    if (isHero) {
      //this allows to have the hero ship z-index the highest
      MAP_SHIPS.push(newShip);
      return newShip;
    }
    MAP_SHIPS.unshift(newShip);
  }
  static shipData(data) {
    data.splice(0, 2);
    const ship = getShipById(data[0]);
    ship.HP = Number(data[1]);
    ship.SHD = Number(data[2]);
    ship.maxHP = Number(data[3]);
    ship.maxSHD = Number(data[4]);
  }
  static moveShip(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    ship.setDestination(Number(data[1]), Number(data[2]), Number(data[3]));
  }
  static setAttackState(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    const attackStatus = !!Number(data[1]);
    if (attackStatus) ship.startAttack();
    else ship.stopAttack();
  }
  static tpShip(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    ship.teleport(Number(data[1]), Number(data[2]));
    if (ship.isHero) {
      MINIMAP.minimapNavigating = false;
    }
  }
}
