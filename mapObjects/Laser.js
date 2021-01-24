class Laser {
  constructor(
    x,
    y,
    pointOffsets,
    targetX,
    targetY,
    targetOfX,
    targetOfY,
    laserID
  ) {
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
    this.targetOff = {
      x: targetOfX,
      y: targetOfY,
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
    this.minusAngle = this.angle - LASER_ANGLE_TOLERATION;
    this.plusAngle = this.angle + LASER_ANGLE_TOLERATION;
    this.timeTo = 0;
    this.end = false;
    this.sprite = PRELOADER.modelsBuffer.lasers[this.laserID][this.laserID];
    this.renderX = 0;
    this.renderY = 0;
    this.changeRenderPos();
    this.startCoords = {
      x: this.renderX,
      y: this.renderY,
    };
    this.maxSpeedPerFrame = null;
    this.baseSpeed = LASER_SPEED;
    this.initDist = 0;
    if (laserID == -1) this.baseSpeed = ELA_SPEED;
    this.setSpeed();
  }
  setSpeed() {
    console.log(new Date().getTime());
    this.speed = speedVelocity(this.baseSpeed, this.angle);
    this.initDist = getDistance(this.x, this.y, this.dest.x, this.dest.y);
    this.timeTo = (this.initDist / this.baseSpeed) * 1000;
  }
  terminate() {
    console.log(new Date().getTime(), this.speed, this.initDist);
    this.end = true;
    for (let i = 0, n = LASER_LAYER.length; i < n; i++) {
      if (LASER_LAYER[i].ID == this.ID) {
        LASER_LAYER.splice(i, 1);
        break;
      }
    }
  }
  drawPoint() {
    GAME_MAP.ctx.fillStyle = "red";
    GAME_MAP.ctx.fillRect(this.startCoords.x, this.startCoords.y, 10, 10);
  }
  changePos() {
    this.x += this.speed.x / GAME_MAP.getDeltaTime();
    this.y += this.speed.y / GAME_MAP.getDeltaTime();
    this.timeTo -= GAME_MAP.getDeltaTime();
    let relativeAngle = calcAngle(this.x, this.y, this.dest.x, this.dest.y);
    if (this.timeTo <= 0) this.terminate();
    //if (relativeAngle > this.plusAngle || this.relativeAngle < this.minusAngle)
    //this.terminate();
    /*let distanceFromTarget =
      getDistance(this.x, this.y, this.dest.x, this.dest.y) -
      this.maxSpeedPerFrame / GAME_MAP.getDeltaTime();
    if (
      (distanceFromTarget > 0 && distanceFromTarget < this.targetOff.x) ||
      (distanceFromTarget < 0 && distanceFromTarget > this.targetOff.x)
    ) {
      this.terminate();
    } */
  }
  changeRenderPos() {
    this.renderX =
      this.x + this.pointOffsets.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY =
      this.y + this.pointOffsets.y - CAMERA.followY + halfScreenHeight;
  }
  draw() {
    GAME_MAP.ctx.translate(this.renderX, this.renderY);
    GAME_MAP.ctx.rotate(-this.angle);
    GAME_MAP.ctx.drawImage(this.sprite, -this.offsetX, -this.offsetY);
    GAME_MAP.ctx.rotate(this.angle);
    GAME_MAP.ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    if (this.end) return;
    this.changeRenderPos();
    this.changePos();
    this.draw();
  }
}
