import { Gameboard } from "./board.js";
import { generateRandomCluster, getRandomOrientation } from "../utils/fn.js";

export class Player {
  constructor({ name, dimension = 10 }) {
    this.name = name;
    this.dimension = dimension;
    this.board = new Gameboard({ name: this.name, dimension: this.dimension });
  }
}

export class Computer extends Player {
  constructor({ name = "Computer", dimension }) {
    super({ name, dimension });
  }

  setShipRandomly() {
    for (let i = 0; i < this.board.shipList.length; ++i) {
      const ship = this.board.shipList[i];
      const res = generateRandomCluster(ship, this.board);
      // console.log(res);
      this.board.setShip(ship, res.cluster);
      ship.orientation = res.orientation;
      // this.occupied = this.board.occupied.concat(res);
    }
    console.log(this.board.occupied);
    console.log(this.board.shipList);
  }
}

const com = new Computer({});
com.setShipRandomly();

// generateRandomCluster(com.board.shipList[9], com.board);
// const board = com.board;
// board.setShip(board.shipList[0], ["A,1"]);
// console.log(board.getOccupiedCells());
