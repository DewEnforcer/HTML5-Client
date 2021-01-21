class Socket {
  constructor(target) {
    this.CONNECT_TARGET = target;
    this.socket = null;
    this.connected = false;
  }
  PingPong = () => {
    if (!this.connected) return;
    this.socket.send("PING");
    setTimeout(() => {
      this.PingPong();
    }, 10000);
  }
  initiateConnection() {
    this.initSocket();
    MAIN.generateConn();
    MAIN.populateConnBox(true);
    this.initiateSocketListeners();
  }
  initSocket() {
    this.socket = new WebSocket(this.CONNECT_TARGET);
  }
  handleConnBtn(ev) {
    ev.preventDefault();
    const data = ev.currentTarget.id.split("_");
    if (data[1] == 1) {
      terminateGame();
    } else {
      this.initiateConnection();
      //try connection again;
    }
  }
  handleDisconnected = () => {
    this.connected = false;
    MAIN.generateConn();
    MAIN.populateConnBox(false);
  }
  sendPacket(data) {
    this.socket.send(this.packetCompiler(data));
  }
  terminate() {
    this.socket.close();
  }
  DataHandler({ data }) {
    data = data.split("|");
    switch (data[1]) {
      case HERO_INIT:
        MAIN.heroInit(data);
        break;
      case LOGOUT_RESULT:
        handleLogoutResult(data[2]);
        break;
      case SHIP_SPAWN:
        ShipManager.createShip(data);
        break;
      case SHIP_DESPAWN:
        ShipManager.removeShip(data);
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
      case PORTAL_REQUEST_FAIL:
        handlePortalRange();
        break;
      case CHANGE_MAP:
        HERO.changeMap(data[2]);
        break;
      case CONFIG_CHANGE_SERVER:
        HERO.changeConfig(data[2]);
        break;
      case USER_DATA_SEPERATE:
        //HERO.handleNewData(data);
        break;
      case LOG_MESSAGE:
        MAIN.writeToLog(data[2], true);
        break;
      case REPAIR_BOT_STATUS:
        HERO.setRepairBot(data[2]);
        break;
      case SET_ACTIONBAR_ITEMS:
        //MAIN.actionBar.setActionbarItems(data);
        break;
      case SET_CLOAK_STATE:
        ShipManager.cloakShip(data);
        break;
      case SET_COOLDOWN:
        //MAIN.actionBar.selectItemsToCooldown(data);
        break;
      case DMZ_STATE:
        if (data[2] == 1) {
          MESSAGE_LAYER.push(new MapMessage(TEXT_TRANSLATIONS.dmz, 4, false));
        } else {
          MESSAGE_LAYER.forEach((msg) => {
            if (msg.type == 4) msg.changeFadeActive();
          });
        }
        break;
      case RADIATION_STATE:
        if (data[2] == 1) {
          MESSAGE_LAYER.push(
            new MapMessage(TEXT_TRANSLATIONS.rad_warn, 5, false)
          );
        } else {
          MESSAGE_LAYER.forEach((msg) => {
            if (msg.type == 5) msg.changeFadeActive();
          });
        }
        break;
      case SET_ITEM_AMOUNTS:
        //MAIN.actionBar.setItemAmount(data);
        break;
      case ADVANCED_JUMP_REQUEST_STATUS:
        SPACEMAP.handleJumpInit(data);
        break;
      case ADVANCED_JUMP_COST:
        SPACEMAP.handlePriceChange(data[2]);
        break;
      case CREATE_PORTAL: 
        
        break;
      case CHANGE_FORMATION:
         ShipManager.switchFormation(data);
        break;    
    }
  }
  packetCompiler(data) {
    let packetString = "0|";
    for (let i = 0; i < data.length; i++) {
      if (i > 0) packetString += "|";
      packetString += data[i];
    }
    return packetString;
  }
  initiateSocketListeners() {
    this.socket.addEventListener("open", () => {
      this.sendPacket([CONNECTION_DATA, userID, sessionID, GAME_HASH]);
      this.connected = true;
      //this.PingPong();
    });
    this.socket.addEventListener("error", this.handleDisconnected);
    this.socket.addEventListener("message", this.DataHandler);
    this.socket.addEventListener("close", this.handleDisconnected);
  }
}
