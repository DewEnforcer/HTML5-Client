class Client {
  constructor() {
    this.CANVAS = null;
    this.LOG = null;
    this.MINIMAP_C = null;
    this.MINIMAP_TEXT = null;
    this.MINIMAP_CTX = null;
    this.uiLoaded = false;
    this.maxSlots = 10;
  }
  generateElements() {
    if (this.uiLoaded) return;
    this.CANVAS = document.createElement("canvas");
    this.CANVAS.id = "gamemap";
    this.CANVAS.classList.add("canvas");
    ctx = this.CANVAS.getContext("2d");
    document.body.innerHTML = `<div class="userinfo"></div><div class="shipinfo"></div><div class="actionbar"></div><div class="spacemap"></div><div class="logbox"></div>`; //<div class="btns_wrapper_right"></div>`;
    document.body.appendChild(this.CANVAS);
    document.querySelector(
      ".userinfo"
    ).innerHTML = `<div class="userinfo_header header"></div><div class="userinfo_main main"></div>`;
    document.querySelector(
      ".shipinfo"
    ).innerHTML = `<div class="shipinfo_header header"></div><div class="shipinfo_main main"></div>`;
    document.querySelector(
      ".spacemap"
    ).innerHTML = `<div class="spacemap_header header"></div><div class="spacemap_main main"></div>`;
    this.LOG = document.createElement("div");
    this.LOG.classList.add("log_main", "main");
    document.querySelector(
      ".logbox"
    ).innerHTML = `<div class="log_header header"></div>`;
    document.querySelector(".logbox").appendChild(this.LOG);
    $(".userinfo_header").html(
      `<img src="./spacemap/ui/usericon.png"> <span>User</span>`
    );
    $(".shipinfo_header").html(
      `<img src="./spacemap/ui/iconship.png"> <span>Ship</span>`
    );
    $(".spacemap_header").html(`<span>Spacemap</span>`);
    this.MINIMAP_TEXT = document.createElement("div");
    this.MINIMAP_TEXT.classList.add("spacemap_coordinates_wrapper");
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_TEXT);
    this.MINIMAP_C = document.createElement("canvas");
    this.MINIMAP_C.id = "minimap";
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_C);
    this.MINIMAP_CTX = this.MINIMAP_C.getContext("2d");
    $(".log_header").html(`<span>Log-Index</span>`);
    for (var i = 1; i <= this.maxSlots; i++) {
      $(".actionbar").append(`<div class="slot_actionbar" id="${i}"></div>`);
    }
    this.uiLoaded = true;
    this.resizeCanvas();
    EVENT_MANAGER.initListeners();
    this.generateShipInfoElements();
  }
  resizeCanvas() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
    halfScreenWidth = Number(this.CANVAS.width) / 2;
    halfScreenHeight = Number(this.CANVAS.height) / 2;
    this.resizeMinimap();
  }
  resizeMinimap() {
    let offsetX = 20;
    let offsetY = 30;
    this.MINIMAP_C.width = Number($(".spacemap_main").width()) - offsetX;
    this.MINIMAP_C.height = Number($(".spacemap_main").height()) - offsetY;
  }
  initHero(data) {
    this.generateElements();
    data.splice(0, 2);
    HERO = new Hero(...data);
    initiatePostHero();
  }
  generateShipInfoElements() {
    const elements = [
      { name: "HP", isBar: true },
      { name: "SHD", isBar: true },
      { name: "CFG", isBar: false },
      { name: "CARGO", isBar: true },
      { name: "SPEED", isBar: false },
    ];
    const target = document.querySelector(".shipinfo_main");
    elements.forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(`${el.name}_wrapper`);
      const textRepr = document.createElement("span");
      textRepr.innerText = 0;
      textRepr.id = `${el.name}_text`;
      wrapper.appendChild(textRepr);
      if (el.isBar) {
        const visualRepr = document.createElement("div");
        visualRepr.id = `${el.name}_visual_wrapper`;
        const visualReprBar = document.createElement("div");
        visualReprBar.id = `${el.name}_visual_bar`;
        visualRepr.appendChild(visualReprBar);
        wrapper.appendChild(visualRepr);
        wrapper.addEventListener("click", (
          ev //triggers only on isBar elements
        ) => EVENT_MANAGER.handleInfoVisualChange(ev));
      }
      target.appendChild(wrapper);
    });
  }
  generateUserInfoElements() {}
  writeToLog(msg, isTranslate = false) {
    if (isTranslate) {
      msg = TEXT_TRANSLATIONS[msg];
    }
    let msgBox = document.createElement("span");
    msgBox.innerText = msg;
    this.LOG.appendChild(msgBox);
  }
  cleanup() {
    ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
  }
  generateConn(msg) {
    $(".server_connect").remove();
    $("body").append(`<div class='server_connect'><p>${msg}</p></div>`);
  }
}
