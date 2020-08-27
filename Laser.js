class Laser {
  constructor(x, y, pointOffset, shipOffset, targetX, targetY, laserID) {
    this.ID = getLaserID();
    this.dest = {
      //random offset makes it look more "realistic"
      x: targetX,
      y: targetY,
    };
    this.x = x;
    this.y = y;
    this.speed = {
      x: null,
      y: null,
    };
    this.offsetX = 15.5;
    this.offsetY = 40;
    this.pointOffsets = { ...pointOffset }; //required else it will behave like static var
    this.pointOffsets.x = this.pointOffsets.x - shipOffset.x;
    this.pointOffsets.y = this.pointOffsets.y - shipOffset.y;
    this.angle = calcAngle(
      this.x + this.pointOffsets.x,
      this.y + this.pointOffsets.y,
      this.dest.x,
      this.dest.y
    );
    this.timeTo = 0;
    this.setSpeed();
    this.end = false;
    this.sprite = new Image();
    this.sprite.src = `./spacemap/lasers/laser${laserID}.png`;
    this.renderX = 0;
    this.renderY = 0;
    this.start = true;
    this.changeRenderPos();
  }
  setSpeed() {
    let distanceX = this.dest.x - this.x;
    let distanceY = this.dest.y - this.y;
    this.timeTo =
      (getDistance(
        this.x + this.pointOffsets.x,
        this.y + this.pointOffsets.y,
        this.dest.x,
        this.dest.y
      ) /
        LASER_SPEED) *
      1000;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
  }
  terminate() {
    this.end = true;
    LASER_LAYER.some((laser, i) => {
      if (laser.ID == this.ID) {
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
    this.renderX = this.x + this.pointOffsets.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y + this.pointOffsets.y - HERO.y + halfScreenHeight;
  }
  draw() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(this.sprite, 0, 0);
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    if (this.end) return;
    this.changeRenderPos();
    this.changePos();
    this.draw();
  }
}
