class CombatLayer {
  constructor() {}
  static handleFireRequest(data) {
    let projectileType = data[2];
    switch (projectileType) {
      case LASER:
        this.generateLasers(data);
        break;
      case ROCKET:
        this.generateRocket(data);
        break;
      default:
        break;
    }
  }
  static generateRocket(data) {
    const smokeStrings = ["Standard", "Advanced", "Hitech"];
    data = trimData(data, 3);
    let startPoint, target, rocketID;
    startPoint = getShipById(data[0]);
    target = getShipById(data[1]);
    rocketID = data[2];
    const rocketFire = new Sound(`./spacemap/audio/rockets/rocket.mp3`);
    ROCKET_LAYER.push(
      new Missile(
        startPoint.x,
        startPoint.y,
        target,
        rocketID,
        smokeStrings[data[3]]
      )
    );
    rocketFire.play();
  }
  static generateLasers(data) {
    data = trimData(data, 3);
    let ship, target, laserID;
    ship = getShipById(data[0]);
    target = getShipById(data[1]);
    ship.setTarget(target.ID);
    ship.deactivateLasers = Date.now() + 5000;
    ship.startAttack();
    laserID = data[2];
    ship.isAttacking = true;
    const laserBlast = new Sound(`./spacemap/audio/lasers/laser${laserID}.mp3`);
    let isRapidSalvo = false;
    let salvos = 1;
    if (laserID == 2) isRapidSalvo = true;
    if (isRapidSalvo)
      salvos = LASER_DATA.LASER_SALVO_POINTS[ship.laserClass].length;
    let i = 0;
    setInterval(() => {
      if (i >= salvos) return;
      const LaserToFire =
        LASER_DATA.LASER_SALVO_POINTS[ship.laserClass][ship.salvoPhase - 1];
      LaserToFire.forEach((posKey) => {
        let offset = LASER_POS[ship.laserClass][posKey][ship.sequenceNum];
        LASER_LAYER.push(
          new Laser(
            ship.x, //start point
            ship.y,
            offset,
            target.x,
            target.y,
            target.offset.x,
            target.offset.y,
            laserID
          )
        );
      });
      ship.salvoPhase++;
      if (
        ship.salvoPhase > LASER_DATA.LASER_SALVO_POINTS[ship.laserClass].length
      )
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
