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
    this.isFullscreen = false;
    this.lightLevel = 1;
  }
  generateElements() {
    this.clearDOM();
    const els = [
      {
        cls: "log",
        children: ["header", "main"],
        icon: "log",
        txt: "log_label",
      },
      {
        cls: "userinfo",
        children: ["header", "main"],
        icon: "user",
        txt: "user_label",
      },
      {
        cls: "shipinfo",
        children: ["header", "main"],
        icon: "ship",
        txt: "ship_label",
      },
      {
        cls: "spacemap",
        children: ["header", "main"],
        icon: "minimap",
        txt: "minimap_label",
      },
      {
        cls: "settings",
        children: ["header", "main"],
        icon: "settings",
        txt: "settings_label",
      },
      {
        cls: "spacemap_ov",
        children: ["header", "main"],
        icon: "spacemap",
        txt: "spacemap_label",
      },
    ];
    if (this.uiLoaded) return;
    this.CANVAS = document.createElement("canvas");
    this.CANVAS.id = "gamemap";
    this.CANVAS.classList.add("canvas");
    ctx = this.CANVAS.getContext("2d");
    document.body.appendChild(this.CANVAS);
    document.body.style.backgroundImage = 'url("")';
    els.forEach((elUi, i) => {
      const elDOM = document.createElement("div");
      elDOM.classList.add(elUi.cls);
      const children = [];
      elUi.children.forEach((child, i) => {
        children.push(document.createElement("div"));
        children[i].classList.add(`${elUi.cls}_${child}`, `${child}`);
      });
      const icon = document.createElement("img");
      icon.src = `./spacemap/ui/uiIcon/${elUi.icon}_normal.png`;
      icon.setAttribute("for", UI_DATA.controllers[i].type);
      icon.setAttribute("index", i);
      icon.addEventListener("click", (ev) => UIcls.handleControllerClick(ev));
      children[0].innerHTML = `<div class="${elUi.icon}_icon_div"></div><span class="translate_txt" transl_key="${elUi.txt}"></span>`;
      for (let i = 0; i < children.length; i++) {
        //rework in later patch
        elDOM.appendChild(children[i]);
      }
      document.body.appendChild(elDOM);
      document.querySelector("." + elUi.icon + "_icon_div").appendChild(icon);
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
    this.updateGameLightLevel();
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
  initHero(data) {
    this.generateElements();
    data.splice(0, 2);
    HERO = new Hero(...data);
    CAMERA = new Camera(HERO.ship);
    initiatePostHero();
    //init values
    this.updateHeroStats();
  }
  updateHeroStats() {
    this.handleShipInfoData("HP", HERO.ship.HP, HERO.ship.maxHP);
    this.handleShipInfoData("SHD", HERO.ship.SHD, HERO.ship.maxSHD);
    this.handleShipInfoData("SPEED", HERO.speed, 0);
    this.handleShipInfoData("CFG", HERO.config, 0);
  }
  generateInfoElements(className, jsonName, dir) {
    const target = document.querySelector("." + className + "_main");
    UI_DATA.elements[jsonName].forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(
        `${el.name}_wrapper`,
        "wrapper_main_" + className + ""
      );
      const icon = document.createElement("img");
      if (el.icon != null) {
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
      //add event listeners
      switch (el.name) {
        case "CFG":
          icon.addEventListener("click", () => {
            HERO.changeConfigRequest();
          });
          break;
      }
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
  writeToLog(msg, isTranslate = false) {
    if (isTranslate) {
      msg = TEXT_TRANSLATIONS[msg];
    }
    let msgBox = document.createElement("span");
    msgBox.innerText = msg;
    this.LOG.appendChild(msgBox);
    this.focusLastLogMsg();
  }
  focusLastLogMsg() {
    this.LOG.lastChild.scrollIntoView();
  }
  cleanup() {
    ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
  }
  setNewLanguage(newLang) {
    if (newLang in langNameToKey !== true) return;
    const newLangKey = langNameToKey[newLang];
    if (newLangKey != CURRENT_LANGUAGE) CURRENT_LANGUAGE = newLangKey;
    SETTINGS.manageLoadingState();
    Fetcher.fetchTranslations(this.translateGame);
  }
  translateGame(isInit = false) {
    document.querySelectorAll(".translate_txt").forEach((el) => {
      const key = el.getAttribute("transl_key");
      if (key in TEXT_TRANSLATIONS !== true) {
        el.innerText = key;
        return;
      }
      el.innerText = TEXT_TRANSLATIONS[key];
    });
    if (isInit) return;
    SETTINGS.manageLoadingState(false);
  }
  generateConn() {
    const prevBox = document.querySelector(".server_connect");
    if (prevBox != null) prevBox.remove();
    const serverConnBox = this.createBox("server_connect");
    const header = this.createBox([
      "server_connect_header",
      "header",
      "header_active",
    ]);
    const body = this.createBox(["server_connect_main"]);
    serverConnBox.appendChild(header);
    serverConnBox.appendChild(body);
    const headerIcon = `<img src="./spacemap/ui/uiIcon/lost_connection_normal.png">`;
    header.innerHTML += "<div>" + headerIcon + "</div>";
    header.innerHTML += `<span>${TEXT_TRANSLATIONS["connection_label"]}</span>`;
    const icon = document.createElement("img");
    icon.classList.add("server_connect_icon");
    body.appendChild(icon);
    body.appendChild(this.createBox("server_connect_txt"));
    document.body.appendChild(serverConnBox);
  }
  changeConnStatus(status) {
    const index = status ? 1 : 0;
    const bnts = [["try_again", "cancel"], []];
    let statusString = "active";
    if (!status) {
      statusString = "inactive";
    }
    document.querySelector(".server_connect_icon").src =
      "./spacemap/ui/connection/" + statusString + ".png";
    document.querySelector(".server_connect_txt").innerHTML =
      TEXT_TRANSLATIONS["conn_" + statusString] +
      `<div class="server_connect_btn_box"></div>`;
    bnts[index].forEach((cls, i) => {
      const btn = document.createElement("button");
      btn.classList.add("btn_server_conn");
      btn.innerText = TEXT_TRANSLATIONS[cls];
      btn.id = `${index}_${i}`;
      btn.addEventListener("click", (ev) => SOCKET.handleConnBtn(ev));
      document.querySelector(".server_connect_btn_box").appendChild(btn);
    });
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
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      target.style.top = target.offsetTop - pos2 + "px";
      target.style.left = target.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      UIcls.saveUiPos();
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
  createBox(cls, id = "") {
    const box = document.createElement("div");
    if (typeof cls == "object") {
      cls.forEach((cl) => {
        box.classList.add(cl);
      });
    } else {
      box.classList.add(cls);
    }
    box.id = id;
    return box;
  }
  createCheckBox(cls, id, checked = false) {
    const checker = document.createElement("input");
    checker.type = "checkbox";
    checker.checked = checked;
    checker.classList.add(cls);
    checker.id = id;
    return checker;
  }
  createSelectBox(cls, id, options, value) {
    const select = document.createElement("select");
    select.classList.add(cls);
    select.id = id;
    options.forEach((opt) => {
      const optEL = document.createElement("option");
      optEL.value = opt;
      optEL.innerText = capitalizeString(opt);
      select.appendChild(optEL);
    });
    select.value = value;
    return select;
  }
}
