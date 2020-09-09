class Settings {
  constructor() {
    this.hoverShips = false;
    this.minimapBG = true;
    this.displayDrones = false;
    this.bgQuality = 4;
    this.explosionQuality = 4;
    this.UI_GEN = false;
    this.settingsArr = [];
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
    this.menuContents = [
      [
        {
          name: "Backgrounds",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "Space-Objects",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "Nebulas",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "Stars",
          isCheck: false,
          options: ["off", "good", "high"],
        },
        {
          name: "Explosions",
          isCheck: false,
          options: ["off", "average", "good", "high"],
        },
        {
          name: "Engines",
          isCheck: false,
          options: ["low", "high"],
        },
      ],
    ];
    this.settingsBox = null;
    this.wrapperMenu = null;
    this.menuOpen = 0;
    this.setSettings();
  }
  setSettings(data = null) {
    if (data == null) {
      data = this.resetSettings();
    }
    data.forEach((setSection, i) => {
      this.settingsArr.push([]);
      setSection.forEach((setting, k) => {
        const subSecArr = this.settingsArr[i];
        subSecArr.push(setting);
      });
    });
  }
  resetSettings() {
    const allSettings = [];
    this.menuContents.forEach((set, i) => {
      allSettings.push([]);
      set.forEach((actualSetting) => {
        let opts = actualSetting.options;
        allSettings[i].push(this.qualityToNum[opts[opts.length - 1]]); //sets all to max details
      });
    });
    return allSettings;
  }
  getSettingsBox() {
    this.settingsBox = document.querySelector(".settings_main");
  }
  selectSubmenuBtn() {
    const selectBtn = document.querySelector(".settings_submenu_btn_select");
    if (selectBtn != null)
      selectBtn.classList.remove("settings_submenu_btn_select");
    document.querySelectorAll(".settings_submenu_btn").forEach((btn, i) => {
      if (i == this.menuOpen) btn.classList.add("settings_submenu_btn_select");
    });
  }
  genUi() {
    if (this.UI_GEN) return;
    this.getSettingsBox();
    //gen submenu wrapper
    const wrapperSubmenu = MAIN.createBox("settings_submenu_wrapper");
    this.settingsBox.appendChild(wrapperSubmenu);
    //gen submenu
    this.subSections.forEach((subSec, i) => {
      const btn = MAIN.createBox(
        [subSec, "settings_submenu_btn"],
        `submenu_btn_${i}`
      );
      btn.innerText = TEXT_TRANSLATIONS[subSec];
      btn.addEventListener("click", (ev) => this.handleSubmenuOpen(ev));
      wrapperSubmenu.appendChild(btn);
    });
    //gen menu
    this.wrapperMenu = MAIN.createBox("settings_menu_wrapper");
    this.settingsBox.appendChild(this.wrapperMenu);
    //gen menu contents
    this.genMenuContents();
    this.selectSubmenuBtn();
    this.UI_GEN = true;
  }
  clearMenuBox() {
    this.wrapperMenu.innerHTML = "";
  }
  genMenuContents() {
    this.clearMenuBox();
    if (this.menuContents.length <= this.menuOpen) return;
    const contents = this.menuContents[this.menuOpen];
    contents.forEach((option, i) => {
      const wrap = MAIN.createBox([
        `${option.name}_wrapper_main`,
        `${option.isCheck ? "check" : "option"}_wrapper_main`,
      ]);
      wrap.innerHTML = `<span cls="setting_opt_title">${option.name}</span>`;
      if (option.isCheck) {
        const checker = MAIN.createCheckerBox(
          "settings_checkbox",
          `checkbox_${this.menuOpen}_${i}`
        );
        checker.setAttribute("checker", "true");
        checker.addEventListener("change", (ev) =>
          this.handleSettingChange(ev)
        );
        wrap.appendChild(checker);
      } else {
        console.log(this.settingsArr[this.menuOpen][i]);
        const select = MAIN.createSelectBox(
          "settings_select",
          `select_${this.menuOpen}_${i}`,
          option.options,
          this.getValToKey(this.settingsArr[this.menuOpen][i])
        );
        select.setAttribute("checker", "false");
        select.addEventListener("change", (ev) => this.handleSettingChange(ev));
        wrap.appendChild(select);
      }
      this.wrapperMenu.appendChild(wrap);
    });
  }
  getValToKey(val) {
    for (let key in this.qualityToNum) {
      const element = this.qualityToNum[key];
      if (element === val) return key;
    }
    return null;
  }
  // handlers
  handleSubmenuOpen(ev) {
    const newMenu = ev.currentTarget.id.split("_")[2];
    if (newMenu == this.menuOpen) return;
    this.menuOpen = newMenu;
    this.selectSubmenuBtn();
    this.genMenuContents();
  }
  handleSettingChange(ev) {
    ev.preventDefault();
    let settingVal;
    const settingParams = ev.currentTarget.id.split("_");
    if (settingParams[0] == "select")
      settingVal = this.qualityToNum[ev.currentTarget.value];
    else settingVal = ev.currentTarget.checked;
    this.settingsArr[settingParams[1]][settingParams[2]] = settingVal;
    console.log(this.settingsArr);
  }
}
