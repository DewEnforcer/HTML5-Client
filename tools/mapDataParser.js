let xmlData = null;
let jsonOutput = null;
function fetchXml() {
  fetch("./maps.php")
    .then((res) => res.text())
    .then((data) => {
      xmlData = new DOMParser()
        .parseFromString(data, "application/xml")
        .getElementsByTagName("map");
      beginParsing();
    });
}
function beginParsing() {
  const loopData = [...xmlData];
  console.log(loopData);
  loopData.forEach((map, i) => {
    const attrMap = map.attributes;
    console.log(attrMap);
    const mapObj = {
      name: attrMap.name.value,
      portals: [],
      lensflares: [],
      planets: [],
      nebulas: [],
      stations: [],
    };
    let lensflares = map.getElementsByTagName("lensflares")[0];
    let planets = map.getElementsByTagName("planets")[0];
    if (typeof planets != "undefined") {
      planets = [...planets.children];
      planets.forEach((pl) => {
        const plData = pl.attributes;
        const plObj = {
          x: plData.x.value,
          y: plData.y.value,
          z: plData.pFactor.value,
          id: plData.typeID.value,
          mScale: 5,
        };
        mapObj.planets.push(plObj);
      });
    }
    if (typeof lensflares != "undefined") {
      lensflares = [...lensflares.children];
      lensflares.forEach((lens) => {
        const plData = lens.attributes;
        const plObj = {
          x: plData.x.value,
          y: plData.y.value,
          z: plData.pFactor.value,
          id: plData.id.value,
        };
        mapObj.lensflares.push(plObj);
      });
    }
    jsonOutput = { ...jsonOutput, [attrMap.id.value]: mapObj };
  });
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," +
      encodeURIComponent(JSON.stringify(jsonOutput))
  );
  element.setAttribute("download", "maps.json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  console.log(jsonOutput);
}
fetchXml();
