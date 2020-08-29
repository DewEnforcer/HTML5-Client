class CombatLayer {
  constructor() {}
  static handleFireRequest(data) {
    let projectileType = data[2];
    switch (projectileType) {
      case LASER:
        this.generateLasers(data);
        break;

      default:
        break;
    }
  }
  static generateRocket() {}
  static generateLasers(data) {
    data = trimData(data, 3);
    let ship, target;
    ship = getShip(data[0]);
    target = getShip(data[1]);
    ship.isAttacking = true;
    const laserBlast = new Sound(
      `./spacemap/audio/lasers/laser${ship.laserID}.mp3`
    );
    let isRapidSalvo = false;
    let laserID = ship.laserID;
    let salvos = 1;
    if (laserID == 2) isRapidSalvo = true;
    if (isRapidSalvo) salvos = LASER_DISTRIBUTION[ship.shipID].length;
    let i = 0;
    setInterval(() => {
      if (i >= salvos) return;
      const LaserToFire = LASER_DISTRIBUTION[ship.shipID][ship.salvoPhase - 1];
      LaserToFire.forEach((posKey) => {
        let offset = LASER_POS[ship.shipID][posKey][ship.sequenceNum];
        LASER_LAYER.push(
          new Laser(
            ship.x, //start point
            ship.y,
            offset,
            target.x,
            target.y,
            ship.laserID
          )
        );
      });
      ship.salvoPhase++;
      if (ship.salvoPhase > LASER_DISTRIBUTION[ship.shipID].length)
        ship.salvoPhase = 1;
      i++;
    }, 60);
    laserBlast.play();
  }
  static generateHit(data) {
    data.splice(0, 2);
    let targetHit = data[0];
    let value = numberFormated(data[1], ",");
    let isHeal = data[2];
    const ship = getShipById(targetHit);
    isHeal = !!Number(isHeal);
    HIT_LAYER.push(
      new Hit(
        ship.render.renderX + ship.offset.x,
        ship.render.renderY + ship.offset.y,
        value,
        isHeal
      )
    );
  }
}
