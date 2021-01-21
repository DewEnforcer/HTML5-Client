class ElUtils {
    static DEFAULT_FADE_TICK = 0.2;

    //creators
    static createBox(cls, id = null, html = null) {
        const box = document.createElement("div");

        if (Array.isArray(cls)) cls.forEach(cl => box.classList.add(cl));
        else box.classList.add(cls);

        if (id) box.id = id;
        if (html) box.innerHTML = html;

        return box;
    }

    static createCheckBox(cls, id, checked = false) {
        const checker = document.createElement("input");

        checker.type = "checkbox";
        checker.checked = checked;

        checker.classList.add(cls);
        checker.id = id;

        return checker;
    }

    static createSelectBox(cls, id, options, value) {
        const select = document.createElement("select");

        select.classList.add(cls);
        if (id) select.id = id;

        options.forEach((opt) => {
          const optEL = document.createElement("option");
          optEL.value = opt;
          optEL.innerText = capitalizeString(opt);
          select.appendChild(optEL);
        });
        select.value = value;

        return select;
    }

    static createButton(cls, id, html = null) {
        const btn = document.createElement("button");

        if (id) btn.id = id;
        btn.classList.add(cls);

        if (html) btn.innerHTML = html;

        return btn;
    }
    //animators
    static getInterval(duration, maxFade, minFade, tick) {
        return duration / ((maxFade - minFade) / tick);
    }
    static fadeIn(minFade, maxFade, fadeDuration, element, fadePerTick = null, setDisplay = false) {
        if (!fadePerTick) fadePerTick = this.DEFAULT_FADE_TICK;

        const interval = this.getInterval(fadeDuration, maxFade, minFade, fadePerTick);

        let opacity = minFade;

        const callback = () => {
            element.style.display = "flex";
        }

        const intervalFunc = setInterval(() => {
            if (opacity >= maxFade) {
                clearInterval(intervalFunc);
                if (setDisplay) callback();
                return;
            }
            opacity += fadePerTick;
            element.style.opacity = opacity;
        }, interval);
    }

    static fadeOut(minFade, maxFade, fadeDuration, element, fadePerTick = null, setDisplay = false) {
        if (!fadePerTick) fadePerTick = this.DEFAULT_FADE_TICK;

        const interval = this.getInterval(fadeDuration, maxFade, minFade, fadePerTick);

        let opacity = maxFade;

        const callback = () => {
            element.style.display = "none";
        }

        const intervalFunc = setInterval(() => {
            if (opacity <= minFade) {
                clearInterval(intervalFunc);
                if (setDisplay) callback();
                return;
            }
            opacity -= fadePerTick;
            element.style.opacity = opacity;
        }, interval);
    }
    //calculators
    static pixelToView(px, isW = true) {
        const screenValue = isW ? screenWidth : screenHeight;
        const valueString = isW ? "vw" : "vh";

        return Math.round((px / screenValue) * 100) + valueString;
    }
}