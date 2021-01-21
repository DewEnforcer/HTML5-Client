class ActionBar extends Draggable {
    constructor() {
        super();
        this.MAX_ACTION_BAR_SLOTS = 10;
        this.MAX_SUB_MENU_SLOTS = 10;
        this.MAX_SUB_MENU_SECTIONS = 10;
        
        this.FADE_DURATION = 500;
        this.MAX_OPACITY = 1;
        this.MIN_OPACITY = 0;
        this.FADE_TICK = 0.1;

        this.slotTypeKey = "SLOT_TYPE";

        this.actionBarBox = null;
        this.subActionBox = null;
        this.subSectionBox = null;
        
        this.actionBarSlots = [];
        this.subMenuSlots = [];

        this.avalItems = {};

        //this.activeItems = {};
        this.selectedItems = {
            "submenu": {},
            "actionbar": {}
        };

        this.activeSubSectionID = 0;

        this.lastSelectedLaserID = 0

        this.isOpenSubmenu = false;

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

        this.init();
    }

    init() {
        this.loadMenuItems();
        this.generateActionBarBox();
    }

    loadMenuItems() {
        Object.values(SUB_MENU_ITEMS).forEach((subs, i) => {
            if (!this.avalItems[i]) this.avalItems[i] = {};
            subs.forEach(({name, id, hasBar, isSelectable, hasAmount}) => {
                const itemObject = {
                    fullname: this.getFullItemString(name, i),
                    id,
                    hasBar,
                    isSelectable,
                    hasAmount,
                    amount: 0,
                    sectionID: i
                }
                this.avalItems[i] = {...this.avalItems[i], [id]: itemObject};
            })
        })
    }
    loadSubsections(subsID) {
        //this.activeItems[subsID] = {};
        this.selectedItems[subsID] = {};
    }
    //GENERATION
    //slot wrapper management
    generateActionBarBox() {
        this.actionBarBox = ElUtils.createBox("actionbar");

        this.generateActionBarSlots(this.actionBarBox);

        document.body.appendChild(this.actionBarBox);
    }
    generateSubMenuBarBox() {
        this.subActionBox = ElUtils.createBox("sub_menu_box");

        this.generateSubMenuSlots(this.subActionBox);

        document.body.appendChild(this.subActionBox);
    }
    generateSubMenuSectionsBox() {
        this.subSectionBox = ElUtils.createBox("action_bar_submenu_list");

        this.populateSubActionBarSection(this.subSectionBox);

        document.body.appendChild(this.subSectionBox);
    }
    populateSubActionBarSection(box) {
        for (let i = 0; i < this.MAX_SUB_MENU_SECTIONS; i++) {
            const imgEl = `<img src="./spacemap/ui/actionBar/icons/subMenu/${i}_normal.png">`;
            const subMenuBtn = ElUtils.createBox("sub_menu_btn", `${i}_sub_menu_controller`, imgEl);
            subMenuBtn.addEventListener("click", (ev) => this.handleSectionChange(ev, i));
            subMenuBtn.setAttribute("sectionID", i);
            box.appendChild(subMenuBtn);
          }
    }
    generateActionBarSlots(actionBarBox) {
        for (let i = 0; i < this.MAX_ACTION_BAR_SLOTS; i++) {
            const slotObject = this.generateSlotObject(i, this.generateSlotElement(i));
            this.populateSlot(slotObject);
            actionBarBox.appendChild(slotObject.element);
            this.actionBarSlots.push(slotObject);
        }
    }
    generateSubMenuSlots(subMenuBox) {
        this.subMenuSlots = [];
        subMenuBox.innerHTML = ""; //cleanup

        const subSectionItems = Object.values(this.avalItems[this.activeSubSectionID]);
        for (let key in subSectionItems) {
            if (key >= this.MAX_SUB_MENU_SLOTS) break;
            const item = subSectionItems[key];
            
            const slotObject = this.generateSlotObject(key, this.generateSlotElement(key, true), true);

            slotObject.placedItem = {...item};

            this.populateSlot(slotObject);
            subMenuBox.appendChild(slotObject.element);
            this.subMenuSlots.push(slotObject);
        }
    }
    //slot management
    generateSlotElement(id, isSubmenu = false) {
        const subStr = this.getSlotSectionString(isSubmenu);

        const slot = ElUtils.createBox(`slot_actionbar`, `${subStr}_slot_${id}`);
        slot.addEventListener("click", ev => this.handleSlotActivation(ev, id, subStr));
        if (!isSubmenu) slot.ondragover = ev => this.allowDrop(ev);
        if (!isSubmenu) slot.ondrop = ev => this.dropItem(ev,{id, subStr});
        slot.ondragstart = ev => this.dragItem(ev, id, subStr);
        slot.setAttribute(this.slotTypeKey, subStr);
        slot.setAttribute("slotID", id);

        return slot;
    }
    generateSlotObject(id, el, isSubmenu = false) {
        return {
            slotID: id,
            placedItem: null,
            isSelected: false,
            isSubmenu, //gives certain functions to the slot (cant be dragged etc)
            element: el
        }
    }
    populateSlot({placedItem, element}) {
        this.cleanupSlot(element);
        
        if (!placedItem) return;

        if (placedItem.hasBar) this.generateItemBar(element);
        this.generateItemIcon(element, placedItem);
        if (placedItem.hasAmount) this.generateItemAmounts(element, placedItem.amount);
    }

    //Toggle menus
    toggleActionMenu() {
        if (this.isOpenSubmenu) this.closeActionMenu();
        else this.openActionMenu();
    }

    openActionMenu() {
        const toDisplay = "flex";

        this.generateSubMenuSectionsBox();
        this.generateSubMenuBarBox();
        this.markActiveSubsection();

        this.subSectionBox.style.display = toDisplay;
        this.subActionBox.style.display = toDisplay;

        ElUtils.fadeIn(this.MIN_OPACITY, this.MAX_OPACITY, this.FADE_DURATION, this.subSectionBox, this.FADE_TICK);
        ElUtils.fadeIn(this.MIN_OPACITY, this.MAX_OPACITY, this.FADE_DURATION, this.subActionBox, this.FADE_TICK);

        this.isOpenSubmenu = true;
    }
    closeActionMenu() {
        ElUtils.fadeOut(this.MIN_OPACITY, this.MAX_OPACITY, this.FADE_DURATION, this.subSectionBox, this.FADE_TICK);
        ElUtils.fadeOut(this.MIN_OPACITY, this.MAX_OPACITY, this.FADE_DURATION, this.subActionBox, this.FADE_TICK);

        setTimeout(() => {
            this.subSectionBox.remove();
            this.subActionBox.remove();
        }, this.FADE_DURATION);

        this.isOpenSubmenu = false;
    }
    //Dragging manager
    manageSlotDragging(transferSlot, targetSlot) {
        const transferItem = this.getItemDataOnSlot(transferSlot);
        const targetItem = this.getItemDataOnSlot(targetSlot);

        if (targetItem.isSubmenu) return;

        if (targetItem.isSubmenu === transferItem.isSubmenu) return this.switchActionBarItems(transferItem, targetItem);

        this.putItemOnSlot(transferItem, targetItem);
    }
    putItemOnSlot(transferItem, targetItem) {
        targetItem.placedItem = {...transferItem.placedItem};

        this.populateSlot(targetItem);
        
        if (transferItem.isSelected) this.addSelectedSlot(targetItem);
    }
    switchActionBarItems(transferItem, targetItem) { 
        let targetItemCopy = {...targetItem.placedItem};
        if (!targetItemCopy.id) targetItemCopy = null;

        targetItem.placedItem = {...transferItem.placedItem};
        transferItem.placedItem = targetItemCopy;

        this.populateSlot(targetItem);
        this.populateSlot(transferItem);

        this.switchSlotMarking(transferItem, targetItem);
    }
    //marking selected slots
    addSelectedSlot(slot) {
        const sectionStr = this.getSlotSectionString(slot.isSubmenu)

        if (this.selectedItems[sectionStr][slot.slotID]) this.removeSelectedSlot(slot); //cleanup if slot already marked

        this.selectedItems[sectionStr] = {...this.selectedItems[sectionStr], [slot.slotID]: slot};
        slot.isSelected = true;

        this.addSlotMarking(slot.element);
    }
    removeSelectedSlot(slot) {
        const sectionStr = this.getSlotSectionString(slot.isSubmenu)

        delete this.selectedItems[sectionStr][slot.slotID];
        slot.isSelected = false;

        this.removeSlotMarking(slot.element);
    }
    addSlotMarking(el) {
        el.classList.add("slot_actionbar_select");
    }
    removeSlotMarking(el) {
        el.classList.remove("slot_actionbar_select");
    }
    switchSlotMarking(transferSlot, targetSlot) {
        if (transferSlot.isSelected) {
            this.removeSelectedSlot(transferSlot);
            this.addSelectedSlot(targetSlot);
            return;
        }

        if (targetSlot.isSelected) {
            this.removeSelectedSlot(targetSlot);
            this.addSelectedSlot(transferSlot);
        }
    }
    markSlotActive(item) { //rework
        const slotActiveClass = "slot_actionbar_select"; 

        const handleClassModifying = ({element, placedItem}) => {
            if (!placedItem || placedItem.fullname !== item.fullname) return element.classList.remove(slotActiveClass);
            element.classList.add(slotActiveClass);
        }

        this.actionBarSlots.forEach(s => handleClassModifying(s))

        this.subMenuSlots.forEach(s => handleClassModifying(s))

    }
    getItemDataOnSlot({id, barType}) {
        if (barType === "submenu") return this.subMenuSlots[id];
        return this.actionBarSlots[id];
    }
    //section menu functions
    markActiveSubsection() {
        const className = "sub_menu_btn_active";

        document.querySelectorAll(`.sub_menu_btn`).forEach((elBtn) => {
            if (elBtn.getAttribute("sectionID") == this.activeSubSectionID) return elBtn.classList.add(className);
            elBtn.classList.remove(className);
        })
    }
    //event handlers
    handleSectionChange(ev, sectionID) {
        ev.preventDefault();

        if (!this.avalItems[sectionID] || sectionID === this.activeSubSectionID) return;

        this.activeSubSectionID = sectionID;

        this.markActiveSubsection();
        this.generateSubMenuSlots(this.subActionBox);
    }
    handleSlotActivation(ev, slotID, subStr) {
        if (ev) ev.preventDefault();
        const slotsSource = subStr === "submenu" ? this.subMenuSlots : this.actionBarSlots;

        const slot = slotsSource[slotID];

        this.addSelectedSlot(slot);
        this.getActionBarCandidates(slot.placedItem).forEach((s) => this.addSelectedSlot(s)); //mark equivalent items on the actionbar

        this.dispatchAction(slot.placedItem);
    }
    //dispatchers
    dispatchAction({id, sectionID}) {
        const packetCollection = [ITEM_SELECT];
        packetCollection.push(this.getItemPacket(sectionID));
        packetCollection.push(id);

        SOCKET.sendPacket(packetCollection);

        this.dispatchLaserAttack(id, sectionID);
    }
    dispatchLaserAttack(id, sectionID) {
        if (sectionID != 0) return;
        HERO.handleAttackState(id == this.lastSelectedLaserID);
        this.lastSelectedLaserID = id;
    }

    //utils for slots
    cleanupSlot(el) {
        el.innerHTML = "";
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
    generateItemIcon(el, {fullname}) {
        const itemIcon = document.createElement("img");
        itemIcon.src = `./spacemap/ui/actionBar/icons/${fullname}.png`;
        itemIcon.classList.add("item_submenu_icon");

        el.appendChild(itemIcon);
    }
    getActionBarCandidates(subMenuItem) {
        const result = [];

        this.actionBarSlots.forEach((s) => {
            if (s.fullname === subMenuItem.fullname) result.push(s);
        })

        console.log(result);

        return result;
    }
    getFullItemString(name, sectionID) {
        return `${this.subMenuKeys[sectionID]}_${name}`;
    }
    getSlotSectionString(isSubmenu) {
        return isSubmenu ? "submenu" : "actionbar";
    }
    getItemPacket(key) {
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
        return menuPackets[key];
    }
}