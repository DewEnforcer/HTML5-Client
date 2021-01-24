class Settings {
    constructor(data) {
        this.window = new Window(data);
        this.STORAGE_KEY = "SETTINGS_VAL_KEY";
        this.settingsArr = [];
        this.UI_GEN = false;

        this.menuNode = null;
        this.menuOpen = 0;

        this.qualityToNum = {
            low: 1,
            average: 2,
            good: 3,
            high: 4,
            off: false,
            on: true,
        };
        this.subSections = [
            "display",
            "gameplay",
            "interface",
            "sound",
            "keyboard",
        ];
        this.menuContents = data.content;

        this.setSettings();
        this.generateContent();
    }
    generateContent() {
        if (this.UI_GEN) return;
        const body = this.window.getBodyNode();


        this.generateNavigation(body);
        this.generateMenu(body);
        this.generateMenuContents();

        this.UI_GEN = true;
    }
    generateNavigation(body) {
        const wrapper = ElUtils.createBox("settings_submenu_wrapper");

        this.subSections.forEach((subSec, i) => {
            const btn = ElUtils.createBox(
              [subSec, "settings_submenu_btn", "translate_txt"],
              `submenu_btn_${i}`
            );
            btn.setAttribute("transl_key", subSec);
            btn.addEventListener("click", () => this.handleMenuChange(i));
            wrapper.appendChild(btn);
        });

        body.appendChild(wrapper);
    }
    generateMenu(body) {
        this.menuNode = ElUtils.createBox("settings_menu_wrapper");
        body.appendChild(this.menuNode);
    }

    generateMenuContents() {
        this.menuCleanup();
        const contents = this.menuContents[this.menuOpen];
        if (!contents) return;

        contents.forEach( (option, i) => {
            const classes = [ `${option.name}_wrapper_main`, `${option.isCheck ? "check" : "option"}_wrapper_main`];
            const optionName = option.name + "_sett";
            const container = ElUtils.createBox(classes);

            const label = ElUtils.createText(["translate_txt", "setting_opt_title"], TEXT_TRANSLATIONS[optionName], optionName);
            let settingInput;

            if (option.isCheck) settingInput = ElUtils.createCheckBox("settings_checkbox", `${i}_checkbox`, this.settingsArr[this.menuOpen][i], this.handleSettingChange) 
            else settingInput = ElUtils.createSelectBox("settings_select", `${i}_select`, option.options, this.getValToKey(this.settingsArr[this.menuOpen][i]), this.handleSettingChange);
        
            container.appendChild(label);
            container.appendChild(settingInput);

            this.menuNode.appendChild(container);
        });
    }
    menuCleanup() {
        this.menuNode.innerHTML = "";
    }

    handleSettingChange = (val, id) => {
        const path = id.split("_")[0];
        if (typeof val !== "boolean") val = this.qualityToNum[val];

        this.settingsArr[this.menuOpen][path] = val;

        this.saveSettings();
    }
    handleMenuChange = (index) => {
        if (index == this.menuOpen) return;
        this.menuOpen = index;
        
        this.generateMenuContents();
    }

    getDefaultSettings() {
        const allSettings = [];
        this.menuContents.forEach((set, i) => {
          allSettings.push([]);
          set.forEach((actualSetting) => {
            if (actualSetting.isCheck) return allSettings[i].push(true);

            let opts = actualSetting.options;
            let val = this.qualityToNum[opts[opts.length - 1]];
            if (!val) val = opts[opts.length - 1];
            allSettings[i].push(val); //sets all to max details
          });
        });
        return allSettings;
    }
    getValToKey(val) {
        for (let key in this.qualityToNum) {
          const element = this.qualityToNum[key];
          if (element === val) return key;
        }
        return val;
    }
    setSettings() {
        let isSet = this.loadSavedSettings();
        if (isSet) return;
        let data = this.getDefaultSettings();
        data.forEach((setSection, i) => {
          this.settingsArr.push([]);
          setSection.forEach(setting => {
            const subSecArr = this.settingsArr[i];
            subSecArr.push(setting);
          });
        });
    }
    setWindowStates() {
        Object.values(UI_MAIN.UI).forEach( c => {
            c.window.isAlwaysActive = this.settingsArr[MENU_INTERFACE][5];
            c.window.toggleWindowActive();
        })
    }
    saveSettings() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settingsArr));
    }
    loadSavedSettings() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        if (!data) return false;

        this.settingsArr = data;
        return true;
    }
}