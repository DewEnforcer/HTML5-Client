class Socket {
  constructor(target) {
    this.CONNECT_TARGET = target;
    this.socket = null;
    this.connected = false;
  }
  initiateConnection() {
    this.initSocket();
    MAIN.generateConn();
    MAIN.changeConnStatus(true);
    this.initiateSocketListeners();
  }
  initSocket() {
    this.socket = new WebSocket(this.CONNECT_TARGET);
  }
  handleConnBtn(ev) {
    ev.preventDefault();
    const data = ev.currentTarget.id.split("_");
    console.log(data);
    if (data[1] == 1) {
      terminateGame();
    } else {
      this.initiateConnection();
      //try connection again;
    }
  }
  handleDisconnected() {
    this.connected = false;
    MAIN.generateConn();
    MAIN.changeConnStatus(false);
  }
  sendPacket(data) {
    this.socket.send(this.packetCompiler(data));
  }
  DataHandler({ data }) {
    data = data.split("|");
    switch (data[1]) {
      case HERO_INIT:
        MAIN.initHero(data);
        break;
      case LOGOUT_RESULT:
        handleLogoutResult(data[2]);
        break;
      case SHIP_SPAWN:
        ShipManager.createShip(data);
        break;
      case TARGET_INFO:
        //add update ship stats etc
        HERO.ship.setTarget(data[2]);
        break;
      case FIRE:
        CombatLayer.handleFireRequest(data);
        break;
      case DAMAGE_INFO:
        CombatLayer.generateHit(data);
        break;
      case SHIP_DATA_CHANGE:
        ShipManager.shipData(data);
        break;
      case DRONES_INFO:
        DroneManager.handleDroneData(data);
        break;
      case TECH_INFO:
        HitechManager.manageHitechData(data);
        break;
      case SHIP_MOVEMENT:
        ShipManager.moveShip(data);
        break;
      case SHIP_TELEPORT:
        ShipManager.tpShip(data);
        break;
      case SHIP_ATTACK_STATUS:
        ShipManager.setAttackState(data);
        break;
      case PORTAL_REQUEST_ACTIVATE:
        handlePortalJump(data);
        break;
      case CHANGE_MAP:
        HERO.changeMap(data[2]);
        break;
      default:
        break;
    }
  }
  packetCompiler(data) {
    let packetString = "0|";
    data.forEach((element, i) => {
      if (i > 0) packetString += "|";
      packetString += element;
    });
    return packetString;
  }
  initiateSocketListeners() {
    this.socket.addEventListener("open", () => {
      this.sendPacket([CONNECTION_DATA, sessionID]);
      this.connected = true;
    });
    this.socket.addEventListener("error", this.handleDisconnected);
    this.socket.addEventListener("message", this.DataHandler);
    this.socket.addEventListener("close", this.handleDisconnected);
  }
}
