class Drone {
  constructor(position, owner, type, lvl) {
    // TODO
    this.x = owner.render.renderX;
    this.y = owner.render.renderY;
    this.rotation = owner.pointingAngle;
    this.offset = DRONE_OFFSET[position];
    this.sprite = new Image();
    this.sprite.src = `./spacemap/drones/${type}/${lvl}.png`;
  }
  draw() {
    ctx.drawImage(this.sprite, this.x, this.y);
  }
  changePos() {}
  setNewRotation() {
    this.rotation = owner.pointingAngle;
  }
  update() {}
}
