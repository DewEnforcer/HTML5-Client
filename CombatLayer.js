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
    //change to starting point selection - for loop etc
    //simple laser generation for now
    LASER_LAYER.push(
      new Laser(
        ship.x,
        ship.y,
        target.x + target.offset.x,
        target.y + target.offset.y,
        ship.laserID
      )
    );
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
        ship.renderX + ship.offset.x,
        ship.renderY + ship.offset.y,
        value,
        isHeal
      )
    );
  }
}
