class Camera {
  constructor(target) {
    this.followX = target.x;
    this.followY = target.y;
    this.followObject = target;
  }
  update() {
    this.followX = this.followObject.x;
    this.followY = this.followObject.y;
  }
}
