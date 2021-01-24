class MapObject {
    constructor(x,y,z=1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.renderX = null;
        this.renderY = null;
        this.sprite = new Image();
        this.offset = {
            x: 0,
            y: 0
        }
    }
    draw() {
        GAME_MAP.ctx.drawImage(
            this.sprite,
            this.renderX - this.offset.x,
            this.renderY - this.offset.y
        );
    }
    calculateRenderPos() {
        this.renderX = this.x - CAMERA.followX / this.z + halfScreenWidth;
        this.renderY = this.y - CAMERA.followY / this.z + halfScreenHeight;
    }
}