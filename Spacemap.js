class Spacemap {
  constructor() {
    this.showcasedSector = 0;
    this.selectedJumpMap = null;
    this.currentMap = HERO.mapID;
    this.levelLockedMaps = [];
    this.blockedMaps = [];
    this.avalMaps = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
    ];
    this.mapSizes = [
      [621, 427],
      [710, 432],
    ];
    this.mapPlacement = [
      [
        [0, 185],
        [107, 185],
        [204, 136],
        [204, 235],
        [506, 0],
        [408, 38],
        [303, 87],
        [508, 97],
        [506, 375],
        [407, 326],
        [508, 192],
        [301, 283],
        [302, 182],
        [398, 151],
        [401, 219],
      ],
      [
        [272, 138],
        [164, 171],
        [84, 107],
        [84, 238],
        [0, 171],
        [506, 131],
        [506, 43],
        [619, 93],
        [619, 0],
        [487, 269],
        [519, 363],
        [594, 269],
        [628, 363],
        [230, 297],
        [202, 60],
        [296, 18],
        [388, 60],
      ],
    ];
    this.mapsWrapper = null;
    this.jumpPrice = 0;
    this.window = document.querySelector(".spacemap_ov_main");
    this.isJumping = false;
    this.jumpAval = false;
    this.genUI();
  }
  genUI() {
    this.genMapsBox();
    this.setMapConnectors();
    this.genMaps();
    this.genControlPanelLayout();
    this.setMapStates();
  }
  setMapConnectors() {
    const stdHeight = 435;
    this.mapsWrapper.style.backgroundImage = `url("../spacemap/ui/spacejump/${this.showcasedSector}.png")`;
    this.mapsWrapper.style.width =
      this.mapSizes[this.showcasedSector][0] + "px";
    this.mapsWrapper.style.margin = `${
      stdHeight - this.mapSizes[this.showcasedSector][1]
    }px 0`;
  }
  genMapsBox() {
    this.mapsWrapper = MAIN.createBox("spacemap_ov_map_wrapper");
    this.window.appendChild(this.mapsWrapper);
    const btnSwitchSector = document.createElement("span");
    btnSwitchSector.classList.add(
      "btn_switch_sector_spacejump",
      "translate_txt"
    );
    btnSwitchSector.innerText =
      TEXT_TRANSLATIONS["sector_switch_" + this.showcasedSector];
    btnSwitchSector.setAttribute(
      "transl_key",
      "sector_switch_" + this.showcasedSector
    );
    btnSwitchSector.onclick = (ev) => this.handleSectorSwitch(ev);
    this.window.appendChild(btnSwitchSector);
  }
  genControlPanelLayout() {
    const cntrlPanelWrapper = MAIN.createBox("spacemap_ov_control_wrapper");
    const cntrlPanelHeader = MAIN.createBox("spacemap_ov_control_header");
    const cntrlPanelBody = MAIN.createBox("spacemap_ov_control_body");
    cntrlPanelWrapper.appendChild(cntrlPanelHeader);
    cntrlPanelWrapper.appendChild(cntrlPanelBody);
    this.window.appendChild(cntrlPanelWrapper);
    this.genControlPanel();
  }
  genControlPanel() {
    //gen current/jump map
    const targetWrapper = MAIN.createBox("spacemap_ov_control_target");
    // TODO add id to easy select
    targetWrapper.innerHTML = `<div><span class="translate_txt" transl_key="spacemap_target_currmap">${TEXT_TRANSLATIONS.spacemap_target_currmap}</span><span class="translate_txt" transl_key="spacemap_target_jumpmap">${TEXT_TRANSLATIONS.spacemap_target_jumpmap}</span></div>`;
    //gen x map-> y map display
    const targetVisualWrapper = MAIN.createBox(
      "spacemap_ov_control_targetVisual"
    );
    targetVisualWrapper.innerHTML = `<div><span id="spacejump_span_currmap">${
      MAP_OBJECTS_LIST[this.currentMap].name
    }</span><span id="spacejump_span_jumpmap">${
      this.selectedJumpMap != null
        ? MAP_OBJECTS_LIST[this.selectedJumpMap].name
        : "None"
    }</span></div>`;
    const priceBox = MAIN.createBox("spacemap_ov_control_pricebox");
    priceBox.innerHTML = `<div><span id="pricebox_txt">${this.jumpPrice} U.</span></div>`;
    const btnJump = document.createElement("button");
    btnJump.classList.add("spacemap_ov_control_jump", "translate_txt");
    btnJump.setAttribute("transl_key", "jump_start");
    btnJump.innerText = TEXT_TRANSLATIONS.jump_start;
    btnJump.onclick = (ev) => this.handleJumpEvent(ev);
    const body = document.querySelector(".spacemap_ov_control_body");
    if (body != null) {
      body.appendChild(targetWrapper);
      body.appendChild(targetVisualWrapper);
      body.appendChild(priceBox);
      body.appendChild(btnJump);
    }
  }
  genMaps() {
    const mapIdOffset = 15 * this.showcasedSector;
    this.cleanupMapsBox();
    MAP_OVERVIEW_LIST[this.showcasedSector].forEach((map, i) => {
      let mapID = i + mapIdOffset + 1;
      const mapNode = MAIN.createBox("map_representation");
      if ("isBig" in map === true && map["isBig"]) {
        mapNode.classList.add("map_representation_big");
      }
      mapNode.style.backgroundImage = `url("./spacemap/ui/spacejump/map${mapID}.png")`;
      mapNode.style.left = this.mapPlacement[this.showcasedSector][i][0] + "px";
      mapNode.style.top = this.mapPlacement[this.showcasedSector][i][1] + "px";
      mapNode.setAttribute("mapID", mapID);
      mapNode.onclick = (ev) => this.handleMapSelect(ev);
      this.mapsWrapper.appendChild(mapNode);
    });
    this.selectCurrentMap();
  }
  cleanupMapsBox() {
    this.mapsWrapper.innerHTML = "";
  }
  //selectors
  selectCurrentMap() {
    const cls = "current_map_location"; //remove previous curr map
    const currMapNode = document.querySelector("." + cls); //select the box
    if (currMapNode != null) {
      currMapNode.classList.remove(cls); //remove the selection
      currMapNode.querySelector("img").remove(); //remove icon
    }
    const mapNode = document.querySelector("[mapID='" + this.currentMap + "']");
    if (mapNode == null) return; //add new curr map
    mapNode.classList.remove("map_locked");
    mapNode.classList.add(cls);
    const icon = document.createElement("img");
    icon.src = `./spacemap/ui/spacejump/currMap.png`;
    icon.classList.add("icon_spacejump");
    mapNode.appendChild(icon);
  }
  selectJumpMap() {
    const cls = "current_jump_location"; //remove previous curr map
    const currMapNode = document.querySelector("." + cls); //select the box
    if (currMapNode != null) {
      currMapNode.classList.remove(cls); //remove the selection
      currMapNode.querySelector("img").remove(); //remove icon
    }
    const mapNode = document.querySelector(
      "[mapID='" + this.selectedJumpMap + "']"
    );
    if (mapNode == null) return; //add new curr map
    mapNode.classList.remove("map_locked");
    mapNode.classList.add(cls);
    const icon = document.createElement("img");
    icon.src = `./spacemap/ui/spacejump/iconSelMap.png`;
    icon.classList.add("icon_spacejump");
    mapNode.appendChild(icon);
  }
  setMapStates() {
    this.blockedMaps.forEach((mapID) => this.addMapStateIcon(mapID, "blocked"));
    this.levelLockedMaps.forEach((mapID) =>
      this.addMapStateIcon(mapID, "levelLocked")
    );
    this.avalMaps.forEach((mapID) => {
      //clear aval maps
      if (mapID == this.currentMap) return;
      const mapNode = document.querySelector("[mapID='" + mapID + "']");
      if (mapNode == null) return;
      mapNode.classList.remove("map_locked");
      const prevIcon = mapNode.querySelector("img");
      if (prevIcon != null) prevIcon.remove();
    });
  }
  addMapStateIcon(mapID, state) {
    if (mapID == this.currentMap) return;
    const mapNode = document.querySelector("[mapID='" + mapID + "']");
    if (mapNode == null) return;
    mapNode.classList.add("map_locked");
    const prevIcon = mapNode.querySelector("img");
    if (prevIcon != null) prevIcon.remove();
    const icon = document.createElement("img");
    icon.src = `./spacemap/ui/spacejump/${state}.png`;
    icon.classList.add("icon_spacejump");
    mapNode.appendChild(icon);
  }
  setBtnChangeSectorText() {
    const btnSwitchSector = document.querySelector(
      ".btn_switch_sector_spacejump"
    );
    if (btnSwitchSector == null) return;
    btnSwitchSector.innerText =
      TEXT_TRANSLATIONS["sector_switch_" + this.showcasedSector];
  }
  updateMapInfo() {
    const currMap = document.getElementById("spacejump_span_currmap");
    const jumpMap = document.getElementById("spacejump_span_jumpmap");
    currMap.innerText = MAP_OBJECTS_LIST[this.currentMap].name;
    jumpMap.innerText = MAP_OBJECTS_LIST[this.selectedJumpMap].name;
  }
  updateJumpCountdown(timeLeft, el) {
    el.innerText = timeLeft;
  }
  updateJumpAval() {
    this.jumpAval =
      this.selectedJumpMap != null && this.selectedJumpMap != this.currentMap;
    const btn = document.querySelector(".spacemap_ov_control_jump");
    if (btn == null) return;
    if (this.jumpAval) {
      btn.classList.add("jump_btn_active");
    } else {
      btn.classList.remove("jump_btn_active");
    }
  }
  //animations
  removeJumpAnimation(el, txtEl) {
    el.remove();
    txtEl.remove();
  }
  handleJumpSpinner(el, angle) {
    angle += 10;
    el.style.transform = `rotate(${angle}deg)`;
    return angle;
  }
  addJumpAnimation() {
    const icon = document.createElement("img");
    icon.src = `./spacemap/ui/spacejump/iconSelMap.png`;
    icon.classList.add("icon_spacejump", "jump_spinner_icon");
    const textEl = document.createElement("span");
    textEl.classList.add("text_spacejump");
    const mapNode = document.querySelector(
      "[mapID='" + this.selectedJumpMap + "']"
    );
    if (mapNode != null) {
      mapNode.querySelector("img").remove();
      mapNode.appendChild(icon);
      mapNode.appendChild(textEl);
    }
    return [icon, textEl];
  }
  //countdowns
  initJumpCountdown(time, spinEl, timeEl) {
    if (this.isJumping) return;
    this.isJumping = true;
    let timeLeft = time * 1000;
    let realTime = time;
    let angle = 0;
    let x = setInterval(() => {
      if (angle >= 360) angle = 0;
      timeLeft -= 100;
      if (timeLeft % 1000 == 0) realTime -= 1;
      this.updateJumpCountdown(realTime, timeEl);
      angle = this.handleJumpSpinner(spinEl, angle);
      if (timeLeft <= 0 || !this.isJumping) {
        MAIN.writeToLog("advanced_jump_finished", true);
        this.removeJumpAnimation(spinEl, timeEl);
        clearInterval(x);
        this.isJumping = false;
        return;
      }
    }, 100);
  }
  // handlers
  handlePriceChange(newPrice) {
    const priceBox = document.getElementById("pricebox_txt");
    priceBox.innerText = newPrice + " U.";
  }
  handleJumpInit(data) {
    data = trimData(data);
    if (data[0] == 0) {
      if (this.isJumping) {
        this.handleJumpCancelled();
      }
      return;
    }
    //TODO connect to server , add texts
    //time in ms
    let elements = this.addJumpAnimation();
    let spinEl = elements[0];
    let timeEl = elements[1];
    MAIN.writeToLog("advanced_jump_init", true);
    this.initJumpCountdown(Number(data[1]), spinEl, timeEl);
  }
  handleJumpCancelled() {
    this.isJumping = false;
    MAIN.writeToLog("advanced_jump_cancel", true);
  }
  handleSectorSwitch(ev) {
    let newSector = 1;
    if (this.showcasedSector == 1) newSector = 0;
    this.showcasedSector = newSector;
    this.setMapConnectors();
    this.genMaps();
    this.setMapStates();
    this.setBtnChangeSectorText();
    this.selectJumpMap();
  }
  handleMapSelect(ev) {
    const el = ev.currentTarget;
    const newMapID = Number(el.getAttribute("mapID"));
    if (
      newMapID == this.currentMap ||
      newMapID == this.selectedJumpMap ||
      !this.avalMaps.includes(newMapID)
    ) {
      return;
    }
    this.selectedJumpMap = newMapID;
    this.updateMapInfo();
    this.selectJumpMap();
    this.updateJumpAval();
    SOCKET.sendPacket([REQUEST_ADVANCED_JUMP_PRICE, this.selectedJumpMap]);
  }
  handleJumpEvent() {
    if (this.isJumping || HERO.loggingOut || !this.jumpAval) return;
    const packetCollection = [REQUEST_ADVANCED_JUMP, this.selectedJumpMap];
    SOCKET.sendPacket(packetCollection);
  }
}
