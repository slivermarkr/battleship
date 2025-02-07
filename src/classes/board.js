import { generateGridArray, isValidCoor } from "../utils/functions";
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
    if (!isValidCoor(coor)) throw new Error("INVALID COOR");
    const cell = this.gridMap.get(coor);
    cell.isAttacked = true;

    if (cell.shipData) {
      const ship = cell.shipData;
      ship.isHit();
      this.hitMap.hit.push(coor);
    } else {
      this.hitMap.miss.push(coor);
    }
  }

  setShip(shipObj, coordinates) {
    if (shipObj.size !== coordinates.length)
      throw new Error("shipObj.size !== coordinates.length");
    shipObj["cluster"] = coordinates;

    for (let coor of coordinates) {
      const cell = this.gridMap.get(coor);
      cell.takeShip(shipObj);

      this.occupied.push(coor);
    }
  }

  getOccupiedCells() {
    return this.occupied;
  }
}
