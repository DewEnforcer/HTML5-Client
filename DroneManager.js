class DroneManager {
  static handleDroneData(data) {
    //SHIP|DRONETYPE;LVL;DESIGN|...
    data.splice(0, 2);
    let ship = null;
    if (data[0] == "HERO") {
      ship = HERO;
    } else {
      ship = getShipById(data[0]);
    }
    data.splice(0, 1);
    let drones = [];
    //parse the data
    data.forEach((element) => {
      drones.push(element.split(";"));
    });
    drones.forEach((drone, i) => {
      DRONES_LAYER.push(new Drone(i, ship, drone[0], drone[1], drone[2]));
    });
  }
}
