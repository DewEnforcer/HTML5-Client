class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
  }
  play() {
    this.sound.play();
  }
}
