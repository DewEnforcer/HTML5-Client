class Laser {
  constructor(x, y, targetX, targetY, laserID) {
    this.ID = getLaserID();
    this.dest = {
      x: targetX,
      y: targetY,
    };
    this.x = x;
    this.y = y;
    this.angle = calcAngle(this.x, this.y, this.dest.x, this.dest.y);
    this.speed = {
      x: null,
      y: null,
    };
    this.timeTo = 0;
    this.setSpeed();
    this.end = false;
    this.sprite = new Image();
    this.sprite.src = `./spacemap/lasers/laser${laserID}.png`;
    this.renderX = 0;
    this.renderY = 0;
  }
  setSpeed() {
    let distanceX = this.destX - this.x;
    let distanceY = this.destY - this.y;
    this.timeTo =
      (getDistance(this.x, this.y, this.destX, this.destY) / this.baseSpeed) *
      1000;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
  }
  terminate() {
    this.end = true;
    LASER_LAYER.some((laser, i) => {
      if (laser.ID === this.ID) {
        LASER_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  changePos() {
    this.x += this.speed.x * DELTA_TIME;
    this.y += this.speed.y * DELTA_TIME;
    this.timeTo -= DELTA_TIME;
    if (Math.round(this.timeTo) <= 0) this.terminate();
  }
  changeRenderPos() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight;
  }
  draw() {
    ctx.translate(laserRenderX, laserRenderY);
    ctx.rotate((-laserAngle[this.laserSeq][i] * Math.PI) / 180);
    ctx.drawImage(laserImg, 0, 0);
    ctx.rotate((laserAngle[this.laserSeq][i] * Math.PI) / 180);
    ctx.translate(-laserRenderX, -laserRenderY);
  }
  update() {
    if (this.end) return;
    this.changeRenderPos();
    this.changePos();
    this.draw();
  }
}
