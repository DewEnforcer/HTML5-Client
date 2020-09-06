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
    this.clearDOM();
    const els = [
      {
        cls: "shipinfo",
        children: ["header", "main"],
        icon: "ship",
        txt: "ship_label",
      },
      {
        cls: "userinfo",
        children: ["header", "main"],
        icon: "user",
        txt: "user_label",
      },
      {
        cls: "spacemap",
        children: ["header", "main"],
        icon: "minimap",
        txt: "minimap_label",
      },
      {
        cls: "log",
        children: ["header", "main"],
        icon: "log",
        txt: "log_label",
      },
    ];
    if (this.uiLoaded) return;
    this.CANVAS = document.createElement("canvas");
    this.CANVAS.id = "gamemap";
    this.CANVAS.classList.add("canvas");
    ctx = this.CANVAS.getContext("2d");
    document.body.appendChild(this.CANVAS);
    els.forEach((elUi) => {
      const elDOM = document.createElement("div");
      elDOM.classList.add(elUi.cls);
      const children = [];
      elUi.children.forEach((child, i) => {
        children.push(document.createElement("div"));
        children[i].classList.add(`${elUi.cls}_${child}`, `${child}`);
      });
      children[0].innerHTML = `<div><img src="./spacemap/ui/uiIcon/${
        elUi.icon
      }_normal.png"></div><span>${TEXT_TRANSLATIONS[elUi.txt]}</span>`;
      for (let i = 0; i < children.length; i++) {
        //rework in later patch
        elDOM.appendChild(children[i]);
      }
      document.body.appendChild(elDOM);
      this.dragElement(children[0], elDOM); //trigger, target
    });
    this.LOG = document.querySelector(".log_main");
    this.MINIMAP_TEXT = document.createElement("div");
    this.MINIMAP_TEXT.classList.add("spacemap_coordinates_wrapper");
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_TEXT);
    this.MINIMAP_C = document.createElement("canvas");
    this.MINIMAP_C.id = "minimap";
    document.querySelector(".spacemap_main").appendChild(this.MINIMAP_C);
    this.MINIMAP_CTX = this.MINIMAP_C.getContext("2d");
    this.uiLoaded = true;
    this.actionBar = new ActionBar();
    this.resizeCanvas();
    EVENT_MANAGER.initListeners();
  }
  clearDOM() {
    document.body.innerHTML = "";
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
    this.handleShipInfoData("EP", 100000);
    this.handleShipInfoData("LVL", 1);
    this.handleShipInfoData("HON", 100);
    this.handleShipInfoData("CRED", 500000);
    this.handleShipInfoData("URI", 5000);
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
    const serverConnBox = document.querySelector(".server_connect");
    if (serverConnBox != null) serverConnBox.remove();
    document.body.innerHTML += `<div class='server_connect'><p>${msg}</p></div>`;
  }
  fadeIn(
    minFade,
    maxFade,
    fadeDuration,
    el,
    fadeTick = 0.2,
    setDisplay = false
  ) {
    const fadePerTick = fadeTick;
    const interval = fadeDuration / ((maxFade - minFade) / fadePerTick);
    let opacity = minFade;
    function callback() {
      el.style.display = "flex";
    }
    let intervalF = setInterval(() => {
      if (opacity >= maxFade) {
        clearInterval(intervalF);
        if (setDisplay) callback();
        return;
      }
      opacity += fadePerTick;
      el.style.opacity = opacity;
    }, interval);
  }
  fadeOut(
    minFade,
    maxFade,
    fadeDuration,
    el,
    fadeTick = 0.2,
    setDisplay = false
  ) {
    const fadePerTick = fadeTick;
    const interval = fadeDuration / ((maxFade - minFade) / fadePerTick);
    let opacity = maxFade;
    function callback() {
      el.style.display = "none";
    }
    let intervalF = setInterval(() => {
      if (opacity <= minFade) {
        clearInterval(intervalF);
        if (setDisplay) callback();
        return;
      }
      opacity -= fadePerTick;
      el.style.opacity = opacity;
    }, interval);
  }
  dragElement(elmnt, target) {
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      //add mouse offset to prevent element moving to 0,0 of mouse, add position save to server
      e = e || window.event;
      e.preventDefault();
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      target.style.top = e.clientY + "px";
      target.style.left = e.clientX + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  pixelToView(px, isW = true) {
    px = Number(px.split("p")[0]);
    if (isW) {
      return Math.round((px / screenWidth) * 100) + "vw";
    } else {
      return Math.round((px / screenHeight) * 100) + "vh";
    }
  }
}
