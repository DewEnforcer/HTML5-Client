const CANVAS_FETCH = document.getElementById("imageMain");
const CANVAS_PARSE = document.getElementById("parsedPicture");

const CTX_FETCH = CANVAS_FETCH.getContext("2d");
const CTX_PARSE = CANVAS_PARSE.getContext("2d");

const sprite = new Image();
const path = "./spacemap/drones/zeus/6/";
const maxSeq = 33;
let currSeq = 0;
const lookFor = 1; //green
const width = 65;
const height = 65;

CANVAS_FETCH.width = width;
CANVAS_FETCH.height = height;

CANVAS_PARSE.width = width;
CANVAS_PARSE.height = height;

const handleImageData = (pixelsGet) => {
  for (let i = 0; i < pixelsGet.data.length; i += 4) {
    if (pixelsGet.data[lookFor + i] == 255) {
      pixelsGet.data[3 + i] = 0; //set alpha to 0
    }
  }
  CTX_PARSE.putImageData(pixelsGet, 0, 0);
  getPngBlob(currSeq);
};

const parseImg = () => {
  if (currSeq >= maxSeq) return;
  CTX_FETCH.clearRect(0, 0, width, height);
  CTX_PARSE.clearRect(0, 0, width, height);
  sprite.onload = () => {
    CTX_FETCH.drawImage(sprite, 0, 0);
    const pixelsGet = CTX_FETCH.getImageData(0, 0, width, height);
    handleImageData(pixelsGet);
  };
  sprite.src = `${path + currSeq}.png`;
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
  currSeq++;
  parseImg();
}
document.getElementById("btn_start").addEventListener("click", parseImg);
