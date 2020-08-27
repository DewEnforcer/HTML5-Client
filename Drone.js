class Drone {
  constructor(position, owner, type, lvl, design) {
    // TODO
    this.owner = owner;
    this.ownerCenter = {
      x: null,
      y: null,
    };
    this.x = 0;
    this.y = 0;
    this.renderX = 0;
    this.renderY = 0;
    this.type = type;
    this.lvl = lvl;
    this.design = design;
    this.angle = this.owner.pointingAngle;
    this.angleCalc = 360 / 32; //change;
    this.offset = DRONE_POSITIONS[position + 1];
    this.spriteOffset = {
      x: 32.5,
      y: 28.5,
    };
    this.sprite = new Image();
    this.sprite.src = null;
    this.getOwnerCenter();
    this.setSequence();
  }
  getOwnerCenter() {
    this.ownerCenter.x = this.owner.x;
    this.ownerCenter.y = this.owner.y;
  }
  setSequence() {
    this.sprite.src = `./spacemap/drones/${this.type}/${this.lvl}/${Math.round(
      toDegs(this.angle) / this.angleCalc
    )}.png`;
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  rotateSelf() {
    this.angle = this.owner.pointingAngle;
    this.setSequence();
  }
  setRender() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight;
  }
  rotateAround() {
    this.getOwnerCenter();
    this.x = DRONE_DISTANCE * Math.cos(-this.angle);
    this.y = DRONE_DISTANCE * Math.sin(-this.angle);
    this.x += this.ownerCenter.x - this.spriteOffset.x + this.offset.x;
    this.y += this.ownerCenter.y - this.spriteOffset.y + this.offset.y;
  }
  update() {
    this.rotateSelf();
    this.rotateAround();
    this.setRender();
    this.draw();
  }
}
