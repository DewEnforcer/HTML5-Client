class Laser {
  constructor(x, y, pointOffsets, targetX, targetY, laserID) {
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
    this.offsetX = 39;
    this.offsetY = 39;
    this.pointOffsets = pointOffsets;
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
    this.changeRenderPos();
    this.startCoords = {
      x: this.renderX,
      y: this.renderY,
    };
  }
  setSpeed() {
    this.speed = speedVelocity(LASER_SPEED, this.angle);
    let timeToX = Math.abs(this.x - this.dest.x) / Math.abs(this.speed.x);
    let timeToY = Math.abs(this.y - this.dest.y) / Math.abs(this.speed.y);
    console.log(timeToX, timeToY);
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
  drawPoint() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.startCoords.x, this.startCoords.y, 10, 10);
  }
  changePos() {
    this.x += this.speed.x / DELTA_TIME;
    this.y += this.speed.y / DELTA_TIME;
    this.timeTo -= DELTA_TIME;
    if (Math.round(this.timeTo) <= 0) this.terminate();
  }
  changeRenderPos() {
    this.renderX =
      this.x + this.pointOffsets.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY =
      this.y + this.pointOffsets.y - CAMERA.followY + halfScreenHeight;
  }
  draw() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(this.sprite, -this.offsetX, -this.offsetY);
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    if (this.end) return;
    //this.drawPoint();
    this.changeRenderPos();
    this.changePos();
    this.draw();
  }
}