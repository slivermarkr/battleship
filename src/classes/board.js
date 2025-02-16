import {
  generateGridArray,
  isValidCoor,
  isBufferCluster,
  getCoorAdjacentList,
  getCoorAdjacentCorner,
  isCellClearForOccupation,
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
    this.occupied = this.getOccupiedCells();
    this.buffers = this.getBufferCells();
    this.bufferMultiple = [];
    this.hitMap = {
      hit: [],
      miss: [],
    };
    this.shipList = this.createArrayOfShipInstances(shipArrayInput);

    this.initGridMap();
  }

  getBufferWithMoreThanOneCount() {
    const res = [];
    for (const cell of this.gridMap.values()) {
      if (cell.bufferCount > 1) res.push(cell);
    }
    return res;
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
      return true;
    } else {
      this.hitMap.miss.push(coor);
      return false;
    }
  }

  setShip(shipObj, coordinates) {
    if (shipObj.isSet) throw new Error("SHIP ALREADY SET");
    if (shipObj.size !== coordinates.length)
      throw new Error("shipObj.size !== coordinates.length");

    shipObj["cluster"] = coordinates;

    // check if the coordinates being pass in is not in the board.occupied array
    // also return error if cell.isBuffer = true
    for (let coor of coordinates) {
      if (this.occupied.some((cell) => cell == coor)) {
        throw new Error("coordinate is already occupied");
      } else if (this.gridMap.get(coor).isBuffer()) {
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
      cell.bufferCount++;
      this.bufferMultiple = this.getBufferWithMoreThanOneCount();
      this.buffers = this.getBufferCells();
    }
    // console.log("buffer with muptiple ships", this.bufferMultiple);
    // console.log("BUFFER on board.js", bufferCluster);
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
    this.occupied = [];
    this.buffers = [];
    this.hitMap.miss = [];
    this.hitMap.hit = [];

    for (const cell of this.gridMap.values()) {
      cell.reset();
    }

    for (const ship of this.shipList) {
      ship.reset();
    }
    this.bufferMultiple = [];
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

  getCorrespondingShip({ size, index }) {
    const shipIdx = this.shipList.findIndex(
      (ship) => ship.index == index && ship.size == size
    );

    return this.shipList[shipIdx];
  }

  isFleetAllSet() {
    return this.shipList.every((ship) => ship.isSet);
  }

  checkForMultipleBuffer(coor) {
    const cell = this.gridMap.get(coor);
    return cell.bufferCount > 1;
  }

  getBufferCells() {
    const res = [];
    for (const cell of this.gridMap.values()) {
      if (cell.isBuffer()) {
        res.push(cell);
      }
    }
    return res;
  }

  resetClusterOnShipOrientationChange(cluster) {
    const clusterBuffer = isBufferCluster(cluster);

    for (const c of cluster) {
      const cell = this.gridMap.get(c);
      cell.reset();
      console.log("reset", cell);
    }
    //determine if buffer serves more than one ship. If not reset it else do not reset.
    for (const c of clusterBuffer) {
      const cell = this.gridMap.get(c);
      if (cell.bufferCount <= 1) {
        cell.reset();
        console.log("reset", cell);
      }
    }
    console.log("cluster", cluster);
    console.log("buffer", clusterBuffer);
    this.occupied = this.getOccupiedCells();
    this.buffers = this.getBufferCells();
    this.bufferMultiple = this.getBufferWithMoreThanOneCount();
  }
}
// for (const ship of board.shipList) {
//   ship.isSet = true;
// }

// board.shipList[0].isSet = true;
// const res = board.isFleetAllSet();
// console.log(res);
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
