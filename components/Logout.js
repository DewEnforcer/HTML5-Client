class Logout {
    constructor(data) {
        this.window = new Window(data, this.handleLogoutToggle);

        this.isLoggingOut = false;

        this.startCountdownTime = 5;
        this.logoutTimeLeft = this.startCountdownTime;
        
        this.countdownFunc = null;
        this.countdownNode = null;
        this.generateContent();
    }   
    generateContent() {
        const body = this.window.getBodyNode();

        const txtTop = ElUtils.createText(null, TEXT_TRANSLATIONS["logout_txt_top"], "logout_txt_top");
        this.countdownNode = ElUtils.createText(null, this.logoutTimeLeft)
        const txtBottom = ElUtils.createText(null, TEXT_TRANSLATIONS["logout_txt_bottom"], "logout_txt_bottom");
    
        const btnCancel = ElUtils.createButton("btn_logout_cancel", null, TEXT_TRANSLATIONS["cancel"]);
        btnCancel.addEventListener("click", () => this.handleLogoutToggle(true))

        body.appendChild(txtTop);
        body.appendChild(this.countdownNode);
        body.appendChild(txtBottom);
        body.appendChild(btnCancel);
    } 

    setLogoutTime = (time) => {
        this.startCountdownTime = time;
    }

    resetCountdown = () => {
        clearInterval(this.countdownFunc);
        this.logoutTimeLeft = this.startCountdownTime;
        this.countdownNode.innerText = this.logoutTimeLeft;
        this.countdownFunc = null;
    }

    handleCountdown = () => {
        if (!this.countdownFunc) {
            this.logoutTimeLeft = this.startCountdownTime;
            return this.countdownFunc = setInterval(() => {
                this.logoutTimeLeft -= 1;
                this.countdownNode.innerText = this.logoutTimeLeft;
                if (this.logoutTimeLeft <= 0) this.resetCountdown();
            }, 1000);
        } 

        this.resetCountdown();
    }
    handleLogoutResult = (isTrue) => {
        isTrue = isTrue === "1" ? true : false;

        if (isTrue) return terminateGame();
        this.handleLogoutToggle(true);
    }
    handleLogoutToggle = (btnTrigger = false) => {
        
        let packet;
        if (this.isLoggingOut) packet = REQUEST_LOGOUT_STOP;
        else packet = REQUEST_LOGOUT;
        
        this.isLoggingOut = !this.isLoggingOut;

        SOCKET.sendPacket([packet]);
        this.handleCountdown();

        if (btnTrigger) {
            if (this.isLoggingOut) this.window.handleWindowOpen(); //use this method as the standard one toggles another logout
            else this.window.handleWindowClose();
        }
    }
}