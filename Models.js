/* const Models = [
  ["ships/starhawk", 45, 0], //path, sequences, spritestart
  ["ships/sr100", 45, 0],
  ["ships/enforcer", 32, 0],
  ["ships/bastion", 32, 0],
  ["portals/portal0/active", 120, 1],
  ["portals/jumpAnimation0", 5, 1],
  ["portals/portal0/idle", 57, 1],
  ["sfx/leech", 29, 0],
  ["lensflares/lensflare0", 14, 0],
  ["pyroEffects/rocketExplosion0", 20, 0],
  ["pyroEffects/explosion0", 79, 0],
  ["ui/actionBar/cooldown", 99, 0],
  ["drones/iris/6", 32, 0],
  ["drones/apis/6", 32, 0],
  ["drones/zeus/6", 32, 0],
  ["engines/standard", 11, 0],
  ["lasers", 5, 0],
];
*/
const Models = {
  ships: {
    1: ["ships/starhawk", 45, 0],
    2: ["ships/sr100", 45, 0],
    3: ["ships/enforcer", 32, 0],
    4: ["ships/bastion", 32, 0]
  },
  portals: {
    shockwave: {
      0: ["portals/jumpAnimation0", 5, 1],
      1: ["portals/jumpAnimation1", 17, 1]
    },
    portal: {
      0: {
        active: ["portals/portal0/active", 120, 1],
        idle: ["portals/portal0/idle", 57, 1]
      },
      1: {
        active: ["portals/portal1/active", 1, 1],
        idle: ["portals/portal1/idle", 1, 1]
      }
    }
  },
  lensflares: {
    0: ["lensflares/lensflare0", 14, 0],
    1: ["lensflares/lensflare1", 0, 0],
    2: ["lensflares/lensflare2", 0, 0],
    3: ["lensflares/lensflare3", 0, 0]
  },
  explosions: {
    rockets: {
      0: ["pyroEffects/rocketExplosion0", 20, 0]
    },
    pyro: {
      0: ["pyroEffects/explosion0", 79, 0]
    }
  },
  sfx: {
    leech: ["sfx/leech", 29, 0]
  },
  drones: {
    iris: {
      6: ["drones/iris/6", 32, 0]
    },
    apis: {
      6: ["drones/apis/6", 32, 0],
    },
    zeus: {
      6: ["drones/zeus/6", 32, 0]
    }
  },
  engines: {
    0: ["engines/standard", 11, 0],
  },
  lasers: {
    0: ["lasers", 1, 0],
    1: ["lasers", 1, 1],
    2: ["lasers", 1, 2],
    3: ["lasers", 1, 3],
    4: ["lasers", 1, 4],
  }
}