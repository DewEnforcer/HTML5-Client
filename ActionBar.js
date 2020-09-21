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
    this.submenuItemOffset = 0;
    this.submenuVisibleMax = 10;
    this.submenuScrollGen = false;
    this.maxScroll = 0;
    this.lastLaser = 0;
    this.subMenuKeys = [
      "ammunition_laser",
      "ammunition_rocket",
      "ammunition_rocketlauncher",
      "ammunition_specialammo",
      "ammunition_mine",
      "equipment_extra_cpu",
      "buy_now",
      "tech",
      "ability",
      "drone_formation",
    ];
    this.SUB_MENU_AMOUNT = 10;
    this.actionBarItems = [];
    this.cooldownItems = [];
    this.itemAmounts = [];
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
    //
    this.fadeDuration = 500;
    this.maxOpacity = 1;
    this.minOpacity = 0;
    //

    this.init();
  }

  init() {
    this.generateActionSlots();
    this.preGenSubmenus();
    this.preGenActionbarItems();
    this.preGenItemAmounts();
    this.generateMenuBtn();
  }
  preGenSubmenus() {
    for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
      this.subMenuGen.push(false);
      this.cooldownItems.push({});
      this.subMenusSelectedItems.push(0);
    }
  }
  preGenItemAmounts() {
    for (let subs in SUB_MENU_ITEMS) {
      let newSecObj = {};
      for (let items in SUB_MENU_ITEMS[subs]) {
        const item = SUB_MENU_ITEMS[subs][items];
        newSecObj = { ...newSecObj, [item.id]: 0 };
      }
      this.itemAmounts.push(newSecObj);
    }
  }
  preGenActionbarItems() {
    for (let i = 0; i < this.maxSlots; i++) {
      this.actionBarItems.push({});
    }
  }
  generateActionSlots() {
    const parent = document.createElement("div");
    parent.classList.add("actionbar");
    document.body.appendChild(parent);
    for (var i = 1; i <= this.maxSlots; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot_actionbar");
      slot.id = i - 1 + "_action_bar";
      slot.addEventListener("click", (ev) => this.handleSlotClick(ev));
      slot.ondragover = (ev) => this.allowDrop(ev);
      slot.ondrop = (ev) => this.dropItem(ev);
      slot.ondragstart = (ev) => this.dragItem(ev);
      this.slots.push(slot);
      parent.appendChild(slot);
    }
  }
  generateMenuBtn() {
    this.btnOpenMenu = document.createElement("img");
    this.btnOpenMenu.src =
      "./spacemap/ui/actionBar/actionMenuClosedInactive.png";
    this.btnOpenMenu.classList.add("btn_actionbar", "btn_actionbar_inactive");
    this.btnOpenMenu.id = "btn_open_action_menu";
    this.btnOpenMenu.addEventListener("mouseover", () => {
      this.handleBtnHover();
    });
    this.btnOpenMenu.addEventListener("mouseout", () => {
      this.handleBtnHover(false);
    });
    document.querySelector(".actionbar").appendChild(this.btnOpenMenu);
    this.btnOpenMenu.addEventListener("click", (ev) => this.handleOpenMenu(ev));
  }
  handleBtnHover(hover = true) {
    this.btnOpenMenu.classList.remove(
      "btn_actionbar_inactive",
      "btn_actionbar_active"
    );
    if (hover) {
      this.btnHoverStatus = "Active";
      this.btnOpenMenu.classList.add("btn_actionbar_active");
    } else {
      this.btnHoverStatus = "Inactive";
      this.btnOpenMenu.classList.add("btn_actionbar_inactive");
    }
    const openStatus = ["Closed", "Open"];
    this.btnOpenMenu.src =
      "./spacemap/ui/actionBar/actionMenu" +
      openStatus[Number(this.menuOpen)] +
      "" +
      this.btnHoverStatus +
      ".png";
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
    const slotID = BTN_SWITCH.indexOf(keyPress);
    this.handleItemTriggered([
      this.actionBarItems[slotID].menu,
      this.actionBarItems[slotID].id,
    ]);
    if (slotID == this.selectedActionBarItem) return;
    this.selectedActionBarItem = slotID;
    this.selectActionbarItem();
    this.selectItemSound.play();
  }
  handleSlotClick(e) {
    e.preventDefault();
    const slotID = Number(e.currentTarget.id.split("_")[0]);
    this.handleItemTriggered([
      this.actionBarItems[slotID].menu,
      this.actionBarItems[slotID].id,
    ]);
    if (slotID == this.selectedActionBarItem) return;
    this.selectedActionBarItem = slotID;
    this.selectActionbarItem();
    this.selectItemSound.play();
  }
  openActionMenu() {
    //TODO finish scroll btn fades
    if (!this.menuGen) this.genMenu();
    const box = document.querySelector(".action_bar_submenu_list");
    box.style.display = "flex";
    this.subMenuBox.style.display = "flex";
    MAIN.fadeIn(this.minOpacity, this.maxOpacity, this.fadeDuration, box, 0.1);
    MAIN.fadeIn(
      this.minOpacity,
      this.maxOpacity,
      this.fadeDuration,
      this.subMenuBox,
      0.1
    );
    this.genSubMenu();
  }
  closeActionMenu() {
    const btn1 = document.getElementById("btn_submenu_scroll_forward");
    const btn2 = document.getElementById("btn_submenu_scroll_backward");
    const box = document.querySelector(".action_bar_submenu_list");
    MAIN.fadeOut(this.minOpacity, this.maxOpacity, this.fadeDuration, box, 0.1);
    MAIN.fadeOut(
      this.minOpacity,
      this.maxOpacity,
      this.fadeDuration,
      this.subMenuBox,
      0.1
    );
    MAIN.fadeOut(
      this.minOpacity,
      this.maxOpacity,
      this.fadeDuration,
      btn1,
      0.1
    );
    MAIN.fadeOut(
      this.minOpacity,
      this.maxOpacity,
      this.fadeDuration,
      btn2,
      0.1
    );
    setTimeout(() => {
      box.style.display = "none";
      this.subMenuBox.style.display = "none";
      btn1.style.display = "none";
      btn2.style.display = "none";
    }, this.fadeDuration);
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
  // submenu scrolling
  removeSubmenuScrollBtns() {
    if (!this.submenuScrollGen) return;
    this.submenuScrollGen = false;
    document.getElementById("btn_submenu_scroll_forward").remove();
    document.getElementById("btn_submenu_scroll_backward").remove();
  }
  genSubmenuScrollBtns() {
    if (this.submenuScrollGen) return;
    this.submenuScrollGen = true;
    const margin = 2;
    const iconHeightHalf = 6;
    const iconWidth = 12;
    const btnForward = document.createElement("img");
    const btnBackward = document.createElement("img");
    btnForward.id = "btn_submenu_scroll_forward";
    btnBackward.id = "btn_submenu_scroll_backward";
    btnForward.src = "./spacemap/ui/actionBar/scroll_normal.png";
    btnBackward.src = "./spacemap/ui/actionBar/scroll_normal.png";
    btnBackward.classList.add("btn_submenu_scroll");
    btnForward.classList.add(
      "btn_submenu_scroll_forward",
      "btn_submenu_scroll"
    );
    const coords = document
      .querySelector(".sub_menu_box")
      .getBoundingClientRect();
    btnBackward.style.left = coords.x - margin - iconWidth + "px";
    btnBackward.style.top = coords.y + iconHeightHalf + "px";
    btnForward.style.left = coords.x + coords.width + margin + "px";
    btnForward.style.top = coords.y + iconHeightHalf + "px";
    btnForward.value = "forward";
    btnBackward.value = "backwards";
    btnForward.addEventListener("click", (ev) => this.handleSubmenuScroll(ev));
    btnBackward.addEventListener("click", (ev) => this.handleSubmenuScroll(ev));
    document.body.appendChild(btnForward);
    document.body.appendChild(btnBackward);
  }
  handleSubmenuScroll(ev) {
    const val = ev.currentTarget.value;
    if (val == "forward") {
      if (this.submenuItemOffset < this.maxScroll) this.submenuItemOffset += 1;
    } else {
      if (this.submenuItemOffset > 0) this.submenuItemOffset -= 1;
    }
    this.genSubMenu(true);
  }
  //
  genSubMenu(sameSec = false) {
    this.clearSubMenuBox();
    this.subMenuGen[this.selectedSubmenu] = true;
    if (this.selectedSubmenu in SUB_MENU_ITEMS !== true) return;
    const items = SUB_MENU_ITEMS[this.selectedSubmenu];
    this.maxScroll = items.length - this.submenuVisibleMax;
    if (this.maxScroll < 0) this.maxScroll = 0;
    if (!sameSec) {
      this.submenuItemOffset = 0; //reset offset;
      this.removeSubmenuScrollBtns();
    }
    items.forEach((item, i) => {
      if (i < this.submenuItemOffset) return;
      if (i >= this.submenuVisibleMax) {
        this.genSubmenuScrollBtns();
        if (i >= this.submenuVisibleMax + this.submenuItemOffset) return;
      }
      //TODO - add max item generation and horizontal item scroller
      //switch to another subfunction
      const newItem = document.createElement("div");
      newItem.classList.add("item_submenu");
      newItem.draggable = true;
      newItem.addEventListener("click", (ev) => this.handleSlotClick(ev));
      newItem.ondragstart = (ev) => this.dragItem(ev);
      const itemName = `${this.subMenuKeys[this.selectedSubmenu]}_${item.name}`;
      newItem.id = `item_submenu_${itemName}`;
      newItem.setAttribute("item_id", i);
      newItem.setAttribute("item_info", `${this.selectedSubmenu}_${item.id}`); //menu, id
      if (item.hasBar) {
        const amountBar = document.createElement("div");
        const amountBarReal = document.createElement("div");
        amountBarReal.classList.add("item_actionbar_amount_bar_box_real");
        amountBar.classList.add("item_submenu_amount_bar_box");
        amountBar.appendChild(amountBarReal);
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
    this.updateItemAmounts();
  }
  setActionbarItems(data) {
    data = trimData(data);
    data.forEach((item, i) => {
      if (i >= this.maxSlots) return;
      const itemPos = item.split(";");
      if (itemPos[0] == -1) return;
      const itemData = {
        ...SUB_MENU_ITEMS[itemPos[0]][itemPos[1]],
        menu: itemPos[0],
      };
      if (typeof itemData === "undefined") return;
      this.actionBarItems[i] = itemData;
    });
    this.popularizeSlotBar(true);
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
    if (id in this.cooldownItems[this.selectedSubmenu] === true) return false;
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
    this.handleItemTriggered([this.selectedSubmenu, id]);
    if (id == this.subMenusSelectedItems[this.selectedSubmenu]) return;
    this.subMenusSelectedItems[this.selectedSubmenu] = id;
    this.selectSubMenuItem();
    this.selectItemSound.play();
  }
  popularizeSlotBar(init = false) {
    this.actionBarItems.forEach((item, i) => {
      this.slots[i].innerHTML = ""; //clear the slot of previous item
      this.slots[i].draggable = false;
      if ("id" in item !== true) {
        this.slots[i].setAttribute("item_info", `-1_-1`); //menu, id
        return;
      }
      this.slots[i].setAttribute("item_info", `${item.menu}_${item.id}`); //menu, id
      const itemName = `${this.subMenuKeys[item.menu]}_${item.name}`;
      this.slots[i].draggable = true; //set only on slots with items
      if (item.hasBar) {
        const amountBar = document.createElement("div");
        const amountBarReal = document.createElement("div");
        amountBarReal.classList.add("item_actionbar_amount_bar_box_real");
        amountBar.classList.add("item_actionbar_amount_bar_box");
        amountBar.appendChild(amountBarReal);
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
      //check cld
      if (item.id in this.cooldownItems[item.menu] === true) {
        //is on cooldown, add visual cooldown graphic
        const img = document.createElement("img");
        img.classList.add(`cooldown_${item.menu}_${item.id}`, "cooldown_icon");
        this.slots[i].appendChild(img);
      }
    });
    this.selectActionbarItem();
    if (init) {
      SOCKET.sendPacket([REQUEST_ITEM_AMOUNTS]);
      return;
    }
    this.updateItemAmounts();
  } //adds items on the slotbar
  setItemAmount(data) {
    data = trimData(data);
    data.forEach((section, i) => {
      section = section.split("/");
      section.forEach((item) => {
        item = item.split(";");
        const itemID = item[0];
        const amount = Number(item[1]);
        this.itemAmounts[i] = { ...this.itemAmounts[i], [itemID]: amount };
      });
    });
    this.updateItemAmounts();
  }
  setItemAmountBar(value, barReal, maxValue) {
    let fillPerc = (value / maxValue) * 100;
    if (fillPerc > 100) fillPerc = 100;
    barReal.style.width = fillPerc + "%";
  }
  updateItemAmounts() {
    const slots = document.querySelectorAll("[item_info]");
    slots.forEach((slot) => {
      const slotData = slot.getAttribute("item_info").split("_");
      if (slotData[0] < 0) return;
      const maxDisplayNum = 1000000;
      const amount =
        this.itemAmounts[slotData[0]][slotData[1]] > maxDisplayNum
          ? maxDisplayNum - 1
          : this.itemAmounts[slotData[0]][slotData[1]];
      const submenuItem = SUB_MENU_ITEMS[slotData[0]][slotData[1]];
      if (submenuItem.hasAmount) {
        slot.getElementsByTagName("span")[0].innerText = amount;
      }
      if (submenuItem.hasBar) {
        const barMax = "maxBar" in submenuItem ? submenuItem.maxBar : 1000;
        this.setItemAmountBar(
          amount,
          slot.getElementsByTagName("div")[1],
          barMax
        );
      }
    });
  }
  /* drag n drop */
  checkSwitchStatus(originID) {
    return originID.includes("action_bar");
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  dragItem(ev) {
    if (!this.menuOpen) return;
    const draggedItemData = ev.path[1].attributes.item_info.value.split("_");
    const elId = ev.path[1].id;
    draggedItemData.push(elId);
    ev.dataTransfer.setData("itemData", JSON.stringify(draggedItemData));
  }
  dropItem(ev) {
    const itemData = JSON.parse(ev.dataTransfer.getData("itemData"));
    let targetIndex = ev.target.id.split("_")[0];
    if (targetIndex == "") targetIndex = ev.path[1].id.split("_")[0];
    itemData.push(targetIndex);
    if (this.checkSwitchStatus(itemData[2])) {
      this.switchItems(itemData);
    } else {
      this.transferElement(itemData);
    }
    this.popularizeSlotBar();
    this.dispatchActionbarSlotsData();
  }
  switchItems(itemData) {
    //here we can use actionbaritems since we know the change is coming from actionbar
    const originIndex = itemData[2].split("_")[0];
    const targetIndex = itemData[3];
    const targetItem = this.actionBarItems[targetIndex];
    const originItem = this.actionBarItems[originIndex];
    this.actionBarItems[targetIndex] = originItem;
    this.actionBarItems[originIndex] = targetItem;
  }
  transferElement(itemData) {
    const itemMenu = itemData[0];
    const itemID = itemData[1];
    const originIndex = itemData[2].split("_")[0];
    const targetIndex = itemData[3];
    const transferedItem = {
      ...SUB_MENU_ITEMS[itemMenu][itemID],
      menu: itemMenu,
    };
    this.actionBarItems[originIndex] = {};
    this.actionBarItems[targetIndex] = transferedItem;
  }
  dispatchActionbarSlotsData() {
    const packetCollection = [ACTIONBAR_CHANGE];
    let menu, id;
    this.actionBarItems.forEach((item) => {
      menu = -1; // -1 = empty
      id = -1;
      if ("id" in item === true) {
        menu = item.menu;
        id = item.id;
      }
      packetCollection.push(menu + ";" + id);
    });
    SOCKET.sendPacket(packetCollection);
  }
  //cld handlers
  removeCooldown(items) {
    items.forEach((item) => {
      item.querySelector(".cooldown_icon").remove();
    });
  }
  cooldownHandler(cldItem) {
    const percComplete = Math.round(
      (cldItem.timeSpent / cldItem.timeEnd) * 100
    );
    const items = document.querySelectorAll(
      `[item_info="${cldItem.itemType}_${cldItem.itemID}"]`
    );
    if (percComplete >= 100) {
      delete this.cooldownItems[cldItem.itemType][cldItem.itemID];
      this.removeCooldown(items);
      return;
    }
    items.forEach((item) => {
      if (cldItem.timeSpent == 0) {
        const img = document.createElement("img");
        img.classList.add(
          `cooldown_${cldItem.itemType}_${cldItem.itemID}`,
          "cooldown_icon"
        );
        item.appendChild(img);
      }
      const img = document.querySelectorAll(
        `.cooldown_${cldItem.itemType}_${cldItem.itemID}`
      );
      img.forEach(
        (icon) =>
          (icon.src = `./spacemap/ui/actionBar/cooldown/${percComplete}.png`)
      );
    });
    cldItem.timeSpent += 1;
    setTimeout(() => {
      this.cooldownHandler(cldItem);
    }, 1000);
  }
  setItemCooldown(data) {
    data = trimData(data);
    const itemType = this.getItemPacket(data[0], true);
    const itemID = data[1];
    const time = data[2];
    if (itemID in this.cooldownItems[itemType] === true) {
      //reset time since function is already ticking
      this.cooldownItems[itemType][itemID].timeEnd = time;
      this.cooldownItems[itemType][itemID].timeSpent = 0;
    } else {
      //create new cd
      const cldItem = { itemID, itemType, timeEnd: time, timeSpent: 0 };
      this.cooldownItems[itemType] = {
        ...this.cooldownItems[itemType],
        [itemID]: cldItem,
      };
      this.cooldownHandler(cldItem);
    }
  }
  /* handle item trigger */
  handleItemTriggered(itemData) {
    const itemMenu = itemData[0];
    const itemID = itemData[1];
    if (
      typeof itemMenu == "undefined" ||
      typeof itemID == "undefined" ||
      itemID in this.cooldownItems[itemMenu] === true
    )
      return; //empty slot or on cooldown or 0 ammo TODO add 0 ammo fix
    const packetCollection = [ITEM_SELECT];
    packetCollection.push(this.getItemPacket(itemMenu));
    packetCollection.push(itemID);
    SOCKET.sendPacket(packetCollection);
    if (itemMenu == 0 && SETTINGS.settingsArr[1][0]) {
      //actionbar attack
      HERO.handleAttackState(this.lastLaser == itemID);
      this.lastLaser = itemID;
    }
  }
  getItemPacket(key, reverse = false) {
    const menuPackets = [
      "L",
      "R",
      "RL",
      "EX",
      "MIN",
      "CPU",
      "BN",
      "TCH",
      "SK",
      "DF",
    ];
    if (reverse) {
      return menuPackets.indexOf(key);
    }
    return menuPackets[key];
  }
}
