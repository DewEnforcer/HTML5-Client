class Planet {
  constructor(planetID, x, y, z) {
    this.planetID = planetID;
    this.x = x;
    this.y = y;
    this.z = z;
    this.renderX = null;
    this.renderY = null;
    this.sprite = new Image();
    this.sprite.src = `${PATH_TO_PLANETS}/planet_${this.planetID}.png`;
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
  }
  update() {
    this.renderX = this.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY + halfScreenHeight; //count real distance to render one to the center
    this.draw();
  }
}
