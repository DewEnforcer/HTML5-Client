class Draggable {
    allowDrop(ev) {
        ev.preventDefault();
      }
      dragItem(ev, id, barType) {
        if (!this.isOpenSubmenu) return;
        const slotObjData = {
            id,
            barType
        }
        ev.dataTransfer.setData("itemData", JSON.stringify(slotObjData));
      }
      dropItem(ev, {id, subStr: barType}) {
        const targetSlotData = {
            id,
            barType
        }
        const slotObjData = JSON.parse(ev.dataTransfer.getData("itemData"));  
        this.manageSlotDragging(slotObjData, targetSlotData);
      }
      //ui els
      enableDrag(elmnt, target, callBack = null) {
        let pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        elmnt.onmousedown = dragMouseDown;
    
        function dragMouseDown(e) {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;

          let realPosY = target.offsetTop - pos2;
          let realPosX = target.offsetLeft - pos1;

          target.style.top = realPosY + "px";
          target.style.left = realPosX + "px";

          if (callBack) callBack({x: realPosX, y: realPosY})
        }
    
        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
          //UIcls.saveUiPos();
        }
      }

}