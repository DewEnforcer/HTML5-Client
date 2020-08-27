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
    this.type = type;
    this.lvl = lvl;
    this.design = design;
    this.angle = this.owner.pointingAngle;
    this.angleCalc = 360 / 32; //change;
    this.offset = DRONE_POSITIONS[position + 1];
    this.sprite = new Image();
    this.sprite.src = null;
    this.getOwnerCenter();
    this.setSequence();
  }
  getOwnerCenter() {
    this.ownerCenter.x = this.owner.render.renderX + this.owner.offset.x;
    this.ownerCenter.y = this.owner.render.renderY + this.owner.offset.y;
  }
  setSequence() {
    this.sprite.src = `./spacemap/drones/${this.type}/${this.lvl}/${Math.round(
      toDegs(this.angle) / this.angleCalc
    )}.png`;
  }
  draw() {
    ctx.drawImage(this.sprite, this.x, this.y);
  }
  rotateSelf() {
    this.angle = this.owner.pointingAngle;
    this.setSequence();
  }
  rotateAround() {
    this.getOwnerCenter();
    this.x =
      this.ownerCenter.x +
      DRONE_DISTANCE * Math.cos(-this.angle) +
      this.offset.x;
    this.y =
      this.ownerCenter.y +
      DRONE_DISTANCE * Math.sin(-this.angle) +
      this.offset.y;
  }
  update() {
    this.rotateSelf();
    this.rotateAround();
    this.draw();
  }
}
