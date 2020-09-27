class Preloader {
  constructor(models) {
    this.modelsData = models;
    this.modelsBuffer = [];
    this.preloadCanvas = document.createElement("canvas");
    this.ctxPreload = this.preloadCanvas.getContext("2d");
  }
  preload() {
    let arr;
    this.modelsData.forEach((model, i) => {
      arr = [];
      this.modelsBuffer.push(arr);
      this.preloadModel(i);
    });
  }
  preloadModel(index) {
    this.preloadSprite(
      index,
      this.modelsData[index][2],
      this.modelsData[index][1]
    );
    if (this.modelsData[index][0].includes("ships"))
      DEFAULT_SHIP_SPRITE_OFFSET++;
  }
  preloadSprite(modelIndex, spriteIndex, modelSprites) {
    if (spriteIndex > modelSprites) {
      progress++;
      manageLoadingBar();
      return;
    }
    const model = this.modelsData[modelIndex];
    let buffSprite = new Image();
    buffSprite.src = `./spacemap/${model[0]}/${spriteIndex}.png`;
    this.modelsBuffer[modelIndex].push(null); //push placeholder
    buffSprite.onload = () => {
      this.modelsBuffer[modelIndex][spriteIndex] = buffSprite;
      spriteIndex++;
      this.preloadSprite(modelIndex, spriteIndex, modelSprites);
    };
    buffSprite.onerror = () => {
      //add logger
      this.modelsBuffer[modelIndex][spriteIndex] = buffSprite;
      spriteIndex++;
      this.preloadSprite(modelIndex, spriteIndex, modelSprites);
    };
  }
  notifyUser(errType) {
    //TODO
  }
  deliverErrorReport(type) {
    fetch("./include/gameLogger.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `gameError=${type}&userID=${userID}&tsmp=${new Date().getTime()}`,
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      });
  }
}

/*buffSprite.onload = (ev) => {
  let width = ev.path[0].width;
  let height = ev.path[0].height;
  this.ctxPreload.clearRect(
    0,
    0,
    this.preloadCanvas.width,
    this.preloadCanvas.height
  );
  this.preloadCanvas.width = width;
  this.preloadCanvas.height = height;
  this.ctxPreload.drawImage(buffSprite, 0, 0);
  let imgData = this.ctxPreload.getImageData(
    0,
    0,
    this.preloadCanvas.width,
    this.preloadCanvas.height
  );
  this.modelsBuffer[modelIndex][spriteIndex] = this.ctxPreload.getImageData(
    0,
    0,
    this.preloadCanvas.width,
    this.preloadCanvas.height
  );
  spriteIndex++;
  this.preloadSprite(modelIndex, spriteIndex, modelSprites);
};bitmap implementation, currently not working*/
