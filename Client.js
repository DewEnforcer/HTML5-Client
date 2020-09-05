class Client {
  constructor() {
    this.CANVAS = null;
    this.LOG = null;
    this.MINIMAP_C = null;
    this.MINIMAP_TEXT = null;
    this.MINIMAP_CTX = null;
    this.uiLoaded = false;
    this.shipInfoStatus = {};
    this.actionBar = null;
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
      `<div><img src="./spacemap/ui/iconuser.png"></div> <span>User</span>`
    );
    $(".shipinfo_header").html(
      `<div><img src="./spacemap/ui/iconship.png"></div> <span>Ship</span>`
    );
    $(".spacemap_header").html(
      `<div><img src="./spacemap/ui/iconminimap.png"></div><span>Spacemap</span>`
    );
    this.MINIMAP_TEXT = document.createElement("div");
    this.MINIMAP_TEXT.classList.add("spacemap_coordinates_wrapper");
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_TEXT);
    this.MINIMAP_C = document.createElement("canvas");
    this.MINIMAP_C.id = "minimap";
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_C);
    this.MINIMAP_CTX = this.MINIMAP_C.getContext("2d");
    $(".log_header").html(
      `<div><img src="./spacemap/ui/iconlog.png"></div><span>Log-Index</span>`
    );
    //TODO ADD ACTION BAR CLASS INIT
    this.uiLoaded = true;
    this.actionBar = new ActionBar();
    this.resizeCanvas();
    EVENT_MANAGER.initListeners();
    this.generateInfoElements("shipinfo", "shipInfo", "ship_info");
    this.generateInfoElements("userinfo", "userInfo", "user_info");
  }
  resizeCanvas() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
    halfScreenWidth = Number(this.CANVAS.width) / 2;
    halfScreenHeight = Number(this.CANVAS.height) / 2;
    screenWidth = this.CANVAS.width;
    screenHeight = this.CANVAS.height;
    this.resizeMinimap();
  }
  resizeMinimap() {
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
  initHero(data) {
    this.generateElements();
    data.splice(0, 2);
    HERO = new Hero(...data);
    CAMERA = new Camera(HERO.ship);
    initiatePostHero();
    //init values
    this.handleShipInfoData("HP", HERO.ship.HP, HERO.ship.maxHP);
    this.handleShipInfoData("SHD", HERO.ship.SHD, HERO.ship.maxSHD);
    this.handleShipInfoData("SPEED", HERO.speed, 0);
    this.handleShipInfoData("CFG", HERO.config, 0);
  }
  generateInfoElements(className, jsonName, dir) {
    const target = document.querySelector("." + className + "_main");
    elements[jsonName].forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(
        `${el.name}_wrapper`,
        "wrapper_main_" + className + ""
      );
      if (el.icon != null) {
        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/${dir}/${el.icon}.png`;
        icon.id = `${el.name}_icon`;
        icon.classList.add("icon_info");
        wrapper.appendChild(icon);
      }
      const textRepr = document.createElement("span");
      textRepr.innerText = 0;
      textRepr.id = `${el.name}_text`;
      wrapper.appendChild(textRepr);
      if (el.isBar) {
        this.shipInfoStatus = { ...this.shipInfoStatus, [el.name]: false };
        const visualRepr = document.createElement("div");
        visualRepr.id = `${el.name}_visual_wrapper`;
        visualRepr.classList.add("visual_wrapper");
        const visualReprBar = document.createElement("div");
        visualReprBar.id = `${el.name}_visual_bar`;
        visualReprBar.style.backgroundColor = el.color;
        visualRepr.appendChild(visualReprBar);
        wrapper.appendChild(visualRepr);
        wrapper.addEventListener("click", (
          ev //triggers only on isBar elements
        ) => EVENT_MANAGER.handleInfoVisualChange(ev));
      }
      target.appendChild(wrapper);
    });
  }
  handleShipInfoData(section, value, maxValue = 0) {
    let text = document.querySelector("#" + section + "_text");
    text.innerText = numberFormated(value); //add formatting
    let visualBar = document.querySelector("#" + section + "_visual_bar");
    if (visualBar != null) {
      visualBar.style.width = (value / maxValue) * 100 + "%";
    }
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
  fadeIn(minFade, maxFade, fadeDuration, el, fadeTick = 0.2) {
    const fadePerTick = fadeTick;
    const interval = fadeDuration / ((maxFade - minFade) / fadePerTick);
    let opacity = minFade;
    let intervalF = setInterval(() => {
      if (opacity >= maxFade) {
        clearInterval(intervalF);
        return;
      }
      opacity += fadePerTick;
      el.style.opacity = opacity;
    }, interval);
  }
  fadeOut(minFade, maxFade, fadeDuration, el, fadeTick = 0.2) {
    const fadePerTick = fadeTick;
    const interval = fadeDuration / ((maxFade - minFade) / fadePerTick);
    let opacity = maxFade;
    let intervalF = setInterval(() => {
      if (opacity <= minFade) {
        clearInterval(intervalF);
        return;
      }
      opacity -= fadePerTick;
      el.style.opacity = opacity;
    }, interval);
  }
}
