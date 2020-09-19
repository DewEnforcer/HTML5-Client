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
      case ACTIVATE_EMP:
        this.generateEmp(data);
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
    if (startPoint == null || target == null) return;
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
    let LaserToFire;
    let ship, target, laserID;
    ship = getShipById(data[0]);
    target = getShipById(data[1]);
    if (ship == null || target == null) return;
    ship.setTarget(target.ID);
    ship.deactivateLasers = Date.now() + 5000;
    ship.startAttack();
    laserID = data[2];
    ship.isAttacking = true;
    const laserBlast = new Sound(`./spacemap/audio/lasers/laser${laserID}.mp3`);
    let isRapidSalvo = false;
    let salvos = 1;
    if (laserID == 5) isRapidSalvo = true;
    if (isRapidSalvo)
      salvos = LASER_DATA.LASER_SALVO_POINTS[ship.laserClass].length;
    this.addLaser(salvos, ship, target, laserID);
    laserBlast.play();
  }
  static addLaser(salvos, ship, target, laserID) {
    let LaserToFire;
    if (laserID == 4) {
      LaserToFire = LASER_DATA.LASER_SALVO_POINTS[ship.laserClass][0]; //TODO ADD PROPER SAB CENTER
    } else {
      LaserToFire =
        LASER_DATA.LASER_SALVO_POINTS[ship.laserClass][ship.salvoPhase - 1];
    }
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
    if (ship.salvoPhase > LASER_DATA.LASER_SALVO_POINTS[ship.laserClass].length)
      ship.salvoPhase = 1;
    salvos--;
    if (salvos <= 0) return;
    setTimeout(() => {
      this.addLaser(salvos, ship, target, laserID);
    }, 100);
  }
  static generateHit(data) {
    data.splice(0, 2);
    let targetHit = data[0];
    const ship = getShipById(targetHit);
    if (ship == null) return;
    let value = numberFormated(data[1], ",");
    let isHeal = data[2];
    let isMiss = !!Number(data[3]);
    isHeal = !!Number(isHeal);
    HIT_LAYER.push(
      new Hit(
        ship.render.renderX + ship.offset.x,
        ship.render.renderY + ship.offset.y,
        value,
        isMiss,
        isHeal,
        ship.isHero
      )
    );
  }
  static generateEmp(data) {
    data = trimData(data);
    console.log(data);
    const ship = getShipById(data[1]);
    if (ship == null) return;
    COMBAT_LAYER.push(new Emp(ship));
  }
}
