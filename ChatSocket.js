class ChatSocket {
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
    return;
    ev.preventDefault();
    const data = ev.currentTarget.id.split("_");
    if (data[1] == 1) {
      terminateGame();
    } else {
      this.initiateConnection();
      //try connection again;
    }
  }
  handleDisconnected() {
    this.connected = false;
  }
  sendPacket(data) {
    this.socket.send(this.packetCompiler(data));
  }
  DataHandler({ data }) {
    data = data.split("|");
    switch (data[1]) {
      case CHAT_INIT:
        CHAT_UI = new Chat(data);
        break;
      case CHAT_ROOM_DATA:
        CHAT_UI.handleRoomData(data);
        break;
      case CHAT_MSG_DATA:
        CHAT_UI.handleMessageData(data);
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
      this.sendPacket([CHAT_CONN_DATA, userID, sessionID, GAME_HASH]);
      this.connected = true;
    });
    this.socket.addEventListener("error", this.handleDisconnected);
    this.socket.addEventListener("message", this.DataHandler);
    this.socket.addEventListener("close", this.handleDisconnected);
  }
}
