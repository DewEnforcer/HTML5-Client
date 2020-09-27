class Ship {
  constructor(
    ID,
    x,
    y,
    shipID,
    username,
    faction,
    rank,
    hp,
    shd,
    maxHP,
    maxSHD,
    isCloaked,
    robotType = 0,
    isNpc = 0,
    isHero = false
  ) {
    this.isHero = isHero;
    this.isNpc = Boolean(Number(isNpc));
    this.shipID = shipID;
    this.ship = SHIP_NAMES[shipID];
    this.name = username;
    this.x = Number(x);
    this.y = Number(y);
    this.destX = this.x;
    this.destY = this.y;
    this.ID = ID;
    this.rank = rank;
    this.rankSprite = new Image();
    if (this.rank >= 0) {
      this.rankSprite.src = `./spacemap/ui/rank/rank_${this.rank}.png`;
    }
    this.faction = faction;
    this.factionSprite = new Image();
    if (this.faction > 0) {
      this.factionSprite.src = `./spacemap/ui/faction/${faction}.png`;
    }
    this.formationSprite = new Image();
    this.hoverVal = 0;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.timeTo = 0;
    this.isFly = false;
    this.isHover = true;
    this.offset = getOffset(shipID);
    this.nickOffset = getTextOffset(DEFAULTS.USERNAME_FONT, this.name);
    this.nickOffsetY = this.offset.nickY + DEFAULTS.NICK_Y;
    this.sprite = new Image();
    this.pointingAngle = 0;
    this.rotationCalc = 360 / Models[shipID][1];
    this.rotationIncr = 0;
    this.maxRotation = Models[shipID][1];
    this.sequenceNum = 0;
    this.sequenceNumEnd = 0;
    this.setSequence();
    this.setSmooth = false;
    this.isAttacking = false;
    this.targetID = 0;
    this.salvoPhase = 1;
    this.HP = hp;
    this.SHD = shd;
    this.maxHP = maxHP;
    this.maxSHD = maxSHD;
    this.loggingOut = false;
    this.isJumping = false;
    this.render = {
      renderX: null,
      renderY: null,
    };
    //
    this.isCloaked = !!Number(isCloaked);
    //
    this.deactivateLasers = 0;
    this.laserClass = getLaserClass(shipID);
    //
    this.engineClass = 10;
    this.engine = new Engine(this);
    //
    this.leechAwaitFrameMax = -1;
    this.leechAwaitFrame = 0;
    this.leechSeq = 0;
    this.leechOn = false;
    this.leechDisplay = false;
    this.leechFrame = 0;
    this.onFrameLeechChange = 3;
    //
    this.drones = [];
    this.simpleDroneRepresentations = "";
    this.droneSimpleOffset = null;
    //
    this.robotType = robotType;
    this.robot = new Robot(this, robotType);
    this.setFormationSprite();
  }
  setFormationSprite(id = 0) {
    this.formationSprite.src = `./spacemap/formations/${id}.png`;
  }
  setTarget(target) {
    this.targetID = target;
  }
  teleport(x, y) {
    this.isFly = false;
    this.x = x;
    this.y = y;
    if (this.isHero) CAMERA.update();
  }
  setDestination(x, y, time) {
    this.setSmooth = true;
    this.destX = x;
    this.destY = y;
    this.timeTo = time;
    let distanceX = this.destX - this.x;
    let distanceY = this.destY - this.y;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
    this.isFly = true;
  }
  startAttack() {
    this.isAttacking = true;
  }
  stopAttack() {
    this.isAttacking = false;
    this.deactivateLasers = 1;
  }
  isFlying() {
    return this.isFly;
  }
  rotate() {
    const rotateTo = {
      x: this.destX,
      y: this.destY,
    };
    if (this.isAttacking && this.targetID != 0) {
      let enemyCoords = getShipById(this.targetID);
      rotateTo.x = enemyCoords.x;
      rotateTo.y = enemyCoords.y;
    }
    let newPointAngle = calcAngle(this.x, this.y, rotateTo.x, rotateTo.y);
    this.pointingAngle = newPointAngle;
    this.setSequence();
  }
  setSmoothRotation() {
    const currAngle = this.sequenceNum * this.rotationCalc; //add the rotation incr speed depending on distance between ship and distance
    const goalAngle = toDegs(this.pointingAngle);
    let plusDist, minusDist;
    if (currAngle < goalAngle) {
      plusDist = goalAngle - currAngle;
      minusDist = 360 - plusDist;
    } else {
      minusDist = goalAngle - currAngle;
      plusDist = 360 + minusDist;
    }
    if (Math.abs(plusDist) > Math.abs(minusDist)) {
      this.rotationIncr = -1;
    } else {
      this.rotationIncr = 1;
    }
    this.setSmooth = false;
  }
  rotateToSeq() {
    this.sequenceNum += this.rotationIncr;
    if (this.sequenceNum < 0) this.sequenceNum = this.maxRotation;
    else if (this.sequenceNum > this.maxRotation) this.sequenceNum = 0;
    if (this.sequenceNum == this.sequenceNumEnd) {
      this.rotationIncr = 0;
    }
  }
  setSequence() {
    if (this.setSmooth || this.isAttacking) {
      const newNumEnd = Math.round(
        toDegs(this.pointingAngle) / this.rotationCalc
      );
      if (this.sequenceNumEnd != newNumEnd) {
        this.sequenceNumEnd = newNumEnd;
        this.setSmoothRotation();
      }
    }
    this.rotateToSeq();
    this.sprite = PRELOADER.modelsBuffer[this.shipID][this.sequenceNum];
  }
  controlLeech() {
    if (this.leechAwaitFrameMax == -1 && !this.leechDisplay)
      this.leechAwaitFrameMax = Math.round(10000 / DELTA_TIME);
    this.leechAwaitFrame++;
    if (this.leechAwaitFrame >= this.leechAwaitFrameMax && !this.leechDisplay) {
      this.leechFrame = 0;
      this.leechAwaitFrameMax = -1;
      this.leechDisplay = true;
      this.leechAwaitFrame = 0;
    }
  }
  setLeechSeq() {
    const maxLeechFrame = 29;
    this.leechSeq++;
    if (this.leechSeq > maxLeechFrame) {
      this.leechSeq = 0;
      this.leechDisplay = false;
    }
  }
  hover() {
    this.isHover = true;
    if (!SETTINGS.settingsArr[MENU_INTERFACE][4]) return;
    const hoverSpeed = 0.05;
    this.speed.x = 0;
    this.speed.y = 0;
    this.hoverVal += hoverSpeed;
    this.render.renderY += Math.cos(this.hoverVal) * 3;
  }
  resetHover() {
    this.isHover = false;
  }
  resetAttackState() {
    if (this.isHero) return;
    if (this.deactivateLasers <= Date.now()) this.stopAttack();
  }
  stopFlying() {
    this.isFly = false;
  }
  changePos() {
    this.x += this.speed.x * DELTA_TIME;
    this.y += this.speed.y * DELTA_TIME;
    this.timeTo -= DELTA_TIME;
    if (this.isHero) CAMERA.update();
    if (Math.round(this.timeTo) <= 0) this.stopFlying();
  }
  changeRenderPos() {
    this.render.renderX =
      this.x - this.offset.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.render.renderY =
      this.y - this.offset.y - CAMERA.followY + halfScreenHeight;
  }
  draw() {
    if (
      !controlVisibility(
        this.render.renderX,
        this.offset.x,
        this.render.renderY,
        this.offset.y
      )
    ) {
      return; //save resources
    }
    SHIPS_ON_SCREEN++;
    drawUserShipInfo(
      this.rankSprite,
      this.rank,
      this.factionSprite,
      this.faction,
      this.render.renderX + this.offset.x,
      this.render.renderY,
      this.nickOffset,
      this.nickOffsetY,
      this.isHero,
      this.name
    );
    if (!this.isNpc) {
      drawGateRings(
        7,
        this.render.renderX + this.offset.x - this.nickOffset,
        this.render.renderY,
        this.nickOffsetY
      );
      drawFormation(
        this.formationSprite,
        this.render.renderX + this.offset.x,
        this.render.renderY
      );
    }
    if (this.isHero || this.ID == HERO.ship.targetID) {
      displayShipStructure(
        this.HP,
        this.SHD,
        this.maxHP,
        this.maxSHD,
        this.render.renderX + this.offset.x,
        this.render.renderY
      );
    }
    if (this.isCloaked) {
      if (this.isHero) {
        ctx.globalAlpha = CLOAK_ALPHA;
      } else {
        return;
      }
    }
    this.updateDrones();
    ctx.imageSmoothingEnabled = !(SETTINGS.settingsArr[0][6] == 4);
    ctx.drawImage(this.sprite, this.render.renderX, this.render.renderY);
    ctx.imageSmoothingEnabled = true;
  }
  updateDrones() {
    this.drones.forEach((drn) => drn.update());
  }
  update() {
    this.resetAttackState();
    if (this.isFly || (this.isAttacking && this.targetID != 0)) this.rotate();
    if (this.isFly) {
      if (this.isHover) {
        //ship state has changed from hover to flying one
        this.resetHover();
      }
      this.changePos();
    }
    this.changeRenderPos();
    if (!this.isFly) this.hover(); //have to put it here, else it would get reset by render pos method
    if (this.isCloaked && !this.isHero) {
      return;
    }
    this.draw();
    this.engine.update();
    this.robot.update();
    /* if (this.leechOn) { TODO
      this.controlLeech();
    }
    if (this.leechDisplay) {
      this.leechFrame++;
      if (this.leechFrame % this.onFrameLeechChange == 0) {
        this.leechFrame = 1;
        this.setLeechSeq();
      }
      drawLeech(
        this.offset.x * 2,
        this.offset.y * 2,
        this.render.renderX,
        this.render.renderY,
        this.leechSeq
      );
    } */
    ctx.globalAlpha = 1;
  }
}
