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
    if (!ship) return;

    ship.setShipData(data);
    if (ship.isHero) UI_MAIN.UI.shipinfo.updateAllShipData();
  }
  static cloakShip(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    if (ship == null) return;
    ship.isCloaked = !!Number(data[1]);
  }
  static switchFormation(data) {
    const [shipID, formationID] = trimData(data);
    const ship = getShipById(shipID);
    if (!ship) return;
    ship.setFormationSprite(formationID);
  }
  static removeShip(data) {
    data = trimData(data);
    let index = -1;
    MAP_SHIPS.forEach((ship, i) => {
      if (ship.ID == data[1]) {
        //destroy?
        if (data[0] == 1) {
          new Explosion(ship.x, ship.y, 0, "explosion", "pyro", 300, false, 79, 3);
        }
        index = i;
      } else if (ship.targetID == data[1]) {
        ship.stopAttack();
        ship.setTarget(0);
      }
    });
    if (index >= 0) MAP_SHIPS.splice(index, 1);
  }
  static moveShip(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    if (ship == null) return;
    ship.setDestination(Number(data[1]), Number(data[2]), Number(data[3]));
  }
  static setAttackState(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    if (ship == null) return;
    const attackStatus = !!Number(data[1]);
    if (attackStatus) ship.startAttack();
    else ship.stopAttack();
  }
  static tpShip(data) {
    data = trimData(data);
    const ship = getShipById(data[0]);
    if (ship == null) return;
    ship.teleport(Number(data[1]), Number(data[2]));
    if (ship.isHero) {
      UI_MAIN.UI.spacemap.navigateByMinimap = false;
    }
  }
}
