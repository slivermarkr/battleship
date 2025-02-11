import { getCoorAdjacentCorner, getCoorAdjacentList } from "../utils/fn.js";

export default class GridCell {
  constructor(coor) {
    this.coor = coor;
    this.isOccupied = false;
    this.isBuffer = false;
    this.bufferCount = 0;
    this.isAttacked = false;
    this.shipData = undefined;
    this.adjacentList = undefined;
    this.adjacentList = undefined;
  }

  takeShip(shipObj) {
    this.isOccupied = true;
    this.isBuffer = false;

    this.shipData = shipObj;
    this.shipData.isSet = true;
  }

  getAdjacentList() {
    return getCoorAdjacentList(this.coor);
  }

  getAdjacentCorner() {
    return getCoorAdjacentCorner(this.coor);
  }

  reset() {
    this.isOccupied = false;
    this.isBuffer = false;
    this.isAttacked = false;
    this.shipData = undefined;
    this.bufferCount = 0;
  }
}
