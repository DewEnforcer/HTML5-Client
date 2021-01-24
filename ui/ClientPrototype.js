class Client extends Draggable {
    constructor() {
        super();
        this.CONN_BOX = null;
        this.ACTION_BAR = null;
        this.isFullscreenMode = false;

        this.UI = {};
        this.CONTROLLERS = {};

        this.uiIsLoaded = false;
    
        this.addlogMessage = null;

        this.UI_ELEMENTS = null;
    }
    // create/get complex ui elements
    init() {
        if (this.uiIsLoaded) return;
        this.UI_ELEMENTS = [...UI_ELEMENTS_DATA];

        this.clearDOM();
        this.removeLoadingBackground();

        this.generateUiElements();
        this.ACTION_BAR = new ActionBar();
    }
    removeLoadingBackground() {
        document.body.style.backgroundImage = "";
    }
    clearDOM() {
        document.body.innerHTML = "";
    }
    generateUiElements() {
        this.UI_ELEMENTS.forEach((UI_EL, i) => {
            if (UI_EL.isSeperateContr) return this.generateController(UI_EL);
            if (UI_EL.hasComponent) return this.generateUiComponent(UI_EL);
            new Window(UI_EL);
        })
    }
    generateController(data) {
        let func;
        switch (data.name) {
            case "fullscreen":
                func = this.reqFullScreen;
            break;
            case "logout":
                func = EVENT_MANAGER.handleLogoutRequest;
            break;
            default:
                func = () => console.log("Undefined function for controller", data.name);
            break;
        }
        data = {...data, onPress: func};
        this.CONTROLLERS = {...this.CONTROLLERS, [data.name]: new Controller(data)};
    }
    generateUiComponent(data) {
        let component;
        switch (data.name) {
            case "userinfo":
                component = new UserInfo(data)
            break;
            case "shipinfo":
                component = new ShipInfo(data);
            break;
            case "log":
                component = new Log(data);
                this.addlogMessage = component.addLogMessage;
            break;
            case "spacemap":
                component = new Minimap(data);
            break;
            case "settings":
                component = new Settings(data);
            break;
            case "spacemap_ov":
                component = new Spacemap(data);
            break;
            case "chat":
                component = new Chat(data);
            break;
            case "logout":
                component = new Logout(data);
            break;
            default:
                console.log("No component for % has been found", data.name);
            break;
        }

        this.UI = {...this.UI, [data.name]: component};
    }
    reqFullScreen(callback = null) {
        if (!this.isFullscreen) {
          this.isFullscreen = true;
          document.body.requestFullscreen();
        } else {
          this.isFullscreen = false;
          document.exitFullscreen();
        }
        if (callback) callback();
    }
}