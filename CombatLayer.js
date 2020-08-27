class CombatLayer {
  constructor() {}
  static handleFireRequest(data) {
    let projectileType = data[2];
    switch (projectileType) {
      case LASER:
        this.generateLasers(getShipById(data[3]));
        break;

      default:
        break;
    }
  }
  static generateRocket() {}
  static generateLasers(target, isHero = true, id = 0) {
    let ship = HERO;
    if (!isHero) ship = getShipById(id);
    const laserBlast = new Sound(
      `./spacemap/audio/lasers/laser${ship.laserID}.mp3`
    );
    const LaserToFire = LASER_DISTRIBUTION[ship.shipID][ship.salvoPhase - 1];
    LaserToFire.forEach((posKey) => {
      LASER_LAYER.push(
        new Laser(
          ship.x, //start point
          ship.y,
          LASER_POS[ship.shipID][posKey][ship.sequenceNum],
          ship.offset,
          target.x,
          target.y,
          ship.laserID
        )
      );
    });
    ship.salvoPhase++;
    if (ship.salvoPhase > LASER_DISTRIBUTION[ship.shipID].length)
      ship.salvoPhase = 1;
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
