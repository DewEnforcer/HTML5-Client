class Hero {
  constructor(
    x,
    y,
    speed,
    shipID,
    username,
    faction,
    rank,
    laserID,
    hp,
    shd,
    maxHP,
    maxSHD,
    mapID
  ) {
    this.engineClass = 10;
    this.faction = faction;
    this.config = 1;
    this.shipID = shipID;
    this.ship = ships[shipID];
    this.name = username;
    this.rank = rank;
    this.x = Number(x);
    this.y = Number(y);
    this.destX = this.x;
    this.destY = this.y;
    this.mapID = mapID;
    this.baseSpeed = Number(speed);
    this.hoverVal = 0;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.isFly = false;
    this.isHover = true;
    this.offset = getOffset(shipID);
    this.nickOffset = getTextOffset(USERNAME_FONT, this.name);
    this.nickOffsetY = SHIP_OFFSETS[shipID].nickY;
    this.sprite = new Image();
    this.travelAngle = 0;
    this.pointingAngle = 0;
    this.rotationCalc = 360 / Models[shipID][1];
    this.sequence = this.setSequence(0);
    this.sequenceNum = 0;
    this.isAttacking = false;
    this.targetID = 0;
    this.laserID = laserID;
    this.salvoPhase = 1;
    this.HP = Number(hp);
    this.SHD = Number(shd);
    this.maxHP = Number(maxHP);
    this.maxSHD = Number(maxSHD);
    this.loggingOut = false;
    this.isJumping = false;
    this.lockedControls = false;
    this.timeTo = 0;
    this.render = {
      baseX: halfScreenWidth - this.offset.x,
      baseY: halfScreenHeight - this.offset.y,
      renderX: halfScreenWidth - this.offset.x,
      renderY: halfScreenHeight - this.offset.y,
    };
    this.engine = new Engine(this);

    //
    this.leechAwaitFrameMax = -1;
    this.leechAwaitFrame = 0;
    this.leechSeq = 0;
    this.leechOn = false;
    this.leechDisplay = false;
    this.leechFrame = 0;
    this.onFrameLeechChange = 3;
  }
  changeMap(newMap) {
    if (this.mapID === newMap) return;
    this.mapID = newMap;
  }
  setLogout() {
    this.loggingOut = !this.loggingOut;
    this.lockedControls = this.loggingOut;
  }
  requestTarget(target) {
    SOCKET.sendPacket([REQUEST_TARGET, target]);
  }
  setTarget(targetID) {
    this.targetID = targetID;
  }
  resetTarget() {
    this.targetID = 0;
    this.stopAttack();
  }
  setDestinationMinimap({ x, y }) {
    this.destX = x;
    this.destY = y;
    this.processDestCalc();
    this.isFly = true;
  }
  switchAmmo(laserID) {
    SOCKET.sendPacket([CHANGE_LASER, laserID]);
    this.laserID = laserID;
  }
  setDestination() {
    if (!EVENT_MANAGER.isMouseDown) return;
    MINIMAP.minimapNavigating = false;
    let dest = convertToMapCoords(EVENT_MANAGER.mouse);
    this.destX = Math.round(dest.x);
    this.destY = Math.round(dest.y);
    this.processDestCalc();
  }
  processDestCalc() {
    let distanceX = this.destX - this.x;
    let distanceY = this.destY - this.y;
    this.timeTo =
      (getDistance(this.x, this.y, this.destX, this.destY) / this.baseSpeed) *
      1000;
    this.speed.x = distanceX / this.timeTo;
    this.speed.y = distanceY / this.timeTo;
    SOCKET.sendPacket([MOV_DATA, this.destX, this.destY]);
  }
  stopFlying() {
    this.isFly = false;
    MINIMAP.minimapNavigating = false;
    stopFlySound();
  }
  handleAttackState() {
    if (this.isAttacking) {
      this.stopAttack();
    } else {
      this.startAttack();
    }
  }
  startAttack() {
    if (this.targetID == 0) return;
    SOCKET.sendPacket([START_ATTACK]);
    this.isAttacking = true;
    MAIN.writeToLog("attack", true);
    this.rotate(); // if hero isnt flying, it wont turn him to the enemy, fixed by this
  }
  stopAttack() {
    if (this.targetID == 0) return;
    SOCKET.sendPacket([STOP_ATTACK]);
    this.isAttacking = false;
    MAIN.writeToLog("end_attack", true);
  }
  isFlying() {
    return this.isFly;
  }
  rotate() {
    const rotateTo = {
      x: this.destX,
      y: this.destY,
    };
    if (this.isAttacking) {
      let enemyCoords = getShipById(this.targetID);
      rotateTo.x = enemyCoords.x;
      rotateTo.y = enemyCoords.y;
    }
    this.pointingAngle = calcAngle(this.x, this.y, rotateTo.x, rotateTo.y);
    //this.travelAngle = calcAngle(this.x, this.y, this.destX, this.destY);
    this.sequence = this.setSequence();
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
  setSequence() {
    this.sequenceNum = Math.round(
      toDegs(this.pointingAngle) / this.rotationCalc
    );
    return `./spacemap/ships/${this.ship}/${this.sequenceNum}.png`;
  }
  hover() {
    this.isHover = true;
    const hoverSpeed = 0.05;
    this.speed.x = 0;
    this.speed.y = 0;
    this.hoverVal += hoverSpeed;
    this.render.renderY += Math.cos(this.hoverVal) / 10;
  }
  resetHover() {
    this.render.renderY = this.render.baseY;
    this.isHover = false;
  }
  changePos() {
    playFlySound();
    this.x += this.speed.x * DELTA_TIME;
    this.y += this.speed.y * DELTA_TIME;
    this.timeTo -= DELTA_TIME;
    if (Math.round(this.timeTo) <= 0) this.stopFlying();
  }
  draw() {
    drawName(
      this.nickOffset,
      this.name,
      this.faction,
      true,
      halfScreenWidth,
      this.render.baseY,
      this.nickOffsetY
    ); //always in the middle
    drawRank(
      this.rank,
      halfScreenWidth - this.nickOffset,
      this.render.baseY,
      this.nickOffsetY
    );
    drawFaction(
      halfScreenWidth + this.nickOffset,
      this.render.baseY,
      this.faction,
      this.nickOffsetY
    );
    displayShipStructure(
      this.HP,
      this.SHD,
      this.maxHP,
      this.maxSHD,
      this.render.baseX + this.offset.x,
      this.render.baseY
    );
    this.sprite.src = this.sequence;
    ctx.drawImage(this.sprite, this.render.renderX, this.render.renderY);
  }
  update() {
    if (this.isFly) {
      if (this.isHover) {
        //ship state has changed from hover to flying one
        this.resetHover();
      }
      this.setDestination();
      this.rotate();
      this.changePos();
    } else {
      this.hover();
    }
    this.draw();
    this.engine.update();
    if (this.leechOn) {
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
    }
  }
}
