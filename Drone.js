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
    this.design = Number(design);
    this.angle = this.owner.pointingAngle;
    this.angleCalc = 360 / 32; //change;
    this.position = position;
    //
    this.goalDistance = DEFAULTS.DRONE_DISTANCE;
    this.currDistance = 0;
    this.distPerFrame = 1;
    //
    let offsetsData = DRONE_POSITIONS[position + 1];
    this.offsetX = offsetsData.x;
    this.offsetY = offsetsData.y;
    this.baseOffsetX = offsetsData.x;
    this.baseOffsetY = offsetsData.y;
    this.Hypo = null;
    this.realAngle = null;
    //console.log(this.baseOffsetX, this.baseOffsetY, this.position);
    this.simpleRepresentation = this.type[0].toUpperCase();
    this.simpleColor = "white";
    this.spriteOffset = {
      x: 32.5,
      y: 32.5,
    };
    this.sprite = new Image();
    this.spritePath = null;
    this.sprite.src = null;
    this.settingMenu = MENU_INTERFACE;
    this.settingIndex = 2;
    this.setDistPerFrame();
    this.setSpritePath();
    this.setGroup();
    this.getOwnerCenter();
    this.setSequence();
    this.setColor();
    this.setSimpleDrone();
    this.setAngleFromShip();
  }
  setDistPerFrame(toShip = false) {
    if (toShip) {
      this.distPerFrame = -2;
      this.currDistance += this.distPerFrame;
      this.goalDistance = 0;
    } else {
      this.distPerFrame = 2;
      this.currDistance += this.distPerFrame;
      this.goalDistance = DEFAULTS.DRONE_DISTANCE;
    }
  }
  setSpritePath() {
    this.spritePath = `./spacemap/drones/`;
    switch (this.design) {
      case 1:
        this.spritePath += `designs/havoc/`;
        break;
      case 2:
        this.spritePath += `designs/hercules/`;
    }
    console.log(this.spritePath);
  }
  setAngleFromShip() {
    this.realAngle = Math.atan2(
      this.baseOffsetY + this.currDistance,
      this.baseOffsetX
    );
    this.Hypo = Math.sqrt(
      Math.pow(this.baseOffsetX, 2) +
        Math.pow(this.baseOffsetY + this.currDistance, 2)
    );
  }
  setGroup() {
    const groups = [
      [0, 1, 2, 3],
      [4, 6, 8],
      [5, 7, 9],
    ];
    const grpAngles = [180, 90, 270];
    groups.forEach((grp, i) => {
      if (grp.includes(this.position))
        this.groupAngle = toRadians(grpAngles[i]);
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
    const newSrc = `${this.spritePath + this.type}/${this.lvl}/${Math.round(
      toDegs(this.angle) / this.angleCalc
    )}.png`;
    if (newSrc == this.sprite.src) return;
    this.sprite.src = newSrc;
  }
  draw() {
    ctx.drawImage(this.sprite, this.renderX, this.renderY);
    ctx.globalAlpha = 1;
  }
  rotateSelf() {
    this.angle = toRadians(this.owner.sequenceNum * this.owner.rotationCalc);
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
    this.x -=
      this.Hypo * Math.cos(this.realAngle + this.angle + this.groupAngle); //; + this.offset.x;
    this.y +=
      this.Hypo * Math.sin(this.realAngle + this.angle + this.groupAngle); //; + this.offset.y;
  }
  setSimpleDrone() {
    this.owner.simpleDroneRepresentations += this.simpleRepresentation;
  }
  drawSimpleDrone() {
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
  updateRadPos() {
    //ad inital
    if (this.goalDistance == this.currDistance) return;
    this.currDistance += this.distPerFrame;
    this.setAngleFromShip();
  }
  update() {
    if (!SETTINGS.settingsArr[this.settingMenu][this.settingIndex]) {
      this.drawSimpleDrone();
      return;
    }
    this.getOwnerCenter();
    this.updateRadPos();
    this.setRealPos();
    this.rotateSelf();
    this.rotateAround();
    this.setRender();
    this.draw();
  }
}
