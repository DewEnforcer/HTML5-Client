class Chat {
    constructor(data) {
        this.window = new Window(data);
        this.socket = new ChatSocket(CHAT_HOST);

        this.navigationList = null;
        this.messageList = null;

        this.isTyping = false;

        this.rooms = [];

        this.activeRoomId = null;

        this.generateContent();
    }
    generateContent() {
        this.generateNavigation();
        this.generateMessageList();

        this.setNavigationRoomNodes();
        this.populateMessageList();
    }
    //navbar
    generateNavigation() {
        this.navigationList = ElUtils.createBox("room_list_wrapper");
        this.window.getBodyNode().appendChild(this.navigationList);
    }
    setNavigationRoomNodes() {
        this.rooms.forEach(room => {
            const roomBtn = ElUtils.createButton("btn_room_switch", null, null, room.name);
            roomBtn.onclick = ev => console.log("Switched to room", room);
            this.navigationList.appendChild(roomBtn);
        });
    }
    resetNavigation() {
        this.navigationList.innerHTML = "";
    }
    //messages
    generateMessageList() {
        this.messageList = ElUtils.createBox("message_list_wrapper");
        this.window.getBodyNode().appendChild(this.messageList);
    }
    populateMessageList() {
        const room = this.rooms[this.activeRoomId];
        if (!room) return;

        room.messages.forEach(msg => this.renderMessageNode(msg));
        this.focusLast();
    }
    renderMessageNode({fromUser, msg, isWhisper, type}) {
        const box = ElUtils.createBox("msg_box");
        box.onclick = ev => console.log("Clicked on message", msg);

        const msgNode = ElUtils.createText("msg_text", msg);
        const senderNode = ElUtils.createText("chat_from_txt", fromUser + ":");
        
        if (type == 2) senderNode.classList.add("system_msg");
        if (isWhisper) senderNode.classList.add("msg_whisper");

        box.appendChild(senderNode);
        box.appendChild(msgNode);

        this.messageList.appendChild(box);
    }
    focusLast() {
        let scHeight, top, clHeight;
        scHeight = this.messageList.scrollHeight;
        top = this.messageList.scrollTop;
        clHeight = this.messageList.clientHeight;

        if (Math.ceil(scrlHeight - top) === clHeight) this.messageList.lastChild.scrollIntoView();
    }
    //handlers

    //getters
    getIsTyping() {
        return this.isTyping;
    }
}