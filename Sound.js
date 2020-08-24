class Sound {
  constructor(src, isLoop = false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.loop = isLoop;
  }
  play() {
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}
