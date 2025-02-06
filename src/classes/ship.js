export class Ship {
  constructor({ size, index, orientation, cluster } = {}) {
    this.size = size;
    this.orientation = orientation;
    this.index = index;
    this.hitCount = 0;
    this.cluster = cluster;
  }

  isHit = () => {
    return this.hitCount < this.size ? ++this.hitCount : this.size;
  };

  isSunk = () => {
    return this.hitCount >= this.size ? true : false;
  };

  getCoorCluster = () => {
    return this.cluster;
  };

  resetShip = () => {
    this.hitCount = 0;
    this.cluster = undefined;
  };
}
