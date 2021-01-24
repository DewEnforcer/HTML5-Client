class Window extends Draggable{ //for body use main
    constructor(data, onToggle = null) {
        super();
        
        this.POSITION_LOCAL_KEY = "window_position";
        this.OPENSTATE_LOCAL_KEY = "window_openstate";

        this.node = null;
        this.nodeData = null;

        this.header = null;
        this.body = null;
        this.controller = null;
        this.onToggle = onToggle;

        this.isOpen = "isOpen" in data === true ? data.isOpen : true;
        this.isAlwaysActive = false;
        this.isActive = false;
        this.animating = false;

        this.MIN_SIZE_X = "38px";
        this.MIN_SIZE_Y = "30px";
        this.ANIMATE_TIME = 500;
        this.effectDuration = 300;

        this.SETTINGS_INDEX = 5;
        this.SETTINGS_TYPE = MENU_INTERFACE;

        this.data = {...data, onPress: this.handleIconPress, onEnter: this.setWindowActive, onLeave: this.setWindowInactive}

        this.generateWindowNode();
        this.setHeader();
        this.setBody();
        this.setController();
        this.render();
        this.setNodeData();
        this.setWindowInactive();
        this.setSavedOpenState();
        if (!this.isOpen) this.handleWindowClose(true);
    }
    generateWindowNode() {
        this.node = ElUtils.createBox([this.data.name, "body_active"]);
        document.body.appendChild(this.node);

        this.changeWindowPosition(this.getSavedPosition());
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

        if (this.isOpen) this.handleWindowClose();
        else this.handleWindowOpen();
        
        if (this.onToggle) return this.onToggle();
        
        this.saveOpenState();
    }
    handleWindowOpen(init = false) {
        if (this.isOpen && !init) return;
        this.animating = true;
        this.isOpen = true;

        if (this.controller) this.controller.setOpenStateVisual(this.isOpen);

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
    handleWindowClose(init = false) {
        if (!this.isOpen && !init) return;
        this.animating = true;
        this.isOpen = false;
        if (this.controller) this.controller.setOpenStateVisual(this.isOpen);

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
    toggleWindowActive = () => {
      if (this.isAlwaysActive) this.setWindowActive();
      else this.setWindowInactive();
    }
    setWindowActive = () => {
      if (!this.isAlwaysActive) return;

      this.node.classList.add("body_active");
      this.header.node.classList.add("header_active");
      this.isActive = true;
    }
    setWindowInactive = () => {
      if (this.isAlwaysActive) return;
      this.node.classList.remove("body_active");
      this.header.node.classList.remove("header_active");
      this.isActive = false;
    }

    setHeader() {
        this.header = new Header(this.data);
        this.enableDrag(this.header.node, this.node, this.savePosition);
    }
    setBody() {
        this.body = new Body(this.data);
    }
    setController() {
        if (!this.data.controller) return;
        this.controller = new Controller(this.data);
        this.controller.setOpenStateVisual(this.isOpen);
    }
    changeWindowPosition(data) {
      if (!data) return;
      const {x, y} = data;
      this.node.style.top = y + "px";
      this.node.style.left = x + "px";
    }
    savePosition = pos => {
      const key = `${this.POSITION_LOCAL_KEY}_${this.data.name}`
      
      localStorage.setItem(key, JSON.stringify(pos));
    }
    getSavedPosition() {
      const key = `${this.POSITION_LOCAL_KEY}_${this.data.name}`

      return JSON.parse(localStorage.getItem(key));
    }
    saveOpenState = () => {
      const key = `${this.OPENSTATE_LOCAL_KEY}_${this.data.name}`
      
      localStorage.setItem(key, JSON.stringify(this.isOpen));
    }
    setSavedOpenState() {
      const key = `${this.OPENSTATE_LOCAL_KEY}_${this.data.name}`

      const oldState = JSON.parse(localStorage.getItem(key));
      if (oldState === null) return;
      this.isOpen = oldState
    }
    getBodyNode() {
      return this.body.node;
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