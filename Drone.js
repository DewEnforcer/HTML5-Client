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
    this.prevCoords = [];
    this.type = type;
    this.lvl = lvl;
    this.design = design;
    this.angle = this.owner.pointingAngle;
    this.angleCalc = 360 / 32; //change;
    this.position = position;
    this.offset = DRONE_POSITIONS[position + 1];
    this.simpleRepresentation = this.type[0].toUpperCase();
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
  drawPrevious() {
    this.prevCoords.forEach((pos) => {
      ctx.fillStyle = "red";
      ctx.fillRect(pos.x - 2.5, pos.y - 2.5, 5, 5);
      ctx.fillStyle = "black";
    });
  }
  setRender() {
    this.renderX = this.x - HERO.x + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - HERO.y + halfScreenHeight;
    this.prevCoords.push({ x: this.renderX, y: this.renderY });
  }
  rotateAround() {
    this.getOwnerCenter();
    let angle = toDegs(this.angle);
    this.x = DRONE_DISTANCE * Math.cos(-angle);
    this.y = DRONE_DISTANCE * Math.sin(-angle);
    this.x += this.ownerCenter.x;
    this.y += this.ownerCenter.y;
  }
  drawSimpleDrone() {
    this.x =
      this.owner.render.baseX +
      this.owner.offset.x +
      DRONE_SIMPLE_MARGIN_X * this.position -
      12;
    this.y = this.owner.render.baseY + DRONE_SIMPLE_Y;
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(this.simpleRepresentation, this.x, this.y);
    ctx.fillStyle = "black";
  }
  update() {
    if (displayDrones) {
      this.rotateSelf();
      this.rotateAround();
      this.drawPrevious();
      this.setRender();
      this.draw();
    } else {
      this.drawSimpleDrone();
    }
  }
}
