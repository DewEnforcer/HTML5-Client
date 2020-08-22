class Socket {
  constructor(target) {
    this.CONNECT_TARGET = target;
    this.socket = null;
    this.connected = false;
  }
  initiateConnection() {
    this.socket = new WebSocket(this.CONNECT_TARGET);
    MAIN.generateConn("Connecting...");
    this.initiateSocketListeners();
  }
  handleDisconnected() {
    this.connected = false;
    MAIN.generateConn("Connection failed");
  }
  sendPacket(data) {
    this.socket.send(this.packetCompiler(data));
  }
  DataHandler({ data }) {
    data = data.split("|");
    console.log(data);
    switch (data[1]) {
      case HERO_INIT:
        MAIN.initHero(data);
        break;
      case LOGOUT_RESULT:
        handleLogoutResult(data[2]);
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
