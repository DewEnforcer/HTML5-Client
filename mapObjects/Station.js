class Station extends MapObject{
  constructor(x, y, z, rotation, type, id) {
    super(x,y,z);

    this.type = type;
    this.id = id;
    
    this.angle = toRadians(rotation);
    this.offset = getStationOffset(type);

    this.sprite.src = `./spacemap/stations/base${type}.png`;
  }
  draw() {
    ctx.translate(this.renderX, this.renderY);
    ctx.rotate(-this.angle);
    ctx.drawImage(this.sprite, -this.offset.x, -this.offset.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.calculateRenderPos();
    this.draw();
  }
}
