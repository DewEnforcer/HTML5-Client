class EventManager {
  constructor() {
    this.isMouseDown = false;
    document
      .querySelector(".loading_bar_wrapper")
      .addEventListener("click", () => {
        if (!loadingStatus) return; //game isnt ready
        SOCKET.initiateConnection();
      });
    this.mouse = {
      x: null,
      y: null,
    };
    this.mouseInterval = null;
  }
  handleLogoutRequest(btnCancel = false) {
    if (btnCancel) {
      document.querySelector("#non_ui_cntrl_logout").click();
      return;
    }
    if (HERO.isLogout) {
      manageLogoutWindow();
      HERO.setLogout();
      SOCKET.sendPacket([REQUEST_LOGOUT_STOP]);
      return;
    }
    manageLogoutWindow();
    HERO.setLogout();
    SOCKET.sendPacket([REQUEST_LOGOUT]);
  }
  handleKeyPress({ key, keyCode }) {
    if (!gameInit) return;
    switch (keyCode) {
      case BTN_FPS:
        manageFpsWindow();
        break;
      case BTN_LOGOUT:
        this.handleLogoutRequest();
        break;
      case BTN_PORT:
        requestPortalJump();
        break;
      case BTN_ATTACK:
        HERO.handleAttackState();
        break;
      case BTN_CONFIG:
        HERO.changeConfigRequest();
        break;
      case BTN_ACTIONBAR_SUBMENU:
        MAIN.actionBar.btnOpenMenu.click();
      default:
        if (BTN_SWITCH.includes(keyCode))
          MAIN.actionBar.handleSlotChangeKeyboard(keyCode);
        break;
    }
  }
  getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }
  checkHover() {
    let cursor = "default";
    Object.values(MAP_SHIPS).some((ship) => {
      let dist = getDistance(
        ship.render.renderX + ship.offset.x,
        ship.render.renderY + ship.offset.y,
        EVENT_MANAGER.mouse.x,
        EVENT_MANAGER.mouse.y
      );
      if (dist <= clickRange) {
        cursor = "pointer";
        return true;
      }
    });
    document.body.style.cursor = cursor;
  }
  handleMouseMov(evMouse) {
    this.mouse.x = evMouse.x;
    this.mouse.y = evMouse.y;
    this.checkHover();
  }
  initInterval() {
    HERO.processDest();
    this.mouseInterval = setInterval(() => {
      HERO.processDest();
    }, 75);
  }
  stopInterval() {
    clearInterval(this.mouseInterval);
  }
  handleMouseDown() {
    if (!this.isMouseDown && checkCollision()) return; //checks only on first click, checks whether user wanted to lock on
    if (HERO.lockedControls) return;
    this.isMouseDown = true;
    HERO.ship.isFly = true;
    this.initInterval();
  }
  handleInfoVisualChange(ev) {
    //handle changes between text and visual info
    let section = ev.target.id.split("_")[0];
    let visualWrapper = document.querySelector(
      "#" + section + "_visual_wrapper"
    );
    let text = document.querySelector("#" + section + "_text");
    if (MAIN.shipInfoStatus[section]) {
      //is visual
      visualWrapper.style.display = "none";
      text.style.display = "block";
    } else {
      visualWrapper.style.display = "block";
      text.style.display = "none";
      //is text
    }
    MAIN.shipInfoStatus[section] = !MAIN.shipInfoStatus[section];
  }
  handleMouseUp() {
    if (this.isMouseDown) {
      this.stopInterval();
      this.isMouseDown = false;
    }
  }
  initListeners() {
    //game listeners
    document.addEventListener("keypress", (keyPress) => {
      this.handleKeyPress(keyPress);
    });
    window.addEventListener("mousemove", (evMouse) =>
      this.handleMouseMov(evMouse)
    );
    //window.addEventListener("mousedown", () => this.handleMouseDown());
    MAIN.CANVAS.addEventListener("mousedown", () => this.handleMouseDown());
    document.body.addEventListener("mouseup", () => this.handleMouseUp());
    MAIN.MINIMAP_C.addEventListener("mousedown", (ev) => MINIMAP.leadHero(ev));
    window.addEventListener("resize", () => {
      MAIN.resizeCanvas();
    });
  }
}
