class Robot {
  constructor(owner, botType, repairSpeed = 1) {
    this.owner = owner;
    this.botType = botType;
    this.angle = 0;
    this.angleTowardsShip = 0;
    this.armAngles = [0, -25, 0, 25];
    this.armAngle = 0;
    this.armSequence = 0;
    this.bodySprite = new Image();
    this.bodySprite.src = `./spacemap/robots/robot${this.botType}.png`;
    this.armSprite = new Image();
    this.armSprite.src = `./spacemap/robots/arm${this.botType}.png`;
    this.renderX = 0;
    this.renderY = 0;
    this.frame = 0;
    this.frameActivation = 5;
    this.armFrameActivation = 10;
    this.armOffset = 14;
    this.offsetX = 23;
    this.offsetY = 23;
    this.active = false; //
    this.sound = new Sound(`./spacemap/audio/robots/robot.mp3`, true);
    this.soundPlaying = false;
    this.setRender();
  }
  restartBot() {
    this.angle = 0;
    this.angleTowardsShip = 0;
    this.armAngle = 0;
    this.armSequence = 0;
    this.frame = 0;
  }
  isActive() {
    if (this.active && !this.soundPlaying) this.sound.play();
    else if (this.soundPlaying) this.sound.stop();
  }
  setRender() {
    this.renderX = this.owner.render.renderX + this.owner.offset.x;
    this.renderY = this.owner.render.renderY + this.owner.offset.y;
  }
  rotate() {
    this.angle += 1;
    this.angleTowardsShip = calcAngle(
      this.renderX,
      this.renderY,
      this.owner.render.renderX + this.owner.offset.x,
      this.owner.render.renderY + this.owner.offset.y
    );
    if (this.angle > 360) this.angle = 0;
  }
  setArmSequence() {
    this.armSequence++;
    if (this.armSequence >= this.armAngles.length) this.armSequence = 0;
    this.armAngle = toRadians(this.armAngles[this.armSequence]);
  }
  setOffset() {
    let radAngle = toRadians(this.angle);
    this.renderX -= DEFAULTS.BOT_RADIUS * Math.cos(radAngle);
    this.renderY += DEFAULTS.BOT_RADIUS * Math.sin(radAngle);
  }
  checkFrameActions() {
    this.frame++;
    if (this.frame % this.frameActivation == 0) {
      this.rotate();
    }
    if (this.frame % this.armFrameActivation == 0) {
      this.setArmSequence();
      this.frame = 0;
    }
  }
  drawArm() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-(this.angleTowardsShip + this.armAngle));
    ctx.drawImage(
      this.armSprite,
      -this.offsetX,
      -this.offsetY + this.armOffset
    );
    ctx.rotate(this.angleTowardsShip + this.armAngle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  drawBody() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angleTowardsShip);
    ctx.drawImage(this.bodySprite, -this.offsetX, -this.offsetY);
    ctx.rotate(this.angleTowardsShip);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.isActive();
    if (!this.active) return;
    this.checkFrameActions();
    this.setRender();
    this.setOffset();
    this.drawArm();
    this.drawBody();
  }
}
