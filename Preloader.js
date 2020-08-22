class Preloader {
  constructor(models) {
    this.modelsData = models;
    this.modelsBuffer = [];
  }
  preload() {
    let arr, buffSprite;
    this.modelsData.forEach((model) => {
      arr = [];
      for (let i = 0; i <= model[1]; i++) {
        buffSprite = new Image();
        buffSprite.src = `./spacemap/${model[0]}/${i}.png`;
        arr.push(buffSprite);
      }
      this.modelsBuffer.push(arr);
    });
  }
}
