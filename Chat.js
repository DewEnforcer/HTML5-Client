class Chat {
  constructor(initData) {
    initData = trimData(initData);
    this.rooms = [];
    this.isBanned = false;
    this.openRoom = null; //currently visible room
    this.chatElBlock = document.querySelector(".chat_main");
    this.roomsListEl = null;
    this.messageListEl = null;
    this.messageBarEl = null;
    this.handleRoomData(initData);
    this.openRoom = this.rooms[0].id;
    this.initUI();
  }
  initUI() {
    this.genChatRooms();
    this.genRoomMessages(true);
    this.genMsgBar();
  }
  genChatRooms() {
    this.roomsListEl = document.createElement("div");
    this.roomsListEl.classList.add("room_list_wrapper");
    this.chatElBlock.appendChild(this.roomsListEl);
    this.rooms.forEach((roomObj) => {
      const roomEl = document.createElement("button");
      roomEl.classList.add("btn_room_switch");
      roomEl.setAttribute("roomID", roomObj.id);
      roomEl.innerText = roomObj.name;
      roomEl.onclick = (ev) => this.handleRoomSwitch(ev);
      this.roomsListEl.appendChild(roomEl);
    });
  }
  genRoomMessages(isInit = false) {
    if (isInit) {
      this.messageListEl = document.createElement("div");
      this.messageListEl.classList.add("message_list_wrapper");
      this.chatElBlock.appendChild(this.messageListEl);
    } else {
      this.clearRoomMsgs();
    }
    if (this.openRoom == null) return;
    this.rooms[this.openRoom].messages.forEach((msg) => {
      this.createChatMsgEl(msg.fromUser, msg.msg, msg.isWhisper);
    });
  }
  genMsgBar() {
    this.messageBarEl = document.createElement("input");
    this.messageBarEl.type = "text";
    this.messageBarEl.classList.add("message_bar");
    this.messageBarEl.addEventListener("keypress", (ev) =>
      this.handleMsgSend(ev)
    );
    this.chatElBlock.appendChild(this.messageBarEl);
  }
  handleMessageData(data) {
    data = trimData(data); //msgText, isWhisper, roomParentID
    data.forEach((msg) => {
      msgData = msg.split("/");
      this.addChatMessage(msgData);
    });
  }
  addChatMessage(msgData) {
    const msgObj = {
      msg: msgData[0],
      isWhisper: !!msgData[1],
      fromUser: msgData[3],
    };
    this.rooms.forEach((room) => {
      if (room.id == msgData[2]) {
        room.messages.push(msgObj);
      }
    });
    if (msgData[2] == this.openRoom) {
      this.createChatMsgEl(msgObj.fromUser, msgObj.msg, msgObj.isWhisper);
    }
  }
  createChatMsgEl(from, text, isWhisper) {
    const msgNode = document.createElement("div");
    const msgText = document.createElement("span");
    msgText.innerText = from + ": " + text;
    if (isWhisper) msgNode.classList.add("msg_whisper");
    msgNode.classList.add("msg_box");
    msgNode.appendChild(msgText);
    msgNode.setAttribute("from", from); //used to retrieve nickname for whispers
    msgNode.onclick = (ev) => this.handleMsgClick(ev);
    this.messageListEl.appendChild(msgNode);
  }
  handleRoomData(data) {
    data.forEach((chatRoom) => {
      let roomData = chatRoom.split("/"); //roomID, roomName
      console.log(roomData);
      this.addRoom(roomData);
    });
  }
  addRoom(roomData) {
    const roomObj = {
      name: roomData[0],
      id: roomData[1],
      messages: [],
    };
    console.log(roomObj);
    this.rooms.push(roomObj);
    if (this.roomsListEl == null) return;
    const roomEl = document.createElement("button");
    roomEl.classList.add("btn_room_switch");
    roomEl.setAttribute("roomID", roomObj.id);
    roomEl.innerText = roomObj.name;
    roomEl.onclick = (ev) => this.handleRoomSwitch(ev);
    this.roomsListEl.appendChild(roomEl);
  }
  clearRoomMsgs() {
    this.messageListEl.innerHTML = "";
  }
  //UI handlers
  handleMsgClick(ev) {
    const msgNode = ev.currentTarget;
    const from = msgNode.getAttribute("from");
    console.log(msgNode, from);
  }
  handleRoomSwitch(ev) {
    const btnClicked = ev.currentTarget;
    const newRoomID = btnClicked.getAttribute("roomID");
    console.log(btnClicked, newRoomID);
    if (this.openRoom == newRoomID) return;
    this.openRoom = newRoomID;
    //add visual room select method
    this.genRoomMessages();
  }
  handleMsgSend({ keyCode }) {
    if (keyCode == 13) {
      //pressed send
      const msgSent = this.messageBarEl.value;
      const msgCopy = msgSent;
      msgCopy.replace(/ /g, "");
      if (msgCopy.length <= 0) return;
      CHAT_SOCKET.sendPacket([CHAT_SEND_MESSAGE, msgSent, this.openRoom]);
      this.messageBarEl.value = "";
    }
  }
}
