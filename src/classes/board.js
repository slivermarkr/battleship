import { generateGridArray } from "../utils/functions";
import GridCell from "./cell";
export class Gameboard {
  constructor({ name, dimension }) {
    this.name = name;
    this.dimension = dimension;
    this.gridMap = new Map();
    this.occupied = [];
    this.hitMap = {
      hit: [],
      miss: [],
    };
    this.initGridMap();
  }

  initGridMap() {
    for (let coor of generateGridArray(this.dimension)) {
      this.gridMap.set(coor, new GridCell(coor));
    }
  }

  receiveAttack(coor) {
    const cell = board.gridMap.get(coor);
  }
}
