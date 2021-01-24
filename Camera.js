class Camera {
  constructor() {
    this.followX = 0;
    this.followY = 0;
    this.followObject = null;
  }
  setCameraTarget(target) {
    this.followObject = target;

    this.setNewCoordinates();
  }
  setNewCoordinates() {
    this.followX = this.followObject.x;
    this.followY = this.followObject.y;
  }
  update() {
    if (!this.followObject) return;
    this.setNewCoordinates();
  }
}
