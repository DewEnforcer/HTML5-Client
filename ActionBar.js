class ActionBar {
  constructor() {
    this.maxSlots = 10;
    this.slots = [];
    this.btnOpenMenu = null;
    this.menuOpen = false;
    this.btnHoverStatus = "Inactive";
    this.menuGen = false;
    this.subMenuBox = null;
    this.subMenuGen = [];
    this.subMenusSelectedItems = [];
    this.selectedSubmenu = 0;
    this.subMenuKeys = [
      "ammunition_laser",
      "ammunition_rocket",
      "ammunition_rocketlauncher",
      "ammunition_explosive",
      "ammunition_mine",
      "equipment_extra_cpu",
      "buy_now",
      "tech",
      "ability",
      "drone_formation",
    ];
    this.SUB_MENU_AMOUNT = 10;
    this.actionBarItems = [];
    this.actionBarKeyTransl = {
      "+": 0,
      ě: 1,
      š: 2,
      č: 3,
      ř: 4,
      ž: 5,
      ý: 6,
      á: 7,
      í: 8,
      é: 9,
    };
    this.selectedActionBarItem = 0;
    this.selectItemSound = new Sound(
      `./spacemap/audio/ui/selectItem.mp3`,
      false,
      true
    );
    this.selectMenuSound = new Sound(
      `./spacemap/audio/ui/selectMenu.mp3`,
      false,
      true
    );
    this.init();
  }

  init() {
    this.generateActionSlots();
    this.preGenSubmenus();
    this.preGenActionbarItems();
    this.generateMenuBtn();
  }
  preGenSubmenus() {
    for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
      this.subMenuGen.push(false);
      this.subMenusSelectedItems.push(0);
    }
  }
  preGenActionbarItems() {
    for (let i = 0; i < this.maxSlots; i++) {
      this.actionBarItems.push({});
    }
    this.setActionbarItems("0;0|0;1");
  }
  generateActionSlots() {
    const parent = document.querySelector(".actionbar");
    for (var i = 1; i <= this.maxSlots; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot_actionbar");
      slot.id = i - 1 + "_action_bar";
      slot.addEventListener("click", (ev) => this.handleSlotClick(ev));
      this.slots.push(slot);
      parent.appendChild(slot);
    }
  }
  generateMenuBtn() {
    this.btnOpenMenu = document.createElement("img");
    this.btnOpenMenu.src =
      "./spacemap/ui/actionBar/actionMenuClosedInactive.png";
    this.btnOpenMenu.classList.add("btn_actionbar");
    this.btnOpenMenu.id = "btn_open_action_menu";
    document.querySelector(".actionbar").appendChild(this.btnOpenMenu);
    this.btnOpenMenu.addEventListener("click", (ev) => this.handleOpenMenu(ev));
  }
  handleOpenMenu(e) {
    e.preventDefault();
    let btnImg = `./spacemap/ui/actionBar/actionMenu`;
    if (this.menuOpen) {
      //close
      this.closeActionMenu();
      btnImg += "Closed";
    } else {
      this.openActionMenu();
      btnImg += "Open";
      //open
    }
    btnImg += this.btnHoverStatus + ".png";
    e.currentTarget.src = btnImg;
    this.menuOpen = !this.menuOpen;
  }
  handleSlotChangeKeyboard(keyPress) {
    const slotID = this.actionBarKeyTransl[keyPress];
    if (slotID == this.selectedActionBarItem) return;
    this.selectedActionBarItem = slotID;
    this.selectActionbarItem();
    this.selectItemSound.play();
  }
  handleSlotClick(e) {
    e.preventDefault();
    const slotID = Number(e.currentTarget.id.split("_")[0]);
    if (slotID == this.selectedActionBarItem) return;
    this.selectedActionBarItem = slotID;
    this.selectActionbarItem();
    this.selectItemSound.play();
  }
  openActionMenu() {
    if (!this.menuGen) this.genMenu();
    const box = document.querySelector(".action_bar_submenu_list");
    box.style.display = "flex"; //TODO add fadein fadeout effect,hover effects, add packet commands for the actionbar trigger
    this.subMenuBox.style.display = "flex";
    this.genSubMenu();
  }
  closeActionMenu() {
    const box = document.querySelector(".action_bar_submenu_list");
    box.style.display = "none";
    this.subMenuBox.style.display = "none";
  }
  genMenuBox() {
    const box = document.createElement("div");
    box.classList.add("action_bar_submenu_list");
    document.body.appendChild(box);
    this.subMenuBox = document.createElement("div");
    this.subMenuBox.classList.add("sub_menu_box");
    document.body.appendChild(this.subMenuBox);
  }
  genMenu() {
    this.genMenuBox();
    const box = document.querySelector(".action_bar_submenu_list");
    for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
      const subMenuBtn = document.createElement("div");
      let classes = "sub_menu_btn";
      subMenuBtn.classList.add(classes);
      subMenuBtn.id = i + "_sub_menu";
      subMenuBtn.innerHTML = `<img src="./spacemap/ui/actionBar/icons/subMenu/${i}_normal.png">`;
      subMenuBtn.addEventListener("click", (ev) => this.handleChangeMenu(ev));
      box.appendChild(subMenuBtn);
    }
    this.selectMenuBtn();
    this.menuGen = true;
  }
  clearSubMenuBox() {
    this.subMenuBox.innerHTML = "";
  }
  genSubMenu() {
    this.clearSubMenuBox();
    this.subMenuGen[this.selectedSubmenu] = true;
    if (this.selectedSubmenu in SUB_MENU_ITEMS !== true) return;
    const items = SUB_MENU_ITEMS[this.selectedSubmenu];
    items.forEach((item, i) => {
      //switch to another subfunction
      const newItem = document.createElement("div");
      newItem.classList.add("item_submenu");
      const itemName = `${this.subMenuKeys[this.selectedSubmenu]}_${item.name}`;
      newItem.id = `item_submenu_${itemName}`;
      newItem.setAttribute("item_id", i);
      if (item.hasBar) {
        const amountBar = document.createElement("div");
        amountBar.classList.add("item_submenu_amount_bar_box");
        newItem.appendChild(amountBar);
      }
      const itemIcon = document.createElement("img");
      itemIcon.src = `./spacemap/ui/actionBar/icons/${itemName}.png`;
      itemIcon.classList.add("item_submenu_icon");
      newItem.appendChild(itemIcon);
      if (item.hasAmount) {
        const amountText = document.createElement("span");
        amountText.innerText = "0";
        amountText.classList.add("item_submenu_amount_text");
        newItem.appendChild(amountText);
      }
      newItem.addEventListener("click", (ev) =>
        this.handleSubMenuItemSelect(ev)
      );
      this.subMenuBox.appendChild(newItem);
    });
    this.selectSubMenuItem();
  }
  setActionbarItems(data) {
    data = data.split("|");
    data.forEach((item, i) => {
      if (i >= this.maxSlots) return;
      const itemPos = item.split(";");
      const itemData = {
        ...SUB_MENU_ITEMS[itemPos[0]][itemPos[1]],
        menu: itemPos[0],
      };
      if (typeof itemData === "undefined") return;
      this.actionBarItems[i] = itemData;
    });
    this.popularizeSlotBar();
  }
  selectMenuBtn() {
    const currentSelect = document.querySelector(".sub_menu_btn_active");
    if (currentSelect != null)
      currentSelect.classList.remove("sub_menu_btn_active"); //removes the active status from previously selected btn
    document.querySelectorAll(".sub_menu_btn").forEach((btn, i) => {
      if (i == this.selectedSubmenu) btn.classList.add("sub_menu_btn_active");
    });
  }
  selectSubMenuItem() {
    document.querySelectorAll(".item_submenu").forEach((item, i) => {
      item.classList.remove("sub_item_select");
      if (
        this.subMenusSelectedItems[this.selectedSubmenu] == i &&
        this.isSelectable(i)
      ) {
        item.classList.add("sub_item_select");
      }
    });
  }
  selectActionbarItem() {
    const selectActionbar = document.querySelector(".slot_actionbar_select");
    if (selectActionbar != null)
      selectActionbar.classList.remove("slot_actionbar_select");
    document.querySelectorAll(".slot_actionbar").forEach((slot, i) => {
      if (i == this.selectedActionBarItem)
        slot.classList.add("slot_actionbar_select");
    });
  }
  isSelectable(id) {
    if (this.selectedSubmenu in SUB_MENU_ITEMS !== true) return false;
    return SUB_MENU_ITEMS[this.selectedSubmenu][id].isSelectable;
  }
  handleChangeMenu(ev) {
    ev.preventDefault();
    const newSection = Number(ev.currentTarget.id.split("_")[0]);
    if (newSection == this.selectedSubmenu) return;
    this.selectedSubmenu = newSection;
    this.selectMenuBtn();
    this.genSubMenu();
    this.selectMenuSound.play();
  }
  handleSubMenuItemSelect(ev) {
    ev.preventDefault();
    const id = Number(ev.currentTarget.attributes.item_id.value);
    if (id == this.subMenusSelectedItems[this.selectedSubmenu]) return;
    this.subMenusSelectedItems[this.selectedSubmenu] = id;
    this.selectSubMenuItem();
    this.selectItemSound.play();
  }
  popularizeSlotBar() {
    this.actionBarItems.forEach((item, i) => {
      if ("id" in item !== true) return;
      const itemName = `${this.subMenuKeys[item.menu]}_${item.name}`;
      if (item.hasBar) {
        const amountBar = document.createElement("div");
        amountBar.classList.add("item_actionbar_amount_bar_box");
        this.slots[i].appendChild(amountBar);
      }
      const itemIcon = document.createElement("img");
      itemIcon.src = `./spacemap/ui/actionBar/icons/${itemName}.png`;
      itemIcon.classList.add("item_actionbar_icon");
      this.slots[i].appendChild(itemIcon);
      if (item.hasAmount) {
        const amountText = document.createElement("span");
        amountText.innerText = "0";
        amountText.classList.add("item_actionbar_amount_text");
        this.slots[i].appendChild(amountText);
      }
    });
    this.selectActionbarItem();
  } //adds items on the slotbar
}
