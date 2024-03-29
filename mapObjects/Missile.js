class Missile extends MapObject{
  constructor(x, y, target, missileType, missileSmoke, isSeeker = false) {
    super(x,y);

    this.ID = getLaserID();
    this.offset = OFFSET_DATA.MISSILE_OFFSETS[missileType];

    this.isSeeker = isSeeker;
    this.destX = 0;
    this.destY = 0;
    this.target = target;
    this.flyTime = 0;
    this.baseSpeed = MISSILE_SPEED;
    this.speed = { x: 0, y: 0 };
    this.angle = 0;
    this.targetAngle = 0;
    this.anglePerFrame = 0;
    
    this.smoke = [];
    this.maxSmokes = 15;
    this.smokeOnFrame = 2;
    this.frame = 0;
    this.missileSmoke = missileSmoke;
    this.timeTo = 0;
    this.travelToOffset = false;
    this.setTargetCoords();
    this.initializeSprite(missileType);
  }
  initializeSprite(type) {
    this.sprite.src = `./spacemap/rockets/rocket${type}.png`;
  }
  setTargetCoords(force = false) {
    const ranOffset = 300;
    if (this.isSeeker && !force) {
      this.destX = this.target.x + getRandomNumber(-ranOffset, ranOffset);
      this.destY = this.target.y + getRandomNumber(-ranOffset, ranOffset);
      this.travelToOffset = true;
    } else {
      this.destX = this.target.x;
      this.destY = this.target.y;
    }
    this.setSpeed();
  }
  setSpeed() {
    this.flyTime = 0;
    let distanceX = this.destX - this.x;
    let distanceY = this.destY - this.y;
    this.timeTo =
      (getDistance(this.x, this.y, this.destX, this.destY) / this.baseSpeed) *
      1000;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
  }
  smoothRotate() {
    if (!this.isSeeker) return;
    this.angle += this.anglePerFrame;
    if (this.angle > this.targetAngle) {
      this.angle = this.targetAngle;
    }
  }
  rotate() {
    this.angle = calcAngle(this.x, this.y, this.destX, this.destY);
  }
  changePos() {
    this.x += this.speed.x * GAME_MAP.getDeltaTime();
    this.y += this.speed.y * GAME_MAP.getDeltaTime();
  }
  changeRenderPos() {
    this.renderX = this.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY + halfScreenHeight;
  }
  followTarget() {
    //now calc speed increasing over time
    let overFlyTime = this.flyTime - MAX_MISSILE_FLY_TIME;
    if (overFlyTime < 0) overFlyTime = 0;
    this.speed.x += overFlyTime;
    this.speed.y += overFlyTime;
    this.timeTo -= GAME_MAP.getDeltaTime();
    if (Math.round(this.timeTo) <= 0) this.terminate();
  }
  onDetonation() {
    if (!this.target) return;
    new Explosion(this.target.x, this.target.y, 0, "rocketExplosion", "rockets", 89, true);
  }
  terminate() {
    for (let i = 0; i < ROCKET_LAYER.length; i++) {
      if (ROCKET_LAYER[i].ID == this.ID) return ROCKET_LAYER.splice(i, 1);
    }
    this.onDetonation();
  }
  drawSmokeTrail() {
    this.frame++;
    if (this.frame % this.smokeOnFrame == 0) {
      this.smoke.push(
        new Smoke(this.x, this.y, "rocketSmoke" + this.missileSmoke, this, 1)
      );
      this.frame = 0;
    }
  }
  updateSmokeTrail() {
    for (let i = 0; i < this.smoke.length; i++) {
      this.smoke[i].update();
    }
  }
  draw() {
    GAME_MAP.ctx.translate(this.renderX, this.renderY);
    GAME_MAP.ctx.rotate(-this.angle);
    GAME_MAP.ctx.drawImage(this.sprite, -this.spriteOffset.x, -this.spriteOffset.y);
    GAME_MAP.ctx.rotate(this.angle);
    GAME_MAP.ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.flyTime += GAME_MAP.getDeltaTime();
    this.followTarget();
    this.rotate();
    //this.smoothRotate();
    this.changePos();
    this.calculateRenderPos();
    this.draw();
    this.drawSmokeTrail();
    this.updateSmokeTrail();
  }
}
