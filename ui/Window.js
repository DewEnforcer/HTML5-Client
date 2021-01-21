class Window extends Draggable{ //for body use main
    constructor(data, openState = true) {
        super();
        this.node = null;
        this.nodeData = null;

        this.header = null;
        this.body = null;
        this.controller = null;

        this.isOpen = openState;
        this.animating = false;

        this.MIN_SIZE_X = "38px";
        this.MIN_SIZE_Y = "30px";
        this.ANIMATE_TIME = 500;
        this.effectDuration = 300;

        this.data = {...data, onPress: this.handleIconPress}

        this.generateWindowNode();
        this.setHeader();
        this.setBody();
        this.setController();
        this.render();
        this.setNodeData();
        if (!this.isOpen) this.handleWindowClose();
    }
    generateWindowNode() {
        this.node = ElUtils.createBox([this.data.name, "body_active"]);
        document.body.appendChild(this.node);
    }

    setNodeData() {
        const cStyles = getComputedStyle(this.node);
        this.nodeData = {
            w: cStyles.width,
            h: cStyles.height
        }
    }
    /* handlers */
    handleIconPress = () => {
        if (this.animating) return;

        if (this.isOpen) return this.handleWindowClose();
        this.handleWindowOpen();
    }
    handleWindowOpen() {
        if (this.isOpen) return;
        this.animating = true;
        this.isOpen = true;

        this.controller.setOpenStateVisual(this.isOpen);

        const textHeader = this.header.node.children[1];
        //first scale down horizontally, then vertically
        this.node.style.display = "flex";
        ElUtils.fadeIn(0, 1, this.ANIMATE_TIME, this.node, 0.1);
        setTimeout(() => {
          this.node.animate([{ width: 0 }, { width: this.nodeData.w }], {
            duration: this.effectDuration,
            fill: "forwards",
          });
          this.node.animate([{ height: 0 }, { height: this.nodeData.h }], {
            duration: this.effectDuration,
            delay: this.effectDuration,
            fill: "forwards",
          });
          setTimeout(() => {
            ElUtils.fadeIn(0, 1, 150, this.body.node);
            ElUtils.fadeIn(0, 1, 150, textHeader);
            this.animating = false;
          }, this.effectDuration * 2);
        }, this.ANIMATE_TIME);

    }
    handleWindowClose() {
        if (!this.isOpen) return;
        this.animating = true;
        this.isOpen = false;
        this.controller.setOpenStateVisual(this.isOpen);

        const textHeader = this.header.node.children[1];
        const elRes = this.node.getBoundingClientRect();
        const width = elRes.width + "px";
        const height = elRes.height + "px";
        //first scale down horizontally, then vertically
        ElUtils.fadeOut(0, 1, 150, this.body.node);
        ElUtils.fadeOut(0, 1, 150, textHeader);
        this.node.animate([{ width }, { width: this.MIN_SIZE_X }], {
          duration: this.effectDuration,
          fill: "forwards",
        });
        this.node.animate([{ height }, { height: this.MIN_SIZE_Y }], {
          duration: this.effectDuration,
          delay: this.effectDuration,
          fill: "forwards",
        });
        setTimeout(() => {
          ElUtils.fadeOut(0, 1, this.ANIMATE_TIME, this.node, 0.1, true);
          this.animating = false;
        }, this.effectDuration * 2);
    }

    setHeader() {
        this.header = new Header(this.data);
        this.enableDrag(this.header.node, this.node);
    }
    setBody() {
        this.body = new Body(this.data);
    }
    setController() {
        this.controller = new Controller(this.data);
        this.controller.setOpenStateVisual(this.isOpen);
    }
    render() {
        this.cleanup();
        this.node.appendChild(this.header.node);
        this.node.appendChild(this.body.node);
    }
    cleanup() {
        this.node.innerHTML = "";
    }
}