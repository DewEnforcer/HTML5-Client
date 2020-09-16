class Hero {
  constructor(
    userID,
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
    mapID,
    config,
    repairBot
  ) {
    this.isLogout = false;
    this.isJumping = false;
    this.lockedControls = false;
    this.mapID = mapID;
    this.speed = speed;
    this.laserID = laserID;
    this.config = config;
    //
    this.ship = ShipManager.createShip(
      [
        userID,
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
        repairBot,
        0,
        true,
      ],
      false,
      true
    );
  }
  changeMap(newMap) {
    if (this.mapID === newMap) return;
    this.mapID = Number(newMap);
    resetGamemap();
  }
  setLogout() {
    this.isLogout = !this.isLogout;
    this.lockedControls = this.isLogout;
  }
  requestTarget(target) {
    if (target != this.ship.ID) SOCKET.sendPacket([REQUEST_TARGET, target]);
  }
  switchAmmo(laserID) {
    SOCKET.sendPacket([CHANGE_LASER, laserID]);
    this.laserID = laserID;
  }
  changeConfigRequest() {
    const newCFG = this.config == 1 ? 2 : 1;
    SOCKET.sendPacket([CONFIG_CHANGE, newCFG]);
  }
  changeConfig(isSuccess) {
    if (isSuccess == 0) {
      MAIN.writeToLog(TEXT_TRANSLATIONS.config_cd);
      return;
    }
    this.config = this.config == 1 ? 2 : 1;
    MAIN.handleShipInfoData("CFG", this.config, 0);
  }
  handleAttackState() {
    if (this.ship.isAttacking) {
      SOCKET.sendPacket([STOP_ATTACK]);
      MAIN.writeToLog("end_attack", true);
      this.ship.stopAttack();
    } else {
      SOCKET.sendPacket([START_ATTACK]);
      MAIN.writeToLog("attack", true);
      this.ship.startAttack();
    }
  }
  handleNewData(data) {
    data = trimData(data);
    data.forEach((newData) => {
      newData = newData.split(";");
      if (newData[0] == "SPEED") this.speed = newData[1];
      MAIN.handleShipInfoData(
        newData[0],
        Number(newData[1]),
        Number(newData[2])
      );
    });
  }
  processDestMinimap({ x, y }) {
    let destX = Math.round(x);
    let destY = Math.round(y);
    let time = Math.round(
      (getDistance(this.ship.x, this.ship.y, destX, destY) / this.speed) * 1000
    );
    this.ship.setDestination(destX, destY, time);
    SOCKET.sendPacket([MOV_DATA, destX, destY, time]);
  }
  processDest() {
    if (!EVENT_MANAGER.isMouseDown) return;
    MINIMAP.minimapNavigating = false;
    let dest = convertToMapCoords(EVENT_MANAGER.mouse);
    let destX = Math.round(dest.x);
    let destY = Math.round(dest.y);
    let time = Math.round(
      (getDistance(this.ship.x, this.ship.y, destX, destY) / this.speed) * 1000
    );
    this.ship.setDestination(destX, destY, time);
    SOCKET.sendPacket([MOV_DATA, destX, destY, time]);
  }
}
