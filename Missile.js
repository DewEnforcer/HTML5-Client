class Missile {
  constructor(x, y, target, missileType, missileSmoke, isSeeker = false) {
    this.ID = getLaserID();
    this.isSeeker = isSeeker;
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.destX = 0;
    this.destY = 0;
    this.target = target;
    this.flyTime = 0;
    this.baseSpeed = MISSILE_SPEED;
    this.speed = { x: 0, y: 0 };
    this.angle = 0;
    this.targetAngle = 0;
    this.anglePerFrame = 0;
    this.sprite = new Image();
    this.sprite.src = `./spacemap/rockets/rocket${missileType}.png`;
    this.smoke = [];
    this.maxSmokes = 15;
    this.smokeOnFrame = 2;
    this.frame = 0;
    this.missileSmoke = missileSmoke;
    this.spriteOffset = OFFSET_DATA.MISSILE_OFFSETS[missileType];
    this.timeTo = 0;
    this.travelToOffset = false;
    this.setTargetCoords();
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
    this.x += this.speed.x * DELTA_TIME;
    this.y += this.speed.y * DELTA_TIME;
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
    this.timeTo -= DELTA_TIME;
    if (Math.round(this.timeTo) <= 0) this.terminate();
  }
  onDetonation() {
    EXPLOSION_LAYER.push(
      new Explosion(this.target.render.renderX, this.target.render.renderY, 0)
    );
  }
  terminate() {
    ROCKET_LAYER.some((rocket, i) => {
      if (rocket.ID == this.ID) {
        ROCKET_LAYER.splice(i, 1);
        return true;
      }
    });
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
  draw() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(this.sprite, -this.spriteOffset.x, -this.spriteOffset.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.flyTime += DELTA_TIME;
    this.followTarget();
    this.rotate();
    //this.smoothRotate();
    this.changePos();
    this.changeRenderPos();
    this.draw();
    this.drawSmokeTrail();
    this.smoke.forEach((s) => s.update());
  }
}
