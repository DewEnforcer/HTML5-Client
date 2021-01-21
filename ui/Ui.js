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
    this.settingsIndex = 4;
    this.DATA_KEY_POS = "UI_POS_KEY";
    this.DATA_KEY_STATUS = "UI_STATUS_KEY";
    this.init();
  }
  init() {
    this.generateElementsUI("shipinfo", "shipInfo", "ship_info");
    this.generateElementsUI("userinfo", "userInfo", "user_info");
    this.generateControlsUI();
    this.genNonUiBtns();
  }
  genNonUiBtns() {
    UI_DATA.nonUiControllers.forEach((cntrl, i) => {
      const el = document.createElement("button");
      el.setAttribute("index", i);
      el.setAttribute("select", "false");
      el.setAttribute("for", cntrl.type);
      el.classList.add("btn_controller_mini");
      el.id = "non_ui_cntrl_" + cntrl.type;
      let xTotal = cntrl.x;
      let yTotal = cntrl.y;
      el.style.left = xTotal + "px";
      el.style.top = yTotal + "px";
      const icon = document.createElement("img");
      icon.src = `./spacemap/ui/uiIcon/${cntrl.icon}normal.png`;
      el.appendChild(icon);
      el.addEventListener("click", (ev) => this.handleNonUIControllerClick(ev));
      document.body.appendChild(el);
    });
  }
  generateElementsUI(className, jsonName, dir) {
    const target = document.querySelector("." + className + "_main");
    UI_DATA.elements[jsonName].forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(`${el.name}_wrapper`, "wrapper_main_" + className);
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
        visualReprBar.style.backgroundImage = `url('../spacemap/ui/${dir}/${el.name.toLowerCase()}.png')`;
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
      let xTotal = cntrl.x;
      let yTotal = cntrl.y;
      if (cntrl.useDefVal) {
        xTotal += baseX;
        yTotal += baseY;
      }
      el.style.left = xTotal + "px";
      el.style.top = yTotal + "px";
      this.uiClasses.push(cntrl.type);
      const icon = document.createElement("img");
      icon.src = `./spacemap/ui/uiIcon/${cntrl.icon}normal.png`;
      el.appendChild(icon);
      el.addEventListener("click", (ev) => this.handleControllerClick(ev));
      this.controllers.push(el);
      document.body.appendChild(el);
    });
    this.getUiSizes();
    this.setUiPos(true);
    this.setUiStatus(true);
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
      const x = ElUtils.pixelToView(uiSize.w);
      const y = ElUtils.pixelToView(uiSize.h, false);
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
  sizeDown(el, index, time = 500) {
    const textHeader = el.children[0].children[1];
    const UiBody = el.children[1];
    const elRes = el.getBoundingClientRect();
    const width = elRes.width + "px";
    const height = elRes.height + "px";
    //first scale down horizontally, then vertically
    ElUtils.fadeOut(0, 1, 150, UiBody);
    ElUtils.fadeOut(0, 1, 150, textHeader);
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
      ElUtils.fadeOut(0, 1, time, el, 0.1, true);
      this.windowAnimationDone[index] = true;
    }, this.effectDuration * 2);
  }
  sizeUp(el, index, time = 500) {
    const textHeader = el.children[0].children[1];
    const UiBody = el.children[1];
    //first scale down horizontally, then vertically
    el.style.display = "flex";
    ElUtils.fadeIn(0, 1, time, el, 0.1);
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
        ElUtils.fadeIn(0, 1, 150, UiBody);
        ElUtils.fadeIn(0, 1, 150, textHeader);
        this.windowAnimationDone[index] = true;
      }, this.effectDuration * 2);
    }, time);
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
      this.openWindows[controllerIndex] = !this.openWindows[controllerIndex];
      this.setControllerStatus();
      this.saveUiStatus();
    }
  }
  handleNonUIControllerClick(ev) {
    console.log(ev);
    ev.preventDefault();
    const contrl = ev.currentTarget;
    const action = contrl.getAttribute("for");
    let isSelect = contrl.getAttribute("select") == "true";
    if (isSelect) {
      contrl.classList.remove("btn_controller_mini_open");
    } else {
      contrl.classList.add("btn_controller_mini_open");
    }
    isSelect = !isSelect;
    contrl.setAttribute("select", isSelect.toString());
    switch (action) {
      case "logout":
        EVENT_MANAGER.handleLogoutRequest();
        break;
      case "help":
        //alert("Figure it out yourself lol");
        break;
      case "fullscreen":
        MAIN.reqFullScreen();
        break;
      default:
        break;
    }
  }
  changeUiBgs(status) {
    const bodyClass = "body_active";
    const headerActive = "header_active";
    let rgba = "rgba(22,38,47,";
    let alpha = 0;
    if (status) alpha = 0.5;
    rgba += alpha + ")";
    this.uiClasses.forEach((cls) => {
      const elBody = document.querySelector("." + cls);
      const elHead = document.querySelector("." + cls + "_header");
      if (status) {
        elBody.classList.add(bodyClass);
        elHead.classList.add(headerActive);
      } else {
        elBody.classList.remove(bodyClass);
        elHead.classList.remove(headerActive);
      }
    });
    //select all elements and change their bg alpha
  }
  /* UI pos handlers */
  setUiPos(isInit = false) {
    const data = JSON.parse(localStorage.getItem(this.DATA_KEY_POS));
    if (data == null) return;
    data.forEach((uiPos, i) => {
      if (uiPos < 0) return;
      const uiEL = document.querySelector("." + this.uiClasses[i]);
      uiEL.style.left = uiPos[0] + "px";
      uiEL.style.top = uiPos[1] + "px";
    });
  }
  setUiStatus(isInit = false) {
    const data = localStorage.getItem(this.DATA_KEY_STATUS);
    if (data == null) return;
    this.openWindows = JSON.parse(data);
    this.setControllerStatus();
    this.setUiStatusGraphical();
  }
  saveUiPos() {
    const data = [];
    this.uiClasses.forEach((cls) => {
      const el = document.querySelector("." + cls);
      if (el == null) {
        data.push([-1, -1]);
        return;
      }
      const bounds = el.getBoundingClientRect();
      data.push([Math.round(bounds.x), Math.round(bounds.y)]);
    });
    localStorage.setItem(this.DATA_KEY_POS, JSON.stringify(data));
  }
  saveUiStatus() {
    localStorage.setItem(
      this.DATA_KEY_STATUS,
      JSON.stringify(this.openWindows)
    );
  }
  setUiStatusGraphical() {
    this.uiClasses.forEach((cls, i) => {
      const target = document.querySelector("." + cls);
      if (this.openWindows[i]) this.sizeUp(target, i, 0);
      else this.sizeDown(target, i, 0);
    });
  }
}
