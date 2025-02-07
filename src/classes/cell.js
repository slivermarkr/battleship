import { getCoorAdjacentList } from "../utils/fn.js";

export default class GridCell {
  constructor(coor) {
    this.coor = coor;
    this.isOcccupied = false;
    this.isBuffer = false;
    this.isAttacked = false;
    this.shipData = undefined;
    this.adjacentList = undefined;
  }

  takeShip(shipObj) {
    this.isOccupied = true;
    this.isBuffer = false;

    this.shipData = shipObj;
    this.shipData.isSet = true;
  }

  getBuffer() {
    return this.neighbors;
  }

  getAdjacentList() {
    return getCoorAdjacentList(this.coor);
  }

  reset() {
    this.isOcccupied = false;
    this.isBuffer = false;
    this.isAttacked = false;
    this.shipData = undefined;
  }
}
