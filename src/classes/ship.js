export default class Ship {
  constructor({ size, index, orientation = "h", cluster = [] } = {}) {
    this.size = size;
    this.orientation = orientation;
    this.index = index;
    this.hitCount = 0;
    this.cluster = cluster;
    this.isSet = false;
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

  reset = () => {
    this.hitCount = 0;
    this.cluster = undefined;
    this.isSet = false;
    this.orientation = "h";
  };
}
