class ShipInfo {
    constructor(data) {
        this.window = new Window(data);
        this.shipData = {};
        this.init(data.content);
    }
    init(data) {
        data.forEach(cont => this.generateComponentContent(cont));
    }
    generateComponentContent({name, icon, isBar, hasEvent}) {
        const wrapper = ElUtils.createBox([`${name}_wrapper`, `wrapper_main_default`]);
        const iconEl = Component.generateIcon("ship_info", icon);

        if (hasEvent) this.addEvent(name, iconEl);

        wrapper.appendChild(iconEl);
        if (isBar) wrapper.appendChild(Component.generateBar("ship_info", name, this.handleBarVisualChange));
        else wrapper.appendChild(Component.generateText(name));

        this.addShipData(name, 0);

        this.window.body.node.appendChild(wrapper);
    }
    addEvent(name, el, trigger = "click") {
        let func;
        switch (name) {
            case "CFG":
              func = HERO.changeConfigRequest;
              break;
        }
        if (func) el.addEventListener(trigger, func); 
    }
    addShipData(key, value) {
        this.shipData = {...this.shipData, [key]: value};
    }

    updateData(name, newValue, maxValue = 0) {
        if (typeof this.shipData[name] === "undefined") return; //use typeof, default value is 0 = always falsy
        this.shipData[name] = newValue;
        const filled = Math.round((newValue / maxValue) * 100);

        const bar = document.querySelector(`.${name}_visual_bar`); //get rid of query selectors, when many updates comes , this tanks performance significantly
        const text = document.querySelector(`.${name}_visual_text`);

        if (text) Component.updateText(newValue, text);
        if (bar) Component.updateBar(filled, bar);
    }

    handleBarVisualChange = node => {
        console.log(node);
    }
}