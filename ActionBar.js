class ActionBar {
  constructor() {
    this.maxSlots = 10;
    this.slots = [];
    this.btnOpenMenu = null;
    this.menuOpen = false;
    this.btnHoverStatus = "Inactive";
    this.menuGen = false;
    this.subMenuGen = [];
    this.subMenus = [];
    this.SUB_MENU_AMOUNT = 10;
    this.init();
  }

  init() {
    this.preGenSubmenus();
    this.generateActionSlots();
    this.generateMenuBtn();
  }
  preGenSubmenus() {
    for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
      this.subMenuGen.push(false);
    }
  }
  generateActionSlots() {
    const parent = document.querySelector(".actionbar");
    for (var i = 1; i <= this.maxSlots; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot_actionbar");
      slot.classList.id = i;
      slot.addEventListener("click", (ev) => this.handleSlotClick(ev));
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
  handleSlotClick(e) {
    e.preventDefault();
    const slotID = Number(e.currentTarget.id);
    let slot = this.slots[slotID];
  }
  openActionMenu() {
    if (!this.menuGen) this.genMenu();
    const box = document.querySelector(".action_bar_submenu_list");
    box.style.display = "flex"; //TODO add fadein fadeout effect, select first button, generate submenu items
  }
  closeActionMenu() {
    const box = document.querySelector(".action_bar_submenu_list");
    box.style.display = "none";
  }
  genMenuBox() {
    const box = document.createElement("div");
    box.classList.add("action_bar_submenu_list");
    document.body.appendChild(box);
  }
  genMenu() {
    this.genMenuBox();
    const box = document.querySelector(".action_bar_submenu_list");
    for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
      const subMenuBtn = document.createElement("div");
      subMenuBtn.classList.add("sub_menu_btn");
      subMenuBtn.id = i + "_sub_menu";
      subMenuBtn.innerHTML = `<img src="./spacemap/ui/actionBar/icons/subMenu/${i}_normal.png">`;
      box.appendChild(subMenuBtn);
    }
    this.menuGen = true;
  }
}
