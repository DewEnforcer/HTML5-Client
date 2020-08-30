class Missile {
  constructor(x, y, target, missileType, missileSmoke) {
    this.ID = getLaserID();
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.target = target;
    this.flyTime = 0;
    this.baseSpeed = MISSILE_SPEED;
    this.speed = { x: 0, y: 0 };
    this.angle = 0;
    this.sprite = new Image();
    this.sprite.src = `./spacemap/rockets/rocket${missileType}.png`;
    this.smoke = [];
    this.maxSmokes = 15;
    this.smokeOnFrame = 2;
    this.frame = 0;
    this.missileSmoke = missileSmoke;
    this.spriteOffset = MISSILE_OFFSETS[missileType];
    this.timeTo = 0;
    this.setSpeed();
  }
  setSpeed() {
    let distanceX = this.target.x - this.x;
    let distanceY = this.target.y - this.y;
    this.timeTo =
      (getDistance(this.x, this.y, this.target.x, this.target.y) /
        this.baseSpeed) *
      1000;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
  }
  rotate() {
    this.angle = calcAngle(this.x, this.y, this.target.x, this.target.y);
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
  terminate() {
    ROCKET_LAYER.some((rocket, i) => {
      if (rocket.ID == this.ID) {
        ROCKET_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  drawSmokeTrail() {
    this.frame++;
    if (this.frame % this.smokeOnFrame == 0) {
      this.smoke.push(
        new Smoke(this.x, this.y, "rocketSmoke" + this.missileSmoke, this)
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
    this.changePos();
    this.changeRenderPos();
    this.draw();
    this.drawSmokeTrail();
    this.smoke.forEach((s) => s.update());
  }
}
