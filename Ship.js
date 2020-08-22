class Ship {
  constructor(
    ID,
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
    this.x = x;
    this.y = y;
    this.destX = x;
    this.destY = y;
    this.mapID = mapID;
    this.ID = ID;
    this.baseSpeed = speed;
    this.hoverVal = 0;
    this.speed = {
      x: 0,
      y: 0,
    };
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
  }
  setTarget(target) {
    this.targetID = target;
  }
  setDestination(x, y) {
    this.destX = x;
    this.destY = y;
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
    const hoverSpeed = 0.01;
    this.speed.x = 0;
    this.speed.y = 0;
    this.hoverVal += hoverSpeed;
    this.renderY += Math.cos(this.hoverVal);
  }
  resetHover() {
    this.isHover = false;
  }
  changePos() {
    this.x += this.speed.x;
    this.y += this.speed.y;
  }
  changeRenderPos() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight;
  }
  draw() {
    drawName(this.name, this.renderX, this.renderY);
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
