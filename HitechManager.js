class HitechManager {
  static manageHitechData(data) {
    data = trimData(data);
    switch (data[0]) {
      case TECH_LEECH:
        this.handleLeechTech(data[1]);
        break;
    }
  }
  static handleLeechTech(ID) {
    let ship = getShipById(ID);
    if (ship == null) return;
    ship.leechOn = true;
  }
}
