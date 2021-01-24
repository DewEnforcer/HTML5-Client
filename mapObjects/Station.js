class Station extends MapObject{
  constructor({x, y, z, rotation, type, id}) {
    super(x,y,z);

    this.type = type;
    this.id = id;
    
    this.angle = toRadians(rotation);
    this.offset = getStationOffset(type);

    this.sprite.src = `./spacemap/stations/base${type}.png`;
  }
  draw() {
    GAME_MAP.ctx.translate(this.renderX, this.renderY);
    GAME_MAP.ctx.rotate(-this.angle);
    GAME_MAP.ctx.drawImage(this.sprite, -this.offset.x, -this.offset.y);
    GAME_MAP.ctx.rotate(this.angle);
    GAME_MAP.ctx.translate(-this.renderX, -this.renderY);
  }
  update() {
    this.calculateRenderPos();
    this.draw();
  }
}
