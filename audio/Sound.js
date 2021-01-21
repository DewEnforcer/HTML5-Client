class Sound {
  constructor(src, isLoop = false, type = 0, isReset = false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.loop = isLoop;
    this.isReset = isReset;
    this.type = type;
    this.settingIndex = 3;
  }
  play() {
    if (!SETTINGS.settingsArr[this.settingIndex][this.type]) return;
    //if (this.isReset) this.sound.stop();
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}
