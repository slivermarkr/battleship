import { Gameboard } from "./board.js";
import {
  generateRandomCluster,
  getRandomOrientation,
  generateGridArray,
} from "../utils/fn.js";

export class Player {
  constructor({ name, dimension = 10 }) {
    this.name = name;
    this.dimension = dimension;
    this.board = new Gameboard({ name: this.name, dimension: this.dimension });
  }

  setShipRandomly() {
    this.board.reset();

    for (let i = 0; i < this.board.shipList.length; ++i) {
      const ship = this.board.shipList[i];
      const res = generateRandomCluster(ship, this.board);
      this.board.setShip(ship, res.cluster);
      ship.orientation = res.orientation;
    }
    const res = [];
    for (let i of this.board.gridMap.values()) {
      if (i.isBuffer) {
        res.push(i);
      }
    }
  }
}

export class Computer extends Player {
  constructor({ name = "Computer", dimension }) {
    super({ name, dimension });
    this.gridYetToAttack = generateGridArray(this.dimension);
    this.hitList = [];
  }

  attackRandomly() {
    const randomNum = Math.floor(Math.random() * this.gridYetToAttack.length);
    console.log(randomNum);
    const coor = this.gridYetToAttack[randomNum];
    this.gridYetToAttack.splice(randomNum, 1);
    console.log(this.gridYetToAttack.length);
    console.log(coor);
    // return coor;
  }
}
const com = new Computer({});

com.attackRandomly();
