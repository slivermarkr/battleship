import Gameboard from "./board.js";
import {
  generateRandomCluster,
  getRandomOrientation,
  generateGridArray,
  getCoorAdjacentCorner,
  getCoorAdjacentList,
  isCellClearForOccupation,
  generateRandomCoordinates,
  showNewCluster,
} from "../utils/fn.js";

const defaultPosition = [
  { coor: ["A,2"], orientation: "v" },
  { coor: ["B,7"], orientation: "v" },
  { coor: ["G,8"], orientation: "v" },
  { coor: ["I,1"], orientation: "v" },
  { coor: ["A,5", "B,5"], orientation: "v" },
  { coor: ["D,1", "D,2"], orientation: "h" },
  { coor: ["D,4", "E,4"], orientation: "v" },
  { coor: ["C,9", "D,9", "E,9"], orientation: "v" },
  { coor: ["H,4", "I,4", "J,4"], orientation: "v" },
  { coor: ["J,6", "J,7", "J,8", "J,9"], orientation: "h" },
];

export class Player {
  constructor({ name, dimension = 10 }) {
    this.name = name;
    this.dimension = dimension;
    this.board = new Gameboard({ name: this.name, dimension: this.dimension });
  }

  isClusterValid(cluster, board) {
    return cluster.every((coor) => isCellClearForOccupation(coor, board));
  }

  setShipToDefault() {
    this.board.reset();
    for (let i = 0; i < this.board.shipList.length; ++i) {
      const ship = this.board.shipList[i];
      ship.orientation = defaultPosition[i].orientation;
      this.board.setShip(ship, defaultPosition[i].coor);
    }
  }

  setShipRandomly() {
    this.board.reset();
    let placedShips = 0;
    let maxAttempts = 50;

    while (placedShips < this.board.shipList.length && maxAttempts > 0) {
      const ship = this.board.shipList[placedShips];
      const res = generateRandomCluster(ship, this.board);

      if (res && this.isClusterValid(res.cluster, this.board)) {
        ship.orientation = res.orientation;
        this.board.setShip(ship, res.cluster);
        placedShips++;
      }
      maxAttempts--;
    }

    if (maxAttempts === 0) {
      throw new Error(
        "Failed to place ships randomly. Press the 'Randomize' link to try again."
      );
    }
  }
}

export class Computer extends Player {
  constructor({ name = "Computer", dimension }) {
    super({ name, dimension });
    this.gridYetToAttack = generateGridArray(this.dimension);
    this.hitList = [];
    this.bufferList = [];
  }

  //   reset() {
  // this.hitList = []
  // this.bufferList = []
  //   }
  attackRandomly() {
    if (this.gridYetToAttack.length === 0) return;
    const randomNum = Math.floor(Math.random() * this.gridYetToAttack.length);

    const coor = this.gridYetToAttack[randomNum];
    const coorCorner = new Set(getCoorAdjacentCorner(coor));

    this.gridYetToAttack.splice(randomNum, 1);

    // console.log("coor options", this.gridYetToAttack);
    // console.log("COMPUTER COOR", coor);
    return coor;
  }

  removeHitShipCorner(cluster) {
    const coorCorner = new Set(cluster);
    this.gridYetToAttack = this.gridYetToAttack.filter(
      (coor) => !coorCorner.has(coor)
    );
  }

  removeSunkenCluster(cluster) {
    const coorCorner = new Set(cluster);
    this.gridYetToAttack = this.gridYetToAttack.filter(
      (coor) => !coorCorner.has(coor)
    );
  }
}
