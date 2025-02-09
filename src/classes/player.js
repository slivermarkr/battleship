import { Gameboard } from "./board.js";
import { generateRandomCluster } from "../utils/fn.js";

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
      console.log("res", res);
      this.board.setShip(ship, res);
      console.log("occupied", this.board.occupied.length);
    }
    // const res = generateRandomCluster(4, this.board);
    // console.log(res);
  }
}

const com = new Computer({});
com.setShipRandomly();
// const board = com.board;
// board.setShip(board.shipList[0], ["A,1"]);
// console.log(board.getOccupiedCells());
