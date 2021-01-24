class Controller {
    BASE_X = 25;
    BASE_Y = 400;
    ACTIVE_CLASS_NAME = "btn_controller_mini_open";

    constructor(data) {
        this.node = null;
        this.data = data;
        this.init();
    }
    init() {
        this.createNode();
        this.render();
        this.repositionNode();
    }
    createNode() {
        const icon = `<img src="./spacemap/ui/uiIcon/${this.data.icon}_normal.png">`;

        this.node = ElUtils.createButton("btn_controller_mini", null, icon);
        this.node.addEventListener("click", ev => this.data.onPress(this.setOpenStateVisual));
    }
    repositionNode() {
        if (this.data.controller.useDefPosition) {
            this.data.controller.x += this.BASE_X;
            this.data.controller.y += this.BASE_Y;
        }
        this.node.style.left = `${this.data.controller.x}px`;
        this.node.style.top = `${this.data.controller.y}px`;
    }
    setOpenStateVisual = (isOpen) => {
        if (isOpen) return this.node.classList.add(this.ACTIVE_CLASS_NAME);
        this.node.classList.remove(this.ACTIVE_CLASS_NAME);
    }
    render() {
        document.body.appendChild(this.node);
    }
}