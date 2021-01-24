class Connection {
    constructor() {
        this.DATA = {
            id: 0,
            name: "connection",
            children: ["header", "main"],
            icon: "connection",
            label: "connection_label",
            content: []
        },

        this.window = new Window(this.DATA);
        
        this.state = 0; // 1 connecting, 0 connection lost
    }

    closeScreen() {
        this.window.handleWindowClose(true);
    }
    openScreen() {
        this.window.handleWindowOpen(true);
    }

    setConnectionInfo(newState) {
        this.state = newState;
        this.cleanupScreen();

        if (!this.window.isOpen) this.openScreen();

        if (this.state === 0) this.generateScreenLayout(this.generateDisconnectedScreen);
        else this.generateScreenLayout(this.generateConnectingScreen);

        LANGUAGE_MANAGER.translateGame(true);
    }

    generateScreenLayout(screenFunc) {
        const statusImg = document.createElement("img");
        statusImg.classList.add("server_connect_icon");

        const textBox = ElUtils.createBox("server_connect_txt");
        
        const controllsBox = ElUtils.createBox("server_connect_btn_box");

        const parent = this.window.getBodyNode();
        parent.appendChild(statusImg);
        parent.appendChild(textBox);
        parent.appendChild(controllsBox);

        screenFunc(statusImg, textBox, controllsBox);
    }
    generateConnectingScreen = (statusImg, textBox, controllsBox) => {
        const text = document.createElement("p");
        text.classList.add("translate_txt");
        text.setAttribute("transl_key", "conn_active");

        textBox.appendChild(text);

        const cancelBtn = ElUtils.createButton(["cancel", "translate_txt"]);
        cancelBtn.addEventListener("click", this.handleCancel);
        cancelBtn.setAttribute("transl_key", "cancel")

        controllsBox.appendChild(cancelBtn);

        statusImg.src = `./spacemap/ui/connection/active.png`
    }
    generateDisconnectedScreen = (statusImg, textBox, controllsBox) => {
        const text = document.createElement("p");
        text.classList.add("translate_txt");
        text.setAttribute("transl_key", "conn_inactive");

        textBox.appendChild(text);

        const cancelBtn = ElUtils.createButton(["cancel", "translate_txt"]);
        cancelBtn.setAttribute("transl_key", "cancel")
        cancelBtn.addEventListener("click", this.handleCancel);
        const retryBtn = ElUtils.createButton(["try_again", "translate_txt"]);
        retryBtn.setAttribute("transl_key", "try_again")
        retryBtn.addEventListener("click", this.handleConnect);

        controllsBox.appendChild(cancelBtn);
        controllsBox.appendChild(retryBtn);

        statusImg.src = `./spacemap/ui/connection/inactive.png`
    }
    cleanupScreen() {
        this.window.getBodyNode().innerHTML = "";
    }

    handleCancel() {
        terminateGame();
    }
    handleConnect() {
        SOCKET.initiateConnection();
    }
}