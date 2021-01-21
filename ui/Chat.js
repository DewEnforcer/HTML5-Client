class Chat {
  constructor(initData) {
    //msg origin type - 0 = normal msg, 1 = whisper, 2 = system
    initData = trimData(initData);
    this.rooms = [];
    this.isBanned = false;
    this.openRoom = null; //currently visible room
    this.chatElBlock = document.querySelector(".chat_main");
    this.roomsListEl = null;
    this.messageListEl = null;
    this.messageBarEl = null;
    this.maxRoomBtns = 3;
    this.roomBtnOffset = 0;
    this.isTyping = false;
    this.handleRoomData(initData);
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
      this.createChatMsgEl(
        msg.fromUser,
        msg.msg,
        msg.isWhisper,
        msg.originType
      );
    });
  }
  genMsgBar() {
    this.messageBarEl = document.createElement("input");
    this.messageBarEl.type = "text";
    this.messageBarEl.classList.add("message_bar");
    this.messageBarEl.addEventListener("keypress", (ev) =>
      this.handleMsgSend(ev)
    );
    this.messageBarEl.onfocus = () => (this.isTyping = true);
    this.messageBarEl.addEventListener(
      "focusout",
      () => (this.isTyping = false)
    );
    this.chatElBlock.appendChild(this.messageBarEl);
  }
  handleMessageData(data) {
    data = trimData(data); //msgText, isWhisper, roomParentID
    data.forEach((msg) => {
      let msgData = msg.split("/");
      this.addChatMessage(msgData);
    });
  }
  addChatMessage(msgData) {
    const msgObj = {
      msg: msgData[0],
      isWhisper: !!msgData[2],
      fromUser: msgData[1],
      originType: 0,
    };
    this.rooms.forEach((room) => {
      if (room.id == msgData[3]) {
        room.messages.push(msgObj);
      }
    });
    if (msgData[3] == this.openRoom) {
      this.createChatMsgEl(
        msgObj.fromUser,
        msgObj.msg,
        msgObj.isWhisper,
        msgObj.originType
      );
    }
  }
  createChatMsgEl(from, text, isWhisper, type) {
    const msgNode = document.createElement("div");
    const msgText = document.createElement("span");
    msgText.classList.add("msg_text");
    const fromWrapper = document.createElement("span");
    fromWrapper.classList.add("chat_from_txt");
    fromWrapper.innerText = from + ": ";
    if (type == 2) fromWrapper.classList.add("system_msg");
    if (isWhisper) fromWrapper.classList.add("msg_whisper");
    msgNode.appendChild(fromWrapper);
    msgText.innerText = text;
    msgNode.classList.add("msg_box");
    msgNode.appendChild(msgText);
    msgNode.setAttribute("from", from); //used to retrieve nickname for whispers
    msgNode.onclick = (ev) => this.handleMsgClick(ev);
    let scHeight, top, clHeight;
    scHeight = this.messageListEl.scrollHeight;
    top = this.messageListEl.scrollTop;
    clHeight = this.messageListEl.clientHeight;
    this.messageListEl.appendChild(msgNode);
    this.focusNewMessage(scHeight, top, clHeight);
  }
  handleRoomData(data) {
    if (data.length === 0) return
    data.forEach((chatRoom) => {
      let roomData = chatRoom.split("/"); //roomID, roomName
      this.addRoom(roomData);
    });
    this.openRoom = this.rooms[0].id;
  }
  addRoom(roomData) {
    const roomObj = {
      name: roomData[0],
      id: roomData[1],
      messages: [
        //initial message
        {
          msg: TEXT_TRANSLATIONS.welcome_to_room + roomData[0],
          isWhisper: false,
          fromUser: "ChatBot",
          originType: 2,
        },
      ],
    };
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
  focusNewMessage(scrlHeight, top, clHeight) {
    //scroll into view only when user isnt reading old msgs
    if (Math.ceil(scrlHeight - top) === clHeight) {
      this.messageListEl.lastChild.scrollIntoView();
    }
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
      const msgSent = this.messageBarEl.value.replace("/", "&#47;");
      const msgCopy = msgSent;
      msgCopy.replace(/ /g, "");
      if (msgCopy.length <= 0) return;
      CHAT_SOCKET.sendPacket([CHAT_SEND_MESSAGE, msgSent, this.openRoom]);
      this.messageBarEl.value = "";
    }
  }
}
