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
  handleMouseMov(evMouse) {
    this.mouse.x = evMouse.x;
    this.mouse.y = evMouse.y;
  }
  handleMouseDown() {
    if (!this.isMouseDown && checkCollision()) return; //checks only on first click, checks whether user wanted to lock on
    if (HERO.lockedControls) return;
    this.isMouseDown = true;
    HERO.isFly = true;
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
    MAIN.CANVAS.addEventListener("mousedown", () => this.handleMouseDown());
    MAIN.CANVAS.addEventListener("mouseup", () => this.handleMouseUp());
    MAIN.MINIMAP_C.addEventListener("mousedown", (ev) => MINIMAP.leadHero(ev));
  }
}
