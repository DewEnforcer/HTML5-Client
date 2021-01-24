class MapBox {
    constructor({id, isBig, x, y}, onClick) {
        this.mapId = id;
        this.isBig = isBig;
        this.node = null;

        this.isSelected = false;
        this.isCurrentMap = false;

        this.generateNode(onClick);
        this.setBackground();
        this.setPosition(x,y);
    }
    generateNode(onClick) {
        this.node = ElUtils.createBox("map_representation");
        if (this.isBig) this.node.classList.add("map_representation_big");

        this.node.addEventListener("click", () => onClick(this.mapId, this.setSelectMode));
    }
    setPosition(x,y) {
        this.node.style.left = `${x}px`;
        this.node.style.top = `${y}px`;
    }
    setBackground() {
        this.node.style.backgroundImage = `url("./spacemap/ui/spacejump/map${this.mapId}.png")`
    }
    cleanupVisualStates = () => {
        const icon = this.node.querySelector(".icon_spacejump");
        if (icon) icon.remove();
    }
    setSelectMode = () => {
        this.cleanupVisualStates();

        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/spacejump/iconSelMap.png`;
        icon.classList.add("icon_spacejump");
        
        this.node.appendChild(icon);
    }
    setCurrentMode = () => {
        this.cleanupVisualStates();

        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/spacejump/currMap.png`;
        icon.classList.add("icon_spacejump");

        this.node.appendChild(icon);
    }
    setJumpingMode = () => {
        this.cleanupVisualStates();

        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/spacejump/jumpSpinner.png`;
        icon.classList.add(["icon_spacejump", "jump_spinner_icon"]);

        this.node.appendChild(icon);
    }
    getNode() {
        return this.node;
    }
}