import {
  generateGridArray,
  isValidCoor,
  isBufferCluster,
} from "../utils/fn.js";
import GridCell from "./cell.js";
import Ship from "./ship.js";

const shipArrayInput = [
  { type: 1, instances: 4 },
  { type: 2, instances: 3 },
  { type: 3, instances: 2 },
  { type: 4, instances: 1 },
];

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
    this.shipList = this.createArrayOfShipInstances(shipArrayInput);

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

    // check if the coordinates being pass in is not in the board.occupied array
    // also return error if cell.isBuffer = true
    for (let coor of coordinates) {
      if (this.occupied.some((cell) => cell == coor)) {
        throw new Error("coordinate is already occupied");
      } else if (this.gridMap.get(coor).isBuffer) {
        throw new Error("coordinate is already buffer");
      }
    }

    for (let coor of coordinates) {
      const cell = this.gridMap.get(coor);
      cell.takeShip(shipObj);

      this.occupied = this.getOccupiedCells();
    }

    // get the adjlist of each coordianates excluding the coor itself and set isBuffer to true
    const bufferCluster = isBufferCluster(coordinates);
    for (const c of bufferCluster) {
      const cell = this.gridMap.get(c);
      cell.isBuffer = true;
    }
  }

  getOccupiedCells() {
    const res = [];
    for (const cell of this.gridMap.values()) {
      if (cell.shipData) {
        res.push(cell.coor);
      }
    }
    return res;
  }

  reset() {
    this.occupied.length = 0;
    this.hitMap.miss.length = 0;
    this.hitMap.hit.length = 0;

    for (const cell of this.gridMap.values()) {
      cell.reset();
    }
  }

  createArrayOfShipInstances(arrayInput) {
    const array = [];
    for (let i = 0; i < arrayInput.length; ++i) {
      const shipData = arrayInput[i];
      let j = 0;
      while (j < shipData.instances) {
        array.push(new Ship({ size: shipData.type, index: j }));
        ++j;
      }
    }
    return array;
  }

  getRemainingShipCount() {
    return this.shipList.filter((ship) => !ship.isSunk()).length;
  }

  isFleetDefeated() {
    return this.getRemainingShipCount() === 0;
  }
}

// const board = new Gameboard({ name: "You", dimension: 10 });
// board.setShip(board.shipList[0], ["A,1"]);
// board.receiveAttack("A,1");
// console.log(board.occupied);
// console.log(board.shipList[0]);
// console.log(board.getRemainingShipCount());
// for (let i = 0; i < board.shipList.length; ++i) {
//   board.shipList[i].isHit();
//   board.shipList[i].isHit();
//   board.shipList[i].isHit();
//   board.shipList[i].isHit();
//   console.log(board.shipList[i]);
// }

// console.log(board.getRemainingShipCount());
// console.log(board.isFleetDefeated());
