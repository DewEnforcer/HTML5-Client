class Smoke extends MapObject {
  constructor(x, y, z=1, type, parentEngine, activateOn = 1) {
    super(x,y,z);

    this.type = type;
    this.fadeOutFrame = 20;
    this.startFrame = 0;
    this.seq = 0;
    this.frame = 0;
    this.activateOnFrame = activateOn;

    this.offset = {
      x: 15.5,
      y: 15.5
    }
    
    this.parentEngine = parentEngine;

    this.setSpriteSeq();
  }
  setSpriteSeq() {
    this.sprite.src = `./spacemap/smokes/${this.type}/${this.seq}.png`;
  }
  terminate() {
    this.parentEngine.smoke.splice(0, 1); //the oldest smoke is always going to be first
  }
  update() {
    this.calculateRenderPos();
    this.frame++;
    if (this.frame % this.activateOnFrame == 0) this.seq++;
    this.setSpriteSeq();
    this.draw();
    if (this.seq >= this.fadeOutFrame) this.terminate();
  }
}
