import { Gameboard } from "./board.js";
import {
  generateRandomCluster,
  getRandomOrientation,
  generateGridArray,
  getCoorAdjacentCorner,
  getCoorAdjacentList,
  isCellClearForOccupation,
} from "../utils/fn.js";

export class Player {
  constructor({ name, dimension = 10 }) {
    this.name = name;
    this.dimension = dimension;
    this.board = new Gameboard({ name: this.name, dimension: this.dimension });
  }

  isClusterValid(cluster, board) {
    return cluster.every((coor) => isCellClearForOccupation(coor, board));
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
const com = new Computer({});

// com.attackRandomly();
// com.attackRandomly();
// com.attackRandomly();
// com.attackRandomly();
// console.log(com.gridYetToAttack.length);
// console.log(com instanceof Player);
