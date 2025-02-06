import { getCoorAdjacentList } from "../utils/functions";

export default class GridCell {
  constructor(coor) {
    this.coor = coor;
    this.isOcccupied = false;
    this.isBuffer = false;
    // this.shipData = undefined;
    this.adjacentList = undefined;
  }

  takeShip(shipObj) {
    this.shipData = shipObj;
    this.isOccupied = true;
    this.isBuffer = false;
  }

  getBuffer() {
    return this.neighbors;
  }

  getAdjacentList() {
    return getCoorAdjacentList(this.coor);
  }
}
