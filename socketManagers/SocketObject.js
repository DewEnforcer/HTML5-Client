class SocketObject {
    constructor(target) {
        this.CONNECT_TARGET = target;
        this.connected = false;
        this.socket = null;
    }

    packetCompiler(data) {
        let packetString = "0|";
        for (let i = 0; i < data.length; i++) {
          if (i > 0) packetString += "|";
          packetString += data[i];
        }
        return packetString;
    }
}