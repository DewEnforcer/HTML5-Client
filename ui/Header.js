class Header {
    constructor(data) {
        this.node = null;
        this.init(data);
    }
    init(data) {
        this.createNode(data);
    }
    createHeaderBox(name, onEnter, onLeave) {
        this.node = ElUtils.createBox([`${name}_header`, "header", "header_active"]);
        this.node.addEventListener("mouseenter", onEnter);
        this.node.addEventListener("mouseleave",  onLeave);
    }
    createNode({name, id, icon, onPress, onEnter, onLeave, label}) {
        this.createHeaderBox(name, onEnter, onLeave);
        this.node.appendChild(this.createHeaderIcon(icon, id, onPress));
        this.node.appendChild(this.createHeaderLabel(label));
    }
    createHeaderIcon(name, id, onPress) {
        const iconWrapper = ElUtils.createBox(`${name}_icon_div`)

        const icon = document.createElement("img");
        icon.src = `./spacemap/ui/uiIcon/${name}_normal.png`;
        icon.setAttribute("elementID", id);
        icon.addEventListener("click", ev => onPress(ev));

        iconWrapper.appendChild(icon);

        return iconWrapper;
    }
    createHeaderLabel(key) {
        const headerTextSpan = document.createElement("span");
        headerTextSpan.classList.add("translate_txt");
        headerTextSpan.setAttribute("transl_key", key);
        
        return headerTextSpan;
    }
}