class EventManager {
  constructor() {
    this.isMouseDown = false;
    document.querySelector(".btn_launch").addEventListener("click", () => {
      SOCKET.initiateConnection();
    });
    this.mouse = {
      x: null,
      y: null,
    };
  }
  handleLogoutRequest() {
    if (HERO.loggingOut) {
      manageLogoutWindow();
      HERO.setLogout();
      SOCKET.sendPacket([REQUEST_LOGOUT_STOP]);
      return;
    }
    manageLogoutWindow();
    HERO.setLogout();
    SOCKET.sendPacket([REQUEST_LOGOUT]);
  }
  handleKeyPress({ key }) {
    if (!gameInit) return;
    switch (key) {
      case BTN_FPS:
        manageFpsWindow();
        break;
      case BTN_ATTACK:
        if (HERO !== 0) HERO.startAttack();
        break;
      case BTN_LOGOUT:
        this.handleLogoutRequest();
        break;
      case BTN_PORT:
        requestPortalJump();
        break;
      case BTN_SHIP:
        SOCKET.sendPacket([TEST_SHIP]);
        break;
      default:
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
        ship.renderX + ship.offset.x,
        ship.renderY + ship.offset.y,
        EVENT_MANAGER.mouse.x,
        EVENT_MANAGER.mouse.y
      );
      if (dist <= clickRange) {
        cursor = "pointer";
        return true;
      }
    });
    console.log(cursor);
    document.body.style.cursor = cursor;
  }
  handleMouseMov(evMouse) {
    this.mouse.x = evMouse.x;
    this.mouse.y = evMouse.y;
    this.checkHover();
  }
  handleMouseDown() {
    if (!this.isMouseDown && checkCollision()) return; //checks only on first click, checks whether user wanted to lock on
    if (HERO.lockedControls) return;
    this.isMouseDown = true;
    HERO.isFly = true;
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
    this.isMouseDown = false;
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
    MAIN.CANVAS.addEventListener("mouseup", () => this.handleMouseUp());
    MAIN.MINIMAP_C.addEventListener("mousedown", (ev) => MINIMAP.leadHero(ev));
  }
}
