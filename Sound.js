class Sound {
  constructor(src, isLoop = false, isReset = false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.loop = isLoop;
    this.isReset = isReset;
  }
  play() {
    //if (this.isReset) this.sound.stop();
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}
