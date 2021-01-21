class Emp {
  constructor(startPoint) {
    this.ID = getLaserID();
    this.startPoint = startPoint;
    this.x = 0;
    this.y = 0;
    this.renderX = 0;
    this.renderY = 0;
    this.spriteFlash = new Image();
    this.spriteFlash.src = `${PATH_TO_EFFECTS}/emp/flash.png`;
    this.spriteRing = new Image();
    this.spriteRing.src = `${PATH_TO_EFFECTS}/emp/ring.png`;
    this.spriteEMP = new Image();
    this.spriteEMP.src = `${PATH_TO_EFFECTS}/emp/0.png`;
    //sounds
    this.sound = new Sound(`./spacemap/audio/effects/emp.mp3`);
    //ring vars
    this.rings = [];
    this.MAX_RINGS = 5;
    this.currentRings = 0;
    this.frame = 0;
    //flash vars
    this.flashFade = 1;
    //emp vars
    this.empMaxSeq = 8;
    this.empSeq = 0;
    this.empFade = 1;
    //triggers
    this.activateFlash = true;
    this.activateRings = false;
    this.activateEmp = false;
    //
    this.initialSize = 10;
    this.sizePerFrame = 10;
    this.MAX_EMP_SIZE = 375;
    this.updateRealPos();
    this.updateRenderPos();
    this.sound.play();
  }
  terminate() {
    COMBAT_LAYER.some((item, i) => {
      if (item.ID == this.ID) {
        COMBAT_LAYER.splice(i, 1);
        return true;
      }
    });
  }
  updateRealPos() {
    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
  }
  updateRenderPos() {
    this.renderX = this.x - CAMERA.followX + halfScreenWidth; //count real distance to render one to the center
    this.renderY = this.y - CAMERA.followY + halfScreenHeight;
  }
  sequenceFlash() {
    if (this.flashFade <= 0 || !this.activateFlash) return;
    const flashFadePerFrame = 0.1;
    ctx.globalAlpha = this.flashFade;
    ctx.drawImage(
      this.spriteFlash,
      this.renderX - this.MAX_EMP_SIZE,
      this.renderY - this.MAX_EMP_SIZE,
      this.MAX_EMP_SIZE * 2,
      this.MAX_EMP_SIZE * 2
    );
    ctx.globalAlpha = 1;
    if (this.frame % 2 == 0) this.flashFade -= flashFadePerFrame;
    if (this.flashFade <= 0.5) {
      this.activateRings = true;
      this.activateEmp = true;
    }
  }
  sequenceRing() {
    if (!this.activateRings) return;
    const fadePerFrame = 0.05;
    if (this.currentRings < this.MAX_RINGS && this.frame % 5 == 0) {
      //activate on 10th
      this.currentRings++;
      this.rings.push({
        radius: this.initialSize,
        fadeSeq: 0.3,
        startFade: false,
      }); //create representation of new ring
    }
    if (this.currentRings >= this.MAX_RINGS && this.rings.length == 0) return;
    //updates rings
    this.rings.forEach((ring, i) => {
      ring.radius += this.sizePerFrame;
      if (ring.radius * 2 >= this.MAX_EMP_SIZE) ring.startFade = true;
      if (ring.startFade && this.frame % 4 == 0) ring.fadeSeq -= fadePerFrame;
      ring.fadeSeq = this.roundFade(ring.fadeSeq);
      ctx.globalAlpha = ring.fadeSeq;
      let fullsize = ring.radius * 2;
      ctx.drawImage(
        this.spriteRing,
        this.renderX - ring.radius,
        this.renderY - ring.radius,
        fullsize,
        fullsize
      );
      if (ring.fadeSeq <= 0) this.rings.splice(i, 1);
    });
    ctx.globalAlpha = 1;
  }
  roundFade(number) {
    var newnumber = number.toFixed(12);
    return parseFloat(newnumber);
  }
  sequenceEMP() {
    if (!this.activateEmp) return;
    if (this.empFade <= 0) {
      this.terminate();
      return;
    }
    //set spriteSeq
    if (this.empSeq < this.empMaxSeq) {
      this.empSeq += 1;
      this.spriteEMP.src = `${PATH_TO_EFFECTS}/emp/${this.empSeq}.png`;
    }
    //
    const empFadePerFrame = 0.1;
    let size = this.initialSize + this.frame * this.sizePerFrame;
    const fullsize = size * 2;
    if (size >= this.MAX_EMP_SIZE && this.frame % 4 == 0) {
      this.empFade -= empFadePerFrame;
      this.empFade = this.roundFade(this.empFade);
    }
    ctx.globalAlpha = this.empFade;
    ctx.drawImage(
      this.spriteEMP,
      this.renderX - size,
      this.renderY - size,
      fullsize,
      fullsize
    );
    ctx.globalAlpha = 1;
  }
  update() {
    this.updateRealPos();
    this.updateRenderPos();
    this.sequenceFlash();
    this.sequenceRing();
    this.sequenceEMP();
    this.frame++;
  }
}
