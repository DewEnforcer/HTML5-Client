class ActionBar {
    constructor() {
        this.MAX_ACTIONBAR_SLOTS = 10;
        this.SUB_MENU_VISIBLE_ITEMS = 10;
        this.FADE_DURATION = 500;
        this.MAX_OPACITY = 1;
        this.MIN_OPACITY = 0;
        this.KEY_ATTRIBUTE_ITEMSECTION = "KATS";
        this.KEY_ATTRIBUTE_ITEMID = "KATI";

        this.actionBarSlots = [];
        this.subMenuSlots = [];

        this.menuIsOpen = false;
        this.subMenuBox = null;
        this.subMenuActiveItem = null;
        this.activeSubMenu = 0;
        this.subMenuItemOffset = 0;
        this.subMenuIsScrollable = false;
        this.maxScroll = 0;
        this.lastQuickFireItem = 0;
        this.subMenuKeys = [ //put into data file
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
        this.coolingDownItems = [];
        this.avalItems = {};
        this.activeActionBarItem = null;

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

        this.btnMenuOpen = null;
        this.btnHoverStatus = "Inactive";

        this.init();
    }
    init() {
        this.getAllItems();
        this.generateActionBar();
    }
    //fetch all necessary data
    getAllItems() {
        Object.values(SUB_MENU_ITEMS).forEach((subsection, i) => {
            subsection.forEach(({name, id, hasBar, isSelectable, hasAmount}) => {
                const actionBarItemObj = {
                    name,
                    id,
                    hasBar,
                    isSelectable,
                    hasAmount,
                    amount: 0
                }
                if (!this.avalItems[i]) this.avalItems[i] = [];
                this.avalItems[i].push(actionBarItemObj);
            })
        })
    }
    //action bar generation 
    generateActionBar() {
        const ACTION_BAR_BOX_CLASS = "actionbar";
        const actionBarBox = document.createElement("div");
        actionBarBox.classList.add(ACTION_BAR_BOX_CLASS);

        this.generateActionBarSlots(actionBarBox);

        document.body.appendChild(actionBarBox);
    }
    generateActionBarSlots(actionBarBox) {
        if (this.actionBarSlots.length > 0) return;

        for (let i = 1; i <= this.MAX_ACTIONBAR_SLOTS; i++) {
            const slotObject = this.createSlotObject(i);
            this.actionBarSlots.push(slotObject);
            actionBarBox.appendChild(slotObject.element);
        }
    }
    createSlotObject(slotID) {
        return {
            slotID,
            itemEquipped: this.avalItems[0][slotID],
            element: this.createSlotElement(slotID)
        }
    }
    createSlotElement(id) {
        const slot = document.createElement("div");
        slot.id = `actionbar_slot_${id}`;
        slot.addEventListener("click", ev => console.log("CLICKED ON SLOT at createSlotElement"));
        slot.ondragover = ev => this.allowDrop(ev);
        slot.ondrop = ev => this.dropItem(ev);
        slot.ondragstart = ev => this.dragItem(ev);
        return slot;
    }
    popularizeSlotElement(el, equippedItem, itemSection) {
        if (!equippedItem) return;

        if (equippedItem.hasBar) this.generateItemBar(el);
        this.generateItemIcon(el, equippedItem, itemSection);
        if (equippedItem.hasAmount) this.generateItemAmounts(el, equippedItem.amount);
    }
    //subactionbar sections generation
    generateSubActionBarSection() {
        const box = document.createElement("div");
        box.classList.add("action_bar_submenu_list");
        document.body.appendChild(box);
        this.populateSubActionBarSection(box);
    }
    populateSubActionBarSection(box) {
        for (let i = 0; i < this.SUB_MENU_AMOUNT; i++) {
            const imgEl = `<img src="./spacemap/ui/actionBar/icons/subMenu/${i}_normal.png">`;
            const subMenuBtn = ElUtils.createButton("sub_menu_btn", `${i}_sub_menu_controller`, imgEl);
            subMenuBtn.addEventListener("click", (ev) => console.log("HANDLE CHANGE MENU populateSubActionBarSection"));
            box.appendChild(subMenuBtn);
          }
    }
    //subactionbar generation
    generateSubActionBar() {
        this.subMenuBox = ElUtils.createBox("sub_menu_box");
        document.body.appendChild(this.subMenuBox);
        this.generateSubActionBarItems();
    }
    generateSubActionBarItems() {
        this.subMenuSlots = []; //clear previous section
        const itemsList = this.avalItems[this.activeSubMenu];
        if (!itemsList) return;

        
        itemsList.forEach((item) => {
            this.subMenuSlots.push({
                slotID: this.subMenuSlots.length+1,
                itemEquipped: item,
                element: this.generateSubActionBarElement(item)
            })
        })
    }
    generateSubActionBarElement(item) {
        const element = ElUtils.createBox("item_submenu");
        element.draggable = true;
        element.addEvenetListener("click", ev => console.log("HANDLE SLOT CLICK at generateSubActionBarElement"));
        element.ondragstart = ev => this.dragItem(ev);
        element.setAttribute(this.KEY_ATTRIBUTE_ITEMSECTION, this.activeSubMenu);
        element.setAttribute(this.KEY_ATTRIBUTE_ITEMID, item.id);
        element.addEvenetListener("click", ev => console.log("HANDLE SUB MENU ITEM SELECT generateSubActionBarElement"));

        if (item.hasBar) generateItemBar(element);
        generateItemIcon(el, item, this.activeSubMenu);
        if (item.hasAmount) this.generateItemAmounts(el, item.amount);

        return element;
    }
    generateItemBar(el) {
        const amountBar = ElUtils.createBox("item_submenu_amount_bar_box");
        const amountBarReal = ElUtils.createBox("item_actionbar_amount_bar_box_real");

        amountBar.appendChild(amountBarReal);

        el.appendChild(amountBar);
    }
    generateItemAmounts(el, itemAmount) {
        const amountText = document.createElement("span");

        amountText.innerText = itemAmount;
        amountText.classList.add("item_submenu_amount_text");

        el.appendChild(amountText);   
    }
    generateItemIcon(el, {name}, itemSection) {
        const fullStringName = this.getFullItemString(name, itemSection);

        const itemIcon = document.createElement("img");
        itemIcon.src = `./spacemap/ui/actionBar/icons/${fullStringName}.png`;
        itemIcon.classList.add("item_submenu_icon");

        el.appendChild(itemIcon);
    }
    getFullItemString(name, sectionID) {
        return `${this.subMenuKeys[sectionID]}_${name}`;
    }
}