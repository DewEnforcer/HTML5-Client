class Hero {
  constructor(
    x,
    y,
    speed,
    shipID,
    username,
    laserID,
    hp,
    shd,
    maxHP,
    maxSHD,
    mapID
  ) {
    this.ship = ships[shipID];
    this.name = username;
    this.x = Number(x);
    this.y = Number(y);
    this.destX = this.x;
    this.destY = this.y;
    this.mapID = mapID;
    this.baseSpeed = Number(speed);
    this.hoverVal = 0;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.isFly = false;
    this.isHover = true;
    this.offset = getOffset(shipID);
    this.sprite = new Image();
    this.travelAngle = 0;
    this.sequence = this.setSequence(0);
    this.isAttacking = false;
    this.targetID = 0;
    this.laserID = laserID;
    this.HP = Number(hp);
    this.SHD = Number(shd);
    this.maxHP = Number(maxHP);
    this.maxSHD = Number(maxSHD);
    this.loggingOut = false;
    this.isJumping = false;
    this.render = {
      baseX: halfScreenWidth - this.offset.x,
      baseY: halfScreenHeight - this.offset.y,
      renderX: halfScreenWidth - this.offset.x,
      renderY: halfScreenHeight - this.offset.y,
    };
  }
  changeMap(newMap) {
    if (this.mapID === newMap) return;
    this.mapID = newMap;
  }
  setLogout() {
    this.loggingOut = !this.loggingOut;
  }
  setTarget(target) {
    this.targetID = target;
  }
  resetTarget() {
    this.targetID = 0;
    this.stopAttack();
  }
  setDestination() {
    if (!this.isFly) return;
    let dest = convertToMapCoords(EVENT_MANAGER.mouse);
    this.destX = dest.x;
    this.destY = dest.y;
  }
  startAttack() {
    if (this.targetID == null) {
      return;
    }
    this.isAttacking = true;
    writeToLog("attack", true);
  }
  stopAttack() {
    this.targetID = null;
    this.isAttacking = false;
    writeToLog("end_attack", true);
  }
  isFlying() {
    return this.isFly;
  }
  rotate() {
    const rotateTo = {
      x: this.destX,
      y: this.destY,
    };
    if (this.isAttacking) {
      let enemyCoords = getShipCoords(this.targetID);
      rotateTo.x = enemyCoords.x;
      rotateTo.y = enemyCoords.y;
    }
    this.travelAngle = calcAngle(this.x, this.y, rotateTo.x, rotateTo.y);
    this.sequence = this.setSequence();
  }
  setSequence() {
    return `./spacemap/ships/${this.ship}/${Math.round(
      toDegs(this.travelAngle) / 8
    )}.png`;
  }
  hover() {
    this.isHover = true;
    const hoverSpeed = 0.05;
    this.speed.x = 0;
    this.speed.y = 0;
    this.hoverVal += hoverSpeed;
    this.render.renderY += Math.cos(this.hoverVal) / 10;
  }
  resetHover() {
    this.render.renderY = this.render.baseY;
    this.isHover = false;
  }
  changePos() {
    this.speed = speedVelocity(this.baseSpeed, this.travelAngle);
    this.x += this.speed.x / DELTA_TIME;
    this.y += this.speed.y / DELTA_TIME;
  }
  draw() {
    drawName(this.name, this.render.baseX, this.render.baseY);
    displayShipStructure(
      this.HP,
      this.SHD,
      this.maxHP,
      this.maxSHD,
      this.render.baseX,
      this.render.baseY
    );
    this.sprite.src = this.sequence;
    ctx.drawImage(this.sprite, this.render.renderX, this.render.renderY);
  }
  update() {
    if (this.isFly) {
      if (this.isHover) {
        //ship state has changed from hover to flying one
        this.resetHover();
      } else {
        this.setDestination();
        this.rotate();
        this.changePos();
      }
    } else {
      this.hover();
    }
    this.draw();
  }
}
