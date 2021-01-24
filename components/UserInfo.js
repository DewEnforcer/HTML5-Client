class UserInfo {
    constructor(data) {
        this.window = new Window(data);
        this.userData = {};
        this.init(data.content);
    }
    init(data) {
        data.forEach(cont => this.generateComponentContent(cont));
    }
    generateComponentContent({name, icon, isBar}) {
        const wrapper = ElUtils.createBox([`${name}_wrapper`, `wrapper_main_default`]);

        wrapper.appendChild(Component.generateIcon("user_info", icon));
        if (isBar) wrapper.appendChild(Component.generateBar("user_info", name, this.handleBarVisualChange));
        else wrapper.appendChild(Component.generateText());

        this.addData(name, 0);

        this.window.body.node.appendChild(wrapper);
    }
    addData(key, value) {
        this.userData = {...this.userData, [key]: value};
    }
    updateData(name, newValue, maxValue = 0) {
        if (typeof this.userData[name] === "undefined") return; //use typeof, default value is 0 = always falsy
        this.userData[name] = newValue;
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