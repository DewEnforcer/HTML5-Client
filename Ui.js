class UI {
  constructor() {
    this.openWindows = [];
    this.windowAnimationDone = [];
    this.controllers = [];
    this.uiClasses = [];
    this.UiSizes = [];
    this.sizeMinX = "38px";
    this.sizeMinY = "30px";
    this.effectDuration = 300;
    this.init();
  }
  init() {
    this.generateElementsUI("shipinfo", "shipInfo", "ship_info");
    this.generateElementsUI("userinfo", "userInfo", "user_info");
    this.generateControlsUI();
  }
  generateElementsUI(className, jsonName, dir) {
    const target = document.querySelector("." + className + "_main");
    UI_DATA.elements[jsonName].forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(`${el.name}_wrapper`, "wrapper_main_" + className);
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
        visualReprBar.style.backgroundImage = `url('../spacemap/ui/${dir}/${el.name.toLowerCase()}.png')`;
        visualRepr.appendChild(visualReprBar);
        wrapper.appendChild(visualRepr);
        wrapper.addEventListener("click", (
          ev //triggers only on isBar elements
        ) => EVENT_MANAGER.handleInfoVisualChange(ev));
      }
      target.appendChild(wrapper);
    });
  }
  generateControlsUI() {
    const baseX = 25;
    const baseY = 400;
    UI_DATA.controllers.forEach((cntrl, i) => {
      this.openWindows.push(true);
      this.windowAnimationDone.push(true);
      const el = document.createElement("button");
      el.setAttribute("for", cntrl.type);
      el.setAttribute("index", i);
      el.classList.add("btn_controller_mini");
      el.style.left = baseX + cntrl.x + "px";
      el.style.top = baseY + cntrl.y + "px";
      this.uiClasses.push(cntrl.type);
      const icon = document.createElement("img");
      icon.src = `./spacemap/ui/uiIcon/${cntrl.icon}normal.png`;
      el.appendChild(icon);
      el.addEventListener("click", (ev) => this.handleControllerClick(ev));
      this.controllers.push(el);
      document.body.appendChild(el);
    });
    this.getUiSizes();
    this.setControllerStatus();
  }
  getUiSizes() {
    this.UiSizes = [];
    this.uiClasses.forEach((cls) => {
      const target = getComputedStyle(document.querySelector(`.${cls}`));
      this.UiSizes.push({ w: target.width, h: target.height });
    });
    this.convertUiSizes();
  }
  convertUiSizes() {
    this.UiSizes.forEach((uiSize, i) => {
      const x = MAIN.pixelToView(uiSize.w);
      const y = MAIN.pixelToView(uiSize.h, false);
      this.UiSizes[i] = { w: x, h: y };
    });
  }
  setControllerStatus() {
    this.openWindows.forEach((open, i) => {
      const controller = this.controllers[i];
      if (open) controller.classList.add("btn_controller_mini_open");
      else controller.classList.remove("btn_controller_mini_open");
    });
  }
  // UI effect
  sizeDown(el, index) {
    const textHeader = el.children[0].children[1];
    const UiBody = el.children[1];
    const elRes = el.getBoundingClientRect();
    const width = elRes.width + "px";
    const height = elRes.height + "px";
    //first scale down horizontally, then vertically
    MAIN.fadeOut(0, 1, 150, UiBody);
    MAIN.fadeOut(0, 1, 150, textHeader);
    el.animate([{ width }, { width: this.sizeMinX }], {
      duration: this.effectDuration,
      fill: "forwards",
    });
    el.animate([{ height }, { height: this.sizeMinY }], {
      duration: this.effectDuration,
      delay: this.effectDuration,
      fill: "forwards",
    });
    setTimeout(() => {
      MAIN.fadeOut(0, 1, 500, el, 0.1, true);
      this.windowAnimationDone[index] = true;
    }, this.effectDuration * 2);
  }
  sizeUp(el, index) {
    const textHeader = el.children[0].children[1];
    const UiBody = el.children[1];
    //first scale down horizontally, then vertically
    el.style.display = "flex";
    MAIN.fadeIn(0, 1, 500, el, 0.1);
    setTimeout(() => {
      el.animate([{ width: 0 }, { width: this.UiSizes[index].w }], {
        duration: this.effectDuration,
        fill: "forwards",
      });
      el.animate([{ height: 0 }, { height: this.UiSizes[index].h }], {
        duration: this.effectDuration,
        delay: this.effectDuration,
        fill: "forwards",
      });
      setTimeout(() => {
        MAIN.fadeIn(0, 1, 150, UiBody);
        MAIN.fadeIn(0, 1, 150, textHeader);
        this.windowAnimationDone[index] = true;
      }, this.effectDuration * 2);
    }, 500);
  }
  /* handlers */
  handleControllerClick(ev) {
    ev.preventDefault();
    const controller = ev.currentTarget;
    const controllerIndex = controller.getAttribute("index");
    if (!this.windowAnimationDone[controllerIndex]) return; //prevent animation spam
    this.windowAnimationDone[controllerIndex] = false;
    const forEl = controller.getAttribute("for");
    const target = document.querySelector("." + forEl);
    if (target != null) {
      if (this.openWindows[controllerIndex]) {
        this.sizeDown(target, controllerIndex);
      } else {
        this.sizeUp(target, controllerIndex);
      } //is open
    }
    this.openWindows[controllerIndex] = !this.openWindows[controllerIndex];
    this.setControllerStatus();
  }
  /* UI pos handlers */
  setUiPos(data) {
    data = data.split("|");
    data.forEach((uiPos, i) => {
      uiPosParsed = uiPos.split(";");
      if (uiPosParsed < 0) return;
      const uiEL = document.querySelector("." + this.uiClasses[i]);
      uiEL.style.left = uiPosParsed[0] + "px";
      uiEL.style.top = uiPosParsed[1] + "px";
    });
  }
  setUiStatus(data) {
    data.split("|");
    data.forEach((status, i) => {
      let statusParsed = !!status;
      this.openWindows[i] = statusParsed;
    });
    this.setControllerStatus();
    this.setUiStatusGraphical();
  }
  setUiStatusGraphical() {
    this.uiClasses.forEach((cls, i) => {
      const target = document.querySelector("." + cls);
      if (this.openWindows[i]) this.sizeUp(target, i);
      else this.sizeDown(target, i);
    });
  }
  saveUiPos() {
    const packetCollection = [UI_POS_CHANGE];
    this.uiClasses.forEach((cls) => {
      const el = document.querySelector("." + cls);
      if (el == null) {
        packetCollection.push("-1;-1");
        return;
      }
      const bounds = el.getBoundingClientRect();
      packetCollection.push(Math.round(bounds.x) + ";" + Math.round(bounds.y));
    });
    SOCKET.sendPacket(packetCollection);
  }
  saveUiStatus() {
    const packetCollection = [UI_STATE_CHANGE];
    this.openWindows.forEach((status) => {
      packetCollection.push(Number(status));
    });
    SOCKET.sendPacket(packetCollection);
  }
}
