class UI {
  constructor() {
    this.openWindows = [];
    this.controllers = [];
    this.init();
  }
  init() {
    this.generateElementsUI("shipinfo", "shipInfo", "ship_info");
    this.generateElementsUI("userinfo", "userInfo", "user_info");
    this.generateControlsUI();
  }
  generateElementsUI(className, jsonName, dir) {
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
  generateControlsUI() {
    const baseX = 25;
    const baseY = 400;
    controllers.forEach((cntrl, i) => {
      this.openWindows.push(true);
      const el = document.createElement("button");
      el.setAttribute("for", cntrl.type);
      el.setAttribute("index", i);
      el.classList.add("btn_controller_mini");
      el.style.left = baseX + cntrl.x + "px";
      el.style.top = baseY + cntrl.y + "px";
      const icon = document.createElement("img");
      icon.src = `./spacemap/ui/uiIcon/${cntrl.icon}normal.png`;
      el.appendChild(icon);
      el.addEventListener("click", (ev) => this.handleControllerClick(ev));
      this.controllers.push(el);
      document.body.appendChild(el);
    });
    this.setControllerStatus();
  }
  setControllerStatus() {
    this.openWindows.forEach((open, i) => {
      const controller = this.controllers[i];
      if (open) controller.classList.add("btn_controller_mini_open");
      else controller.classList.remove("btn_controller_mini_open");
    });
  }
  /* handlers */
  handleControllerClick(ev) {
    ev.preventDefault();
    const controller = ev.currentTarget;
    const controllerIndex = controller.getAttribute("index");
    const forEl = controller.getAttribute("for");
    const target = document.querySelector("." + forEl);
    if (target != null) {
      if (this.openWindows[controllerIndex]) {
        MAIN.fadeOut(0, 1, 500, target, 0.1);
        setTimeout(() => {
          target.style.display = "none";
        }, 500);
      } else {
        MAIN.fadeIn(0, 1, 500, target, 0.1);
        target.style.display = "flex";
      } //is open
    }
    this.openWindows[controllerIndex] = !this.openWindows[controllerIndex];
    this.setControllerStatus();
  }
}
