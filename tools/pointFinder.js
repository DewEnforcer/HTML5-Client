const CANVAS_FETCH = document.getElementById("imageMain");
const CANVAS_PARSE = document.getElementById("parsedPicture");
const CANVAS_PROCESS = document.getElementById("proc_canvas");

const CTX_FETCH = CANVAS_FETCH.getContext("2d");
const CTX_PARSE = CANVAS_PARSE.getContext("2d");
const CTX_PROC = CANVAS_PROCESS.getContext("2d");

let startInstance = "./spacemap/portals/portal0/normal.png"; //src name;
let endInstance = "./spacemap/portals/portal0/highlight.png";

const frameTransition = 60; //transtion within 120 frames

const startImage = new Image(),
  endImage = new Image();

let readyState = 0;
const colorPallete = [0, 1, 2, 3];
startImage.onload = function () {
  CANVAS_FETCH.width = this.width;
  CANVAS_FETCH.height = this.height;
  CTX_FETCH.drawImage(startImage, 0, 0);
  readyState++;
  initCompare();
};
endImage.onload = function () {
  CANVAS_PARSE.width = this.width;
  CANVAS_PARSE.height = this.height;
  CTX_PARSE.drawImage(endImage, 0, 0);
  readyState++;
  initCompare();
};
startImage.src = startInstance;
endImage.src = endInstance;

const diffPoints = [];
function roundTo(number) {
  var newnumber = number.toFixed(12);
  return parseFloat(newnumber);
}

function initCompare() {
  if (readyState < 2) return;
  const startData = CTX_FETCH.getImageData(
    0,
    0,
    CANVAS_FETCH.width,
    CANVAS_FETCH.height
  );
  const endData = CTX_PARSE.getImageData(
    0,
    0,
    CANVAS_PARSE.width,
    CANVAS_PARSE.height
  );
  const startPixels = startData.data;
  const endPixels = endData.data;
  let diffState = false;
  let diffColorArr;
  for (let i = 0; i < startData.data.length; i += 4) {
    diffColorArr = [];
    let startColors = [];
    diffState = false;
    colorPallete.forEach((color) => {
      startColors.push(startPixels[i + color]);
      const colorPerFrameChange =
        (endPixels[i + color] - startPixels[i + color]) / frameTransition;
      diffColorArr.push(colorPerFrameChange);
      diffState = true;
    });
    if (diffState) {
      const realPixel = i / 4;
      const realY = Math.floor(realPixel / CANVAS_FETCH.height);
      const difPointObj = {
        x: realPixel - realY * CANVAS_FETCH.height,
        y: realY,
        startColors,
        colorChange: diffColorArr,
      };
      diffPoints.push(difPointObj);
    }
  }
  generateTransitionSprites();
}
const start = 19;
function generateTransitionSprites(i = start) {
  console.log(i);
  CANVAS_PROCESS.width = CANVAS_FETCH.width;
  CANVAS_PROCESS.height = CANVAS_FETCH.height;
  let px;
  //CTX_PROC.drawImage(startImage, 0, 0);
  diffPoints.forEach((pxO, k) => {
    /* CTX_PROC.fillStyle = `rgba(${
        pxO.startColors[0] + Math.round(pxO.colorChange[0] * i)
      }, ${pxO.startColors[1] + Math.round(pxO.colorChange[1] * i)}, ${
        pxO.startColors[2] + Math.round(pxO.colorChange[2] * i)
      }, ${Math.round(
        (pxO.startColors[3] + Math.round(pxO.colorChange[3] * i)) / 255
      )})`;
      CTX_PROC.fillRect(pxO.x, pxO.y, 1, 1); */
    px = CTX_PROC.createImageData(1, 1); // only do this once per page
    px.data[0] = pxO.startColors[0] + Math.round(pxO.colorChange[0] * i);
    px.data[1] = pxO.startColors[1] + Math.round(pxO.colorChange[1] * i);
    px.data[2] = pxO.startColors[2] + Math.round(pxO.colorChange[2] * i);
    px.data[3] = pxO.startColors[3] + Math.round(pxO.colorChange[3] * i);
    CTX_PROC.putImageData(px, pxO.x, pxO.y);
  });
  saveImgData(i);
}
/* 
      px = CTX_PROC.createImageData(1, 1); // only do this once per page
      px.data[0] = pxO.startColors[0] + Math.round(pxO.colorChange[0] * i);
      px.data[1] = pxO.startColors[1] + Math.round(pxO.colorChange[1] * i);
      px.data[2] = pxO.startColors[2] + Math.round(pxO.colorChange[2] * i);
      px.data[3] = pxO.startColors[3] + Math.round(pxO.colorChange[3] * i);
      CTX_PROC.putImageData(px, pxO.x, pxO.y);

      this works
*/
const blobBufferData = [];
function saveImgData(i) {
  CANVAS_PROCESS.toBlob((blob) => {
    i++;
    blobBufferData.push(blob);
    if (i > frameTransition) downloadPicture();
    else generateTransitionSprites(i);
  });
}
function downloadPicture(i = 0) {
  if (i >= blobBufferData.length) return;
  const blob = blobBufferData[i];
  var image = document.createElement("img"); // Image you want to save
  image.src = URL.createObjectURL(blob);
  var saveImg = document.createElement("a"); // New link we use to save it with
  saveImg.href = image.src; // Assign image src to our link target
  saveImg.download = start + i; // set filename for download
  saveImg.click();
  i++;
  downloadPicture(i);
}
