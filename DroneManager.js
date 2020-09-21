class DroneManager {
  static handleDroneData(data) {
    //SHIP|DRONETYPE;LVL;DESIGN|...
    data.splice(0, 2);
    let ship = getShipById(data[0]);
    data.splice(0, 1);
    ship.simpleDroneRepresentations = "";
    ship.drones.splice(0, ship.drones.length);
    data.forEach((droneRaw, i) => {
      const drone = droneRaw.split(";");
      const drObj = new Drone(i, ship, drone[0], drone[1], drone[2]);
      ship.drones.push(drObj);
      //DRONES_LAYER.push(new Drone(i, ship, drone[0], drone[1], drone[2]));
    });
    ship.droneSimpleOffset = getDroneOffset(ship.simpleDroneRepresentations);
  }
}
