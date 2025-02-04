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
  }
}
