class Drone {
  constructor(position, owner, type, lvl, design) {
    // TODO
    this.owner = owner;
    this.ownerCenter = {
      x: null,
      y: null,
    };
    this.groupAngle = 0;
    this.x = 0;
    this.y = 0;
    this.renderX = 0;
    this.renderY = 0;
    this.prevCoords = [];
    this.type = type;
    this.lvl = lvl;
    this.design = design;
    this.angle = this.owner.pointingAngle;
    this.angleDroneShip = 0;
    this.angleCalc = 360 / 32; //change;
    this.position = position;
    let offsetsData = DRONE_POSITIONS[position + 1];
    this.offsetX = offsetsData.x;
    this.offsetY = offsetsData.y;
    this.baseOffsetX = offsetsData.x;
    this.baseOffsetY = offsetsData.y;
    this.simpleRepresentation = this.type[0].toUpperCase();
    this.simpleColor = "white";
    this.spriteOffset = {
      x: 32.5,
      y: 32.5,
    };
    this.sprite = new Image();
    this.sprite.src = null;
    this.settingMenu = MENU_INTERFACE;
    this.settingIndex = 2;
    this.setGroup();
    this.getOwnerCenter();
    this.setSequence();
    this.setColor();
    this.setSimpleDrone();
  }
  setGroup() {
    const groups = [
      [0, 1, 2, 3],
      [4, 6, 8],
      [5, 7, 9],
    ];
    const grpAngles = [90, 180, 0];
    groups.forEach((grp, i) => {
      if (grp.includes(this.position)) this.groupAngle = grpAngles[i];
    });
  }
  setColor() {
    if (this.design == 1) this.simpleColor = COLORS.COLOR_HAVOC;
    else if (this.design == 2) this.simpleColor = COLORS.COLOR_HERCULES;
  }
  getOwnerCenter() {
    this.ownerCenter.x = this.owner.x; //; + this.offset.x;
    this.ownerCenter.y = this.owner.y; //; + this.offset.y;
  }
  setSequence() {
    this.sprite.src = `./spacemap/drones/${this.type}/${this.lvl}/${Math.round(
      toDegs(this.angle) / this.angleCalc
    )}.png`;
  }
  draw() {
    ctx.drawImage(
      this.sprite,
      this.renderX + this.offsetX,
      this.renderY + this.offsetY
    );
    ctx.globalAlpha = 1;
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
    this.renderX =
      this.x - this.spriteOffset.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY =
      this.y - this.spriteOffset.y - CAMERA.followY + halfScreenHeight;
    this.prevCoords.push({ x: this.renderX, y: this.renderY });
  }
  setRealPos() {
    this.x = this.ownerCenter.x; //; + this.offset.x;
    this.y = this.ownerCenter.y; //; + this.offset.y;
  }
  rotateAround() {
    // TODO fix the offset bug
    this.offsetX = this.baseOffsetX * Math.cos(this.angle);
    this.offsetY = this.baseOffsetY * Math.sin(this.angle);
    this.angle -= toRadians(this.groupAngle);
    this.x -= DEFAULTS.DRONE_DISTANCE * Math.cos(this.angle); //; + this.offset.x;
    this.y += DEFAULTS.DRONE_DISTANCE * Math.sin(this.angle); //; + this.offset.y;
  }
  setSimpleDrone() {
    this.owner.simpleDroneRepresentations += this.simpleRepresentation;
  }
  drawSimpleDrone() {
    //TODO FIX IIIIIIIAZ
    let margin = 0;
    if (this.simpleRepresentation == "Z") margin = 5;
    this.x =
      this.owner.render.renderX +
      this.owner.offset.x +
      DEFAULTS.DRONE_SIMPLE_MARGIN_X * this.position +
      margin; //center
    this.y = Math.round(this.owner.render.renderY + DEFAULTS.DRONE_SIMPLE_Y);
    ctx.fillStyle = this.simpleColor;
    ctx.font = DEFAULTS.DRONE_SIMPLE_FONT;
    ctx.fillText(
      this.simpleRepresentation,
      this.x - this.owner.droneSimpleOffset,
      this.y
    );
    ctx.fillStyle = "black";
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) {
      this.drawSimpleDrone();
      return;
    }
    this.getOwnerCenter();
    this.setRealPos();
    this.rotateSelf();
    this.rotateAround();
    this.setRender();
    this.draw();
  }
}
