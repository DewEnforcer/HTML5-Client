class EventManager {
  constructor() {
    this.isMouseDown = false;
    this.mouse = {
      x: null,
      y: null,
    };
    this.mouseInterval = null;
  }
  handleKeyPress({ keyCode }) {
    if (!gameInit) return;
    switch (keyCode) {
      case BTN_FPS:
        this.handleFpsRequest();
        break;
      case BTN_LOGOUT:
        this.handleLogoutRequest();
        break;
      case BTN_PORT:
        this.handleJumpRequest();
        break;
      case BTN_ATTACK:
        this.handleAttackRequest();
        break;
      case BTN_CONFIG:
        this.handleConfigChangeRequest();
        break;
      case BTN_ACTIONBAR_SUBMENU:
        this.handleActionBarSubmenu();
      break;
      default:
        if (BTN_SWITCH.includes(keyCode)) this.handleActionbarSlotChange(keyCode);
      break;
    }
  }
  //handlers
  handleLogoutRequest(callback = null) {
    UI_MAIN.UI.logout.handleLogoutToggle(true);
  }
  handleFpsRequest() {

  }
  handleJumpRequest() {
    if (HERO.getIsJumping()) return;

    SOCKET.sendPacket([REQUEST_PORTAL_JUMP]);
  }
  handleAttackRequest() {

  }
  handleConfigChangeRequest() {

  }
  handleActionBarSubmenu() {
    UI_MAIN.ACTION_BAR.toggleActionMenu();
  }
  handleActionbarSlotChange() {

  }

  //utils, listeners
  getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }
  checkHover() {
    let cursor = "default";
    Object.values(MAP_MANAGER.MAP_SHIPS).some((ship) => {
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
  handleMouseMov = (evMouse) => {
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
  handleMouseDown = () => {
    if (!this.isMouseDown && checkCollision()) return; //checks only on first click, checks whether user wanted to lock on
    if (HERO.lockedControls) return;
    this.isMouseDown = true;
    HERO.ship.isFly = true;
    this.initInterval();
  }
  handleMouseUp = () => {
    if (this.isMouseDown) {
      this.stopInterval();
      this.isMouseDown = false;
    }
  }
  initListeners() {
    document.body.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keypress", (keyPress) => {
      if (UI_MAIN.UI.chat.getIsTyping()) return;
      this.handleKeyPress(keyPress);
    });

    GAME_MAP.canvas.addEventListener("mousedown", this.handleMouseDown);

    window.addEventListener("mousemove", this.handleMouseMov);
    window.addEventListener("resize", () => {
      GAME_MAP.resizeCanvas();
      UI_MAIN.UI.spacemap.resizeCanvas();
    });
  }
}
