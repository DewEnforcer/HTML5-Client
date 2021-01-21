class UiElementManager { //DEPRECATED
    constructor() {
        this.MIN_SIZE_X = "38px";
        this.MIN_SIZE_Y = "30px";
        this.EFFECT_DURATION = 300;
        this.SETTINGS_INDEX = 4;

        this.DATA_KEY_POS = "UI_POS_KEY";
        this.DATA_KEY_STATUS = "UI_STATUS_KEY";

        this.ANIMATE_OPTIONS = {
            duration: this.EFFECT_DURATION,
            fill: "forwards"
        }

        this.controllers = {};

        this.init();
    }
    init() {
        //this.generateControllers();
    }
    generateControllers() {
        UI_DATA.controllers.forEach(cntrl => {
            const {box: uiEl} = MAIN.getUiElement(cntrl.id);
            if (!uiEl) return;

            const cntrlEl = this.createControllerElement(cntrl);

            const {width, height} = uiEl.getBoundingClientRect()

            const cntrlObj = this.createControllerObj(cntrl, cntrlEl, uiEl, [width, height]);
            this.controllers = {...this.controllers, [cntrlObj.uiElementID]: cntrlObj};

            document.body.appendChild(cntrlEl);
        });
    }
    createControllerElement ({type, icon, id, x, y, useDefPosition}) {
        const baseX = 25;
        const baseY = 400;

        const iconEl = `<img src="./spacemap/ui/uiIcon/${icon}normal.png">`;
        const btn = ElUtils.createButton("btn_controller_mini", null, iconEl);

        btn.setAttribute("for", type);
        btn.setAttribute("controllerID", id);

        if (useDefPosition) {
            x += baseX;
            y += baseY;
        }

        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;

        btn.addEventListener("click", ev=>this.toggleUiWindow(id));
        return btn
    }
    createControllerObj({id}, el, uiEl, [maxWidth, maxHeight]) {
        return {
            uiElementID: id,
            isOpen: true,
            isAnimating: false,
            cntrlEl: el,
            uiEl: uiEl,
            uiElMaxVw: ElUtils.pixelToView(maxWidth),
            uiElMaxVh: ElUtils.pixelToView(maxHeight, false),
            uiElMaxWidthPx: maxWidth,
            uiElMaxHeightPx: maxHeight
        }
    }
    //handlers
    toggleUiWindow(controllerID) {
        const controller = this.controllers[controllerID];
        if (!controller || controller.isAnimating === true) return;

        controller.isAnimating = true;
        
        if (controller.isOpen) this.closeUiWindow(controller);
        else this.openUiWindow(controller);

        controller.isOpen = !controller.isOpen;
        controller.isAnimating = false;
    }
    openUiWindow({uiEl, uiElMaxVw, uiElMaxVh}) {
        uiEl.animate([
            {width: 0},
            {width: uiElMaxVw}
        ], this.ANIMATE_OPTIONS)

        uiEl.animate([
            {height: 0},
            {height: uiElMaxVh}
        ], this.ANIMATE_OPTIONS)
    }
    closeUiWindow({uiEl, uiElMaxWidthPx, uiElMaxHeightPx}) {
        uiEl.animate([
            {width: uiElMaxWidthPx},
            {width: 0}
        ], this.ANIMATE_OPTIONS)

        uiEl.animate([
            {height: uiElMaxHeightPx},
            {height: 0}
        ], this.ANIMATE_OPTIONS)
    }

    //
    changeUiBgs(setting) {
        console.log("Changing bgs %s", setting);
    }

}