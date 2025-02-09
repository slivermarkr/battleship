const DIMENSION = 10;

export function generateRandomNum() {
  return Math.floor(Math.random() * 10);
}

export function isValidCoor(coor, dimension = 10) {
  let [a, b] = coor.split(",");
  a = a.charCodeAt(0) - 64;
  b = parseInt(b);
  return a <= dimension && a >= 1 && b <= dimension && b >= 1;
}

export function generateGridArray(DIMENSION) {
  const gridArray = [];
  for (let i = 0; i < DIMENSION; ++i) {
    for (let j = 1; j <= DIMENSION; ++j) {
      const coor = `${String.fromCharCode(i + 65)},${j}`;
      gridArray.push(coor);
    }
  }
  return gridArray;
}

export function convertCoorToInt(coor) {
  if (!isValidCoor(coor)) {
    throw new Error("NOT VALID COORDINATE");
  }
  const res = coor.split(",");
  res[0] = res[0].charCodeAt(0) - 64;
  res[1] = parseInt(res[1]);
  return res;
}

export function getCoorAdjacentList(coor) {
  if (!isValidCoor(coor)) throw new Error(`"${coor}" is NOT VALID COORDINATE`);
  const [row, col] = convertCoorToInt(coor);
  const possibleBuffer = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    // [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return possibleBuffer
    .map(([x, y]) => [row + x, col + y])
    .filter(
      ([nRow, nCol]) =>
        nRow >= 1 && nRow <= DIMENSION && nCol <= DIMENSION && nCol >= 1
    )
    .map(([rChar, cNum]) => {
      const coor = `${String.fromCharCode(rChar + 64)},${cNum}`;
      return isValidCoor(coor) ? coor : "ERROR: NOT VALID COOR";
    });
}

export function getRandomOrientation() {
  return Math.random() > 0.5 ? "h" : "v";
}

export function isBufferCluster(coordinates) {
  let result = [];
  for (let i = 0; i < coordinates.length; ++i) {
    const adjList = getCoorAdjacentList(coordinates[i]);
    // console.log(`adjList of ${coordinates[i]}`, adjList);
    result = result.concat(adjList);
  }

  result = result.reduce((a, b) => {
    if (a.some((aEl) => aEl == b) || coordinates.some((coor) => coor == b))
      return a;
    a.push(b);
    return a;
  }, []);

  return result.sort((a, b) => (a.charCodeAt(0) > b.charCodeAt(0) ? -1 : 0));
}

export function generateRandomCoordinates() {
  return `${String.fromCharCode(generateRandomNum() + 65)},${
    generateRandomNum() + 1
  }`;
}

export function isCellClearForOccupation(coor, { occupied, gridMap }) {
  const cell = gridMap.get(coor) || {};
  return !occupied.includes(coor) && !cell.isBuffer; // returns true if cell.isBuffer = false && !occupied.includes(coor)
}

export function generateRandomCluster({ size }, { occupied, gridMap }) {
  let cluster;
  let isValid = false;
  let orientation = undefined;

  while (!isValid) {
    cluster = [];
    orientation = getRandomOrientation();
    const coor = generateRandomCoordinates();

    if (!isCellClearForOccupation(coor, { occupied, gridMap })) continue;

    cluster.push(coor);
    console.log("coor", coor);

    const coorAsInteger = convertCoorToInt(coor); //returns [1,1] ex. "A,1"
    for (let i = 1; i < size; ++i) {
      let nextCoor;
      if (orientation == "h") {
        nextCoor = `${String.fromCharCode(coorAsInteger[0] + 64)},${
          coorAsInteger[1] + i
        }`;
      } else if (orientation == "v") {
        nextCoor = `${String.fromCharCode(coorAsInteger[0] + i + 64)},${
          coorAsInteger[1]
        }`;
      }
      if (
        !isValidCoor(nextCoor) ||
        !isCellClearForOccupation(nextCoor, { occupied, gridMap })
      ) {
        cluster = [];
        break;
      }
      console.log("next", nextCoor);
      cluster.push(nextCoor);
    }

    if (cluster.length == size) isValid = true;
  }

  return { cluster, orientation };
}
