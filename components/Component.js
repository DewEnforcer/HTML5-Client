class Component {
    static generateIcon(dir, icon) {
        const iconEl = document.createElement("img");
        iconEl.src = `./spacemap/ui/${dir}/${icon}.png`;
        iconEl.classList.add("icon_info");
        
        return iconEl;
    }
    static generateBar(dir, name, onClick) {
        const barWrapper = ElUtils.createBox("visual_wrapper");
        barWrapper.addEventListener("click", ev => onClick(barWrapper));

        const bar = ElUtils.createBox(`${name}_visual_bar`);
        bar.style.backgroundImage = `url('../spacemap/ui/${dir}/${name.toLowerCase()}.png')`

        barWrapper.appendChild(bar);

        return barWrapper;
    }
    static generateText(name, defaultValue = 0) {
        const text = document.createElement("span");
        text.classList.add(`${name}_visual_text`);
        text.innerText = defaultValue;
        
        return text;
    }
    static updateText(text, el) {
        el.innerText = text;
    }
    static updateBar(filled, el) {
        el.style.width = `${filled}%`;
    }
}