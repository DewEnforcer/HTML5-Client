class Loader {
    constructor() {
        this.loadingBarNode = null;
        this.loadingBtnNode = null;

        this.progress = 0;
        this.maxProgress = 35;

        this.filesReady = false;

        this.setLoadingNode();
    }
    setLoadingNode() {
        this.loadingBtnNode = document.querySelector(".loading_bar_wrapper");
        this.loadingBarNode = document.querySelector(".loading_bar_real")
    }
    dataLoaded(type) {
        this.progress++;
        console.log("Loaded section: ", type);
        this.handleLoadingProgress();
        this.handleLoadingFinished();
    }
    handleLoadingProgress() {
        const percComplete = (this.progress / this.maxProgress) * 100;
        
        this.loadingBarNode.style.width = `${percComplete}%`;
    }
    handleLoadingFinished() {
        if (this.progress < this.maxProgress) return;

        this.filesReady = true;

        this.loadingBtnNode.classList.add("loading_bar_ready");
        this.loadingBarNode.innerText = "START";
        this.loadingBtnNode.addEventListener("click", handleGameStart);
    }
}