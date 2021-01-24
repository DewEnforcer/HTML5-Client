class Preloader {
  constructor(models) {
    this.modelsData = models;
    this.modelsBuffer = {}
  }
  preload() {
    for (let modelType in this.modelsData) {
      const typeData = this.modelsData[modelType];
      this.modelsBuffer = {...this.modelsBuffer, [modelType]: {}} //allocate space for the section of models
      for (let model in typeData) { //TODO REWORK INTO FUNCTIONAL CODE
        if (Array.isArray(typeData[model])) { //if is sprite data, else 
          this.modelsBuffer[modelType] = {...this.modelsBuffer[modelType], [model]: []} //allocate space for model
          this.preloadModel(modelType, this.modelsBuffer[modelType][model], typeData[model]);
        } else {
          this.modelsBuffer[modelType] = {...this.modelsBuffer[modelType], [model]: {}} //allocate space for model
          for (let SubModelKey in typeData[model]) {
            if (Array.isArray(typeData[model][SubModelKey])) {
              this.modelsBuffer[modelType][model] = {...this.modelsBuffer[modelType][model], [SubModelKey]: []} //allocate space for model
              this.preloadModel(modelType, this.modelsBuffer[modelType][model][SubModelKey], typeData[model][SubModelKey]);
            } else {
              this.modelsBuffer[modelType][model] = {...this.modelsBuffer[modelType][model], [SubModelKey]: {}} //allocate space for model
              for (let SubSubModelKey in typeData[model][SubModelKey]) {
                  this.modelsBuffer[modelType][model][SubModelKey] = {...this.modelsBuffer[modelType][model][SubModelKey], [SubSubModelKey]: []} //allocate space for model
                  this.preloadModel(modelType, this.modelsBuffer[modelType][model][SubModelKey][SubSubModelKey], typeData[model][SubModelKey][SubSubModelKey]);
              }              
            }
          }
        }
      }
    }
  }
  preloadModel(modelType, allocatedArr, modelData) {
    this.preloadSprite(allocatedArr, modelData[2], modelData, true);
    if (modelType == "ships") DEFAULT_SHIP_SPRITE_OFFSET++;
  }
  preloadSprite(allocatedArr, spriteIndex, modelData, isInit = false) {
    if (spriteIndex > modelData[1]) return LOADER.dataLoaded(modelData[0]);
    
    let buffSprite = new Image();
    buffSprite.src = `./spacemap/${modelData[0]}/${spriteIndex}.png`;
    if (isInit && spriteIndex > 0) {
      for (let i = 0; i < spriteIndex; i++) {
        allocatedArr.push(null);
      }
    }
    allocatedArr.push(null); //push placeholder
    const completeLoad = (isFail = false) => {
      allocatedArr[spriteIndex] = buffSprite;
      spriteIndex++;
      this.preloadSprite(allocatedArr, spriteIndex, modelData);
      if (isFail) {
        //todo ADD LOGGER
      }
    }
    buffSprite.onload = () => completeLoad();
    buffSprite.onerror = () => completeLoad(true);
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
