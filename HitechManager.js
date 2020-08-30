class HitechManager {
  static manageHitechData(data) {
    data = trimData(data);
    console.log(data);
    switch (data[0]) {
      case TECH_LEECH:
        this.handleLeechTech(data[1]);
        break;
    }
  }
  static handleLeechTech(ID) {
    let ship = getShipById(ID);
    ship.leechOn = true;
  }
}
