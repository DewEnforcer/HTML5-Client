class Ship {
  constructor(
    ID,
    x,
    y,
    speed,
    shipID,
    username,
    rank,
    laserID,
    hp,
    shd,
    maxHP,
    maxSHD
  ) {
    this.ship = ships[shipID];
    this.name = username;
    this.x = x;
    this.y = y;
    this.destX = x;
    this.destY = y;
    this.ID = ID;
    this.rank = rank;
    this.baseSpeed = speed;
    this.hoverVal = 0;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.timeTo = 0;
    this.isFly = false;
    this.isHover = true;
    this.offset = getOffset(shipID);
    this.sprite = new Image();
    this.sequence = this.setSequence(0);
    this.isAttacking = false;
    this.targetID = 0;
    this.laserID = laserID;
    this.HP = hp;
    this.SHD = shd;
    this.maxHP = maxHP;
    this.maxSHD = maxSHD;
    this.loggingOut = false;
    this.isJumping = false;
    this.renderX = null;
    this.renderY = null;
    this.changeRenderPos(); //initial display
  }
  setTarget(target) {
    this.targetID = target;
  }
  setDestination(x, y, time) {
    this.destX = x;
    this.destY = y;
    this.timeTo = time;
    let distanceX = this.destX - this.x;
    let distanceY = this.destY - this.y;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
  }
  startAttack() {
    this.isAttacking = true;
  }
  stopAttack() {
    this.isAttacking = false;
  }
  isFlying() {
    return this.isFly;
  }
  rotate() {
    const rotateTo = {
      x: this.destX,
      y: this.destY,
    };
    if (isAttacking) {
      let enemyCoords = getShipCoords(this.targetID);
      rotateTo.x = enemyCoords.x;
      rotateTo.y = enemyCoords.y;
    }
    let angle = calcAngle(this.x, this.y, rotateTo.x, rotateTo.y);
    this.setSequence(angle);
  }
  setSequence(angle) {
    return `./spacemap/ships/${this.ship}/${Math.round(angle / 8)}.png`;
  }
  hover() {
    this.isHover = true;
    const hoverSpeed = 0.05;
    this.speed.x = 0;
    this.speed.y = 0;
    this.hoverVal += hoverSpeed;
    this.renderY += Math.cos(this.hoverVal) / 10;
  }
  resetHover() {
    this.isHover = false;
  }
  changePos() {
    this.x += this.speed.x * DELTA_TIME;
    this.y += this.speed.y * DELTA_TIME;
    this.timeTo -= DELTA_TIME;
    if (Math.round(this.timeTo) <= 0) this.stopFlying();
  }
  changeRenderPos() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight;
  }
  draw() {
    drawName(this.name, this.renderX, this.renderY);
    drawRank(this.rank, this.renderX, this.renderY);
    displayShipStructure(
      this.HP,
      this.SHD,
      this.maxHP,
      this.maxSHD,
      this.renderX,
      this.renderY
    );
    this.sprite.src = this.sequence;
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  update() {
    if (this.isFly) {
      if (this.isHover) {
        //ship state has changed from hover to flying one
        this.resetHover();
      }
      this.rotate();
      this.changePos();
    } else {
      this.hover();
    }
    if (HERO.isFly) this.changeRenderPos(); //only when hero is flying, else enable hover animation
    this.draw();
  }
}
