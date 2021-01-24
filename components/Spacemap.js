class Spacemap {
    constructor(data) {
        this.window = new Window(data);
        this.mapNode = null;
        this.btnNode = null;

        this.jumpPrice = 0;
        this.isJumping = false;
        this.isJumpAvailable = true;
        this.showcasedSectorId = 0;
        this.selectedMapId = null;
        this.currentMapId = HERO.mapID;

        this.MAP_BOX_LIST = {};

        this.MAPS = null;
        this.SECTOR_SIZES = null;
        this.MAP_VECTORS = null;

        this.parseData(data.content);
        this.generateContent();
        this.setCurrentMap(null, true);
        this.updateJumpButtonState();
    }
    parseData({maps, sectorSizes, mapVectors}) {
        this.MAPS = maps;
        this.SECTOR_SIZES = sectorSizes;
        this.MAP_VECTORS = mapVectors;
    }
    generateContent() {
        this.generateMapsOverview();
        this.generateControlPanel();
    }
    generateMapsOverview() {
        const node = this.window.getBodyNode();
        this.mapNode = ElUtils.createBox("spacemap_ov_map_wrapper");
        
        const name = `sector_switch_${this.showcasedSectorId}`;

        const btnSwitchSector = ElUtils.createButton(["btn_switch_sector_spacejump", "translate_txt"], null, null, TEXT_TRANSLATIONS[name]);
        btnSwitchSector.setAttribute("transl_key", name);
        btnSwitchSector.onclick = this.handleSectorChange;

        node.appendChild(btnSwitchSector);
        node.appendChild(this.mapNode);

        this.setSectorBackground();
        this.generateMaps();
    }
    generateMaps() {
        MAP_OVERVIEW_LIST[this.showcasedSectorId].forEach( (map, i) => {
            const [x, y] = this.MAP_VECTORS[this.showcasedSectorId][i];
            const data = {...map, x, y};
            const mapBox = new MapBox(data, this.handleMapSelect);
            this.MAP_BOX_LIST = {...this.MAP_BOX_LIST, [mapBox.mapId]: mapBox};
            this.mapNode.appendChild(mapBox.getNode());
        })
    }
    setCurrentMap(mapId, isInit = false) {
        if (this.currentMapId == mapId) return;

        let mapBox = this.getMapBox(this.currentMapId);
        if (mapBox) mapBox.cleanupVisualStates();

        if (isInit) return;
        this.currentMapId = mapId;

        mapBox = this.getMapBox(this.currentMapId);
        if (mapBox) mapBox.setCurrentMode();

        this.updateCurrentMapText();
    }
    setSectorBackground() {
        const STD_HEIGHT = 435;
        const [x,y] = this.SECTOR_SIZES[this.showcasedSectorId];

        this.mapNode.style.backgroundImage = `url("../spacemap/ui/spacejump/${this.showcasedSectorId}.png")`;
        this.mapNode.style.width = `${x}px`;
        this.mapNode.style.margin = `${STD_HEIGHT - y}px`;
    }

    generateControlPanel() {
        const cntrlPanelWrapper = ElUtils.createBox("spacemap_ov_control_wrapper");
        const cntrlPanelHeader = ElUtils.createBox("spacemap_ov_control_header");
        const cntrlPanelBody = ElUtils.createBox("spacemap_ov_control_body");

        cntrlPanelWrapper.appendChild(cntrlPanelHeader);
        cntrlPanelWrapper.appendChild(cntrlPanelBody);
        this.window.getBodyNode().appendChild(cntrlPanelWrapper);

        this.generateControlPanelBody(cntrlPanelBody);
    }
    generateControlPanelBody(body) {
        const mapInformationBox = ElUtils.createBox("spacemap_ov_control_target");
        const currentMapNode = ElUtils.createText("translate_txt", TEXT_TRANSLATIONS.spacemap_target_currmap, "spacemap_target_currmap");
        const targetMapNode = ElUtils.createText("translate_txt", TEXT_TRANSLATIONS.spacemap_target_jumpmap, "spacemap_target_jumpmap");
   
        mapInformationBox.appendChild(currentMapNode);
        mapInformationBox.appendChild(targetMapNode);

        const priceBox = ElUtils.createBox("spacemap_ov_control_pricebox");
        const priceContainer = ElUtils.createBox("");
        const priceText = ElUtils.createText("", this.jumpPrice, "", "pricebox_txt");
        priceContainer.appendChild(priceText);

        priceBox.appendChild(priceContainer);

        this.btnNode = ElUtils.createButton(["spacemap_ov_control_jump", "translate_txt"], "", TEXT_TRANSLATIONS.jump_start);
        this.btnNode.setAttribute("transl_key", "jump_start");
        this.btnNode.onclick = ev => this.handleJumpEvent();

        body.appendChild(mapInformationBox);
        body.appendChild(priceBox);
        body.appendChild(this.btnNode);
    }
    cleanupMaps() {
        this.mapNode.innerHTML = "";
        this.MAP_BOX_LIST = {};
    }
    getMapBox(id) {
        return this.MAP_BOX_LIST[id];
    }
    updateCurrentMapText() {

    }
    updateSelectedMapText() {

    }
    updateJumpButtonState() {
        if (!this.selectedMapId || !this.isJumpAvailable) return this.btnNode.classList.remove("jump_btn_active");
        this.btnNode.classList.add("jump_btn_active");
    }
    setSelectMap() {
        let mapBox = this.getMapBox(this.selectedMapId);
        if (mapBox) mapBox.setSelectMode();
    }
    handleMapSelect = (mapId, setSelectedMapBox) => {
        if (mapId === this.selectedMapId) return;
        
        if (this.selectedMapId) {
            let mapBox = this.getMapBox(this.selectedMapId);
            if (mapBox) mapBox.cleanupVisualStates();
        }

        this.selectedMapId = mapId;

        setSelectedMapBox();
        this.updateSelectedMapText();
        this.updateJumpButtonState();
    }
    handleSectorChange = () => {
        this.showcasedSectorId = this.showcasedSectorId === 0 ? 1 : 0;

        this.cleanupMaps();
        this.setSectorBackground();
        this.generateMaps();
        this.setCurrentMap(null, true);
        this.setSelectMap();
    }
    handleJumpEvent = () => {
        if (!this.selectedMapId || this.isJumping || !this.isJumpAvailable) return UI_MAIN.UI.log.addLogMessage("advanced_jump_unavailable", true);

        const packetCollection = [REQUEST_ADVANCED_JUMP, this.selectedJumpMap];
        SOCKET.sendPacket(packetCollection);
    }
}