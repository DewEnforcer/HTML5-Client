class Log extends Window {
    constructor(data) {
        super(data);
    }

    focusLast() {
        this.body.node.lastChild.scrollIntoView();
    }
    
    addLogMessage(msg, isTranslate = false) {
        let msgBox = document.createElement("span");
        msgBox.innerText = isTranslate ? TEXT_TRANSLATIONS[msg] : msg;

        this.body.node.appendChild(msgBox);

        this.focusLast();
    }
}