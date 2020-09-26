class Station {
  constructor(x, y, z, rotation, type, id) {
    this.x = x;
    this.y = y;
    this.renderX = 0;
    this.renderY = 0;
    this.z = z;
    this.angle = toRadians(rotation);
    this.type = type;
    this.id = id;
    this.offset = getStationOffset(type);
    this.sprite = new Image();
    this.sprite.src = `./spacemap/stations/base${type}.png`;
  }
  changeRenderPos() {
    this.renderX = this.x + -CAMERA.followX / this.z + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y + -CAMERA.followY / this.z + halfScreenHeight;
  }
  draw() {
    if (!controlVisibility(this.renderX, this.renderY)) return; //save resources
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(this.sprite, -this.offset.x, -this.offset.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.changeRenderPos();
    this.draw();
  }
}
