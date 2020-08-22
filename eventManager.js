class EventManager {
  constructor() {
    this.isMouseDown = false;
    document.querySelector(".btn_launch").addEventListener("click", () => {
      SOCKET.initiateConnection();
      this.initListeners();
    });
    this.mouse = {
      x: null,
      y: null,
    };
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
        handleLogoutRequest();
        break;
      case BTN_PORT:
        requestPortalJump();
        break;
      default:
        break;
    }
  }
  handleMouseMov(evMouse) {
    this.mouse.x = evMouse.x;
    this.mouse.y = evMouse.y;
  }
  handleMouseDown() {
    if (!this.isMouseDown && checkCollision()) return; //checks only on first click, checks whether user wanted to lock on
    this.isMouseDown = true;
    HERO.isFly = true;
  }
  handleMouseUp() {
    this.isMouseDown = false;
    HERO.isFly = false;
  }
  initListeners() {
    //game listeners
    document.addEventListener("keypress", this.handleKeyPress);
    window.addEventListener("mousemove", (evMouse) =>
      this.handleMouseMov(evMouse)
    );
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
  }
}
