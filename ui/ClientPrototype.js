class Client extends Draggable {
    constructor() {
        super();
        this.CANVAS = null;
        this.LOG = null;
        this.CONN_BOX = null;
        this.ACTION_BAR = null;

        this.MINIMAP_C = null;
        this.MINIMAP_TEXT = null;
        this.MINIMAP_CTX = null;

        this.UI = {};

        this.uiIsLoaded = false;

        this.shipInfoStatus = {};

        this.ACTION_BAR = null;

        this.isFullscreenMode = false;

        this.LIGHT_LEVEL = 1;

        this.UI_ELEMENTS = null;
    }
    // create/get complex ui elements
    createGameCanvas() {
        this.CANVAS = document.createElement("canvas");
        this.CANVAS.id = "gamemap";
        this.CANVAS.classList.add("canvas");

        ctx = this.CANVAS.getContext("2d"); 

        document.body.appendChild(this.CANVAS);
    }
    createMinimapCanvas() {
        const minimapBox = document.querySelector(".spacemap_main");

        this.MINIMAP_TEXT = ElUtils.createBox("spacemap_coordinates_wrapper");
        
        this.MINIMAP_C = document.createElement("canvas");
        this.MINIMAP_C.id = "minimap";
        
        this.MINIMAP_CTX = this.MINIMAP_C.getContext("2d");

        minimapBox.appendChild(this.MINIMAP_TEXT);
        minimapBox.appendChild(this.MINIMAP_C);
    }
    getLogBook() {
        this.LOG = document.querySelector(".log_main");
    }
    //
    heroInit(data) {
        data.splice(0, 2);
        this.init();
        HERO = new Hero(...data);
        CAMERA = new Camera(HERO.ship);
        initiatePostHero();
        //init values
        this.updateHeroStats();
    }
    updateHeroStats() {
        console.log("Handling hero stats");
    }

    init() {
        if (this.uiIsLoaded) return;

        this.UI_ELEMENTS = [...UI_ELEMENTS_DATA];

        this.clearDOM();
        this.removeLoadingBackground();

        this.generateUiElements();

        this.createGameCanvas();
        this.createMinimapCanvas();
        this.getLogBook();

        this.ACTION_BAR = new ActionBar();

        this.resizeCanvas();
        
        EVENT_MANAGER.initListeners();
    }
    removeLoadingBackground() {
        document.body.style.backgroundImage = "";
    }
    clearDOM() {
        document.body.innerHTML = "";
    }
    generateUiElements() {
        this.UI_ELEMENTS.forEach((UI_EL, i) => {
            if (UI_EL.hasComponent) return; //return generateUiComponent(UI_EL);
            new Window(UI_EL);
        })
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
            default:
                console.log("No component for % has been found", data.name);
            break;
        }

        this.UI = {...this.UI, [data.name]: component};
    }
    generateUiElementHeader(el, name, key, id) {
        const headerIconBox = ElUtils.createBox(`${name}_icon_div`);

        headerIconBox.appendChild(this.createUiElementIcon(name, id))

        const headerTextSpan = document.createElement("span");
        headerTextSpan.classList.add("translate_txt");
        headerTextSpan.setAttribute("transl_key", key);

        el.appendChild(headerIconBox);
        el.appendChild(headerTextSpan);
    }
    createUiObject({icon}, box, id) {
        return {
            id,
            name: icon,
            box
        }
    }
    createUiElementIcon(name, id) {
        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/uiIcon/${name}_normal.png`;
        //icon.setAttribute("for", UI_DATA.controllers[i].type);
        icon.setAttribute("elementID", id);
        //icon.addEventListener("click", (ev) => UIcls.handleControllerClick(ev));

        return icon
    }
    getUiElement(id) {
        return this.UI[id];
    }
    // spacemap canvas func
    resizeCanvas() {
        this.CANVAS.width = window.innerWidth;
        this.CANVAS.height = window.innerHeight;
        halfScreenWidth = Number(this.CANVAS.width) / 2;
        halfScreenHeight = Number(this.CANVAS.height) / 2;
        screenWidth = this.CANVAS.width;
        screenHeight = this.CANVAS.height;
        this.resizeMinimap();
    }
    cleanup() {
        ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    }
    updateGameLightLevel() {
        if (this.lightLevel > 1) this.lightLevel = 1;
        if (this.lightLevel < 0) this.lightLevel = 0;
        this.CANVAS.style.opacity = this.lightLevel;
    }
    reqFullScreen() {
        if (!this.isFullscreen) {
          this.isFullscreen = true;
          document.body.requestFullscreen();
        } else {
          this.isFullscreen = false;
          document.exitFullscreen();
        }
    }
    // minimap canvas func
    resizeMinimap() { //remove magic numbers
        const scaleX = 21;
        const scaleY = 13;
        const offset = 0.2;
        let width = document.querySelector(".spacemap").getBoundingClientRect()
          .width;
        let height = (width / scaleX) * scaleY;
    
        let offsetX = width * offset;
        let offsetY = height * offset;
        this.MINIMAP_C.width = width - offsetX;
        this.MINIMAP_C.height = height - offsetY;
    }
    //log func
    focusLastLogMsg() {
        this.LOG.lastChild.scrollIntoView();
    }
    writeToLog(msg, isTranslate = false) {
        let msgBox = document.createElement("span");
        msgBox.innerText = isTranslate ? TEXT_TRANSLATIONS[msg] : msg;

        this.LOG.appendChild(msgBox);

        this.focusLastLogMsg();
    }
    //conn func
    generateConn() {
        if (this.CONN_BOX) return;

        const name = "lost_connection";
        const key = "connection_label";

        this.CONN_BOX = ElUtils.createBox("server_connect");

        const headerBox = ElUtils.createBox([
            "server_connect_header",
            "header",
            "header_active",
        ]);
        const mainBox = ElUtils.createBox("server_connect_main");

        this.CONN_BOX.appendChild(headerBox);
        this.CONN_BOX.appendChild(mainBox);

        mainBox.innerHTML = `
        <img class="server_connect_icon">
        <div class="server_connect_txt"></div>
        `;

        this.generateUiElementHeader(headerBox, name, key, null);

        document.body.appendChild(this.CONN_BOX);
    }
    populateConnBox(status) {
        const useBtns = [
            ["try_again", "cancel"],
            []
        ]
        const statusStrings = ["inactive", "active"];

        const index = status ? 1 : 0;

        const btnList = useBtns[index];

        const iconEl = document.querySelector(".server_connect_icon");
        const txtEl = document.querySelector(".server_connect_txt");

        if (iconEl) iconEl.src = `./spacemap/ui/connection/${statusStrings[index]}.png`; //this is terrible way of doing this
        if (txtEl) txtEl.innerHTML = `<p class="translate_txt" transl_key="${`conn_${statusStrings[index]}`}"></p>`;

        LANGUAGE_MANAGER.translateGame(true);

        if (btnList.length <= 0) return;
        
        const btnBox = ElUtils.createBox("server_connect_btn_box")

        btnList.forEach((cls, i) => {
            const id = `${index}_${i}`;
            const html = TEXT_TRANSLATIONS[cls];
            const btn = ElUtils.createButton(cls, id, html);
            
            btn.addEventListener("click", ev => SOCKET.handleReconnectAction(cls));

            btnBox.appendChild(btn);
        })

        txtEl.appendChild(btnBox);
    }
}