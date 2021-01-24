class Log {
    constructor(data) {
        this.window = new Window(data);
    }

    focusLast() {
        this.window.getBodyNode().lastChild.scrollIntoView();
    }
    
    addLogMessage = (msg, isTranslate = false) => {
        let msgBox = document.createElement("span");
        msgBox.innerText = isTranslate ? TEXT_TRANSLATIONS[msg] : msg;

        this.window.getBodyNode().appendChild(msgBox);

        this.focusLast();
    }
}