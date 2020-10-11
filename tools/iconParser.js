const CANVAS_FETCH = document.getElementById("imageMain");
const CANVAS_PARSE = document.getElementById("parsedPicture");

const CTX_FETCH = CANVAS_FETCH.getContext("2d");
const CTX_PARSE = CANVAS_PARSE.getContext("2d");

let fetchWidth, fetchHeight;
const DIRECTORY = "actionMenu";
const fetchImage = new Image();
fetchImage.onload = function () {
  CANVAS_FETCH.width = this.width;
  CANVAS_FETCH.height = this.height;
  initFetchCanvas();
  fetchList();
};
fetchImage.src = `texture.png`;
const coordinateList = [];
const resizeParse = (w, h) => {
  CANVAS_PARSE.width = w;
  CANVAS_PARSE.height = h;
};
const fetchList = () => {
  fetch("iconList.xml")
    .then((res) => res.text())
    .then((data) => {
      data = new DOMParser()
        .parseFromString(data, "application/xml")
        .getElementsByTagName("SubTexture");
      parseList(data);
    });
};
const parseList = (listXML) => {
  const data = [...listXML];
  data.forEach((icon) => {
    icon = icon.attributes;
    coordinateList.push({
      name: icon.name.value,
      x: icon.x.value,
      y: icon.y.value,
      w: icon.width.value,
      h: icon.height.value,
    });
  });
  parseIcons();
};
const parseIcons = () => {
  let i = 0;
  let xint = setInterval(() => {
    if (i >= coordinateList.length) {
      clearInterval(xint);
      return;
    }
    const { x, y, w, h, name } = coordinateList[i];
    resizeParse(w, h);
    const icon = CTX_FETCH.getImageData(x, y, w, h);
    CTX_PARSE.putImageData(icon, 0, 0);
    getPngBlob(name);
    i++;
  }, 200);
};
const initFetchCanvas = () => {
  CTX_FETCH.drawImage(fetchImage, 0, 0);
};
function getPngBlob(name) {
  CANVAS_PARSE.toBlob((blob) => downloadPicture(blob, name));
}
function downloadPicture(blob, FILENAME) {
  var image = document.createElement("img"); // Image you want to save
  image.src = URL.createObjectURL(blob);
  var saveImg = document.createElement("a"); // New link we use to save it with
  saveImg.href = image.src; // Assign image src to our link target
  saveImg.download = FILENAME; // set filename for download
  saveImg.click();
}
