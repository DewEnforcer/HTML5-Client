class Settings {
  constructor() {
    this.STORAGE_KEY = "SETTINGS_VAL_KEY";
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
          name: "bg",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "space_object",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "nebula",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "star",
          isCheck: false,
          options: ["off", "good", "high"],
        },
        {
          name: "explosion",
          isCheck: false,
          options: ["off", "average", "good", "high"],
        },
        {
          name: "engine",
          isCheck: false,
          options: ["low", "high"],
        },
        {
          name: "ships",
          isCheck: false,
          options: ["low", "high"],
        },
        {
          name: "language",
          isCheck: false,
          options: ["Česky", "English"],
        },
      ],
      [
        {
          name: "actionbar_attack",
          isCheck: true,
          options: [],
        },
      ],
      [
        {
          name: "show_nick",
          isCheck: true,
          options: ["off", "on"],
        },
        {
          name: "hit_display",
          isCheck: true,
          options: [],
        },
        {
          name: "drone_display",
          isCheck: true,
          options: [],
        },
        {
          name: "minimap_bg",
          isCheck: true,
          options: [],
        },
        {
          name: "ship_hover",
          isCheck: true,
          options: [],
        },
        {
          name: "window_bg",
          isCheck: true,
          options: [],
        },
      ],
      [
        {
          name: "game_sounds",
          isCheck: false,
          options: ["off", "on"],
        },
        {
          name: "game_music",
          isCheck: false,
          options: ["off", "on"],
        },
      ],
    ];
    this.settingsBox = null;
    this.wrapperMenu = null;
    this.menuOpen = 0;
    this.setSettings();
    //UIcls.changeUiBgs(this.settingsArr[MENU_INTERFACE][5]);
  }
  resetSettings(force = false) {
    const allSettings = [];
    this.menuContents.forEach((set, i) => {
      allSettings.push([]);
      set.forEach((actualSetting) => {
        if (!actualSetting.isCheck) {
          let opts = actualSetting.options;
          let val = this.qualityToNum[opts[opts.length - 1]];
          if (typeof val === "undefined") val = opts[opts.length - 1];
          allSettings[i].push(val); //sets all to max details
        } else {
          allSettings[i].push(true);
        }
      });
    });
    if (force) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allSettings));
    }
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
    const wrapperSubmenu = ElUtils.createBox("settings_submenu_wrapper");
    this.settingsBox.appendChild(wrapperSubmenu);
    //gen submenu
    this.subSections.forEach((subSec, i) => {
      const btn = ElUtils.createBox(
        [subSec, "settings_submenu_btn", "translate_txt"],
        `submenu_btn_${i}`
      );
      btn.setAttribute("transl_key", subSec);
      btn.addEventListener("click", (ev) => this.handleSubmenuOpen(ev));
      wrapperSubmenu.appendChild(btn);
    });
    //gen menu
    this.wrapperMenu = ElUtils.createBox("settings_menu_wrapper");
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
      const wrap = ElUtils.createBox([
        `${option.name}_wrapper_main`,
        `${option.isCheck ? "check" : "option"}_wrapper_main`,
      ]);
      wrap.innerHTML = `<span class="setting_opt_title translate_txt" transl_key="${
        option.name
      }_sett">${TEXT_TRANSLATIONS[option.name + "_sett"]}</span>`; //translate in real time, translating the whole game would be a waste of resources
      if (option.isCheck) {
        const checker = ElUtils.createCheckBox(
          "settings_checkbox",
          `checkbox_${this.menuOpen}_${i}`,
          this.settingsArr[this.menuOpen][i]
        );
        checker.setAttribute("checker", "true");
        checker.addEventListener("change", (ev) =>
          this.handleSettingChange(ev)
        );
        wrap.appendChild(checker);
      } else {
        const select = ElUtils.createSelectBox(
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
    return val;
  }
  manageLoadingState(loading = true) {
    const opacityBoxCls = "settings_opct_box";
    const loaderCls = "loader_vis";
    if (loading) {
      this.settingsBox.appendChild(ElUtils.createBox(opacityBoxCls));
      const icon = document.createElement("img");
      icon.classList.add(loaderCls);
      icon.src = "./image/graphics/loading.gif";
      this.settingsBox.appendChild(icon);
    } else {
      document.querySelector("." + loaderCls).remove();
      document.querySelector("." + opacityBoxCls).remove();
    }
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
    if (settingParams[0] == "select") {
      if (ev.currentTarget.value in this.qualityToNum) {
        settingVal = this.qualityToNum[ev.currentTarget.value];
      } else {
        settingVal = ev.currentTarget.value;
      }
    } else settingVal = ev.currentTarget.checked;
    this.settingsArr[settingParams[1]][settingParams[2]] = settingVal;
    if (settingParams[1] == MENU_INTERFACE && settingParams[2] == 5) {
      //UIcls.changeUiBgs(settingVal);
    } else if (settingParams[1] == MENU_GRAPHICS && settingParams[2] == 7) {
      //lang settings
      LANGUAGE_MANAGER.setNewLanguage(settingVal);
    }
    this.saveSettings();
  }
  /* set save */
  setSettings() {
    let data = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
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
  saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settingsArr));
  }
}
