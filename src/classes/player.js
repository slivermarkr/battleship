import { Gameboard } from "./board.js";
import {
  generateRandomCluster,
  getRandomOrientation,
  generateGridArray,
  getCoorAdjacentCorner,
  getCoorAdjacentList,
} from "../utils/fn.js";

export class Player {
  constructor({ name, dimension = 10 }) {
    this.name = name;
    this.dimension = dimension;
    this.board = new Gameboard({ name: this.name, dimension: this.dimension });
  }

  setShipRandomly() {
    this.board.reset();
    let isValid = false;

    while (!isValid) {
      for (let i = 0; i < this.board.shipList.length; ++i) {
        const ship = this.board.shipList[i];
        const res = generateRandomCluster(ship, this.board);
        this.board.setShip(ship, res.cluster);
        ship.orientation = res.orientation;
      }

      if (this.board.occupied.length !== 20) this.board.reset();

      console.log(this.board.occupied);
      isValid = true;
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
