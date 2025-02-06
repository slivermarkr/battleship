import { generateRandomNum, convertCoorToInt } from "./help.js";
export class Ship {
  constructor({ size, index, orientation, cluster } = {}) {
    this.size = size;
    this.orientation = orientation;
    this.index = index;
    this.hitCount = 0;
    this.cluster = cluster;
  }

  isHit = () => {
    return ++this.hitCount;
  };

  isSunk = () => {
    return this.hitCount >= this.size ? true : false;
  };

  getCoorCluster = () => {
    return this.cluster;
  };
}

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
  }

  receiveAttack(coor) {
    const cell = board.gridMap.get(coor);
  }
}

export class GridCell {
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
    const [row, col] = convertCoorToInt(this.coor); //ex. "A,1" to "[1,1]"
    LL;
    return row, col;
  }
}
