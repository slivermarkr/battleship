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
  if (!isValidCoor(coor)) throw new Error(`"${coor}" is NOT VALID COORDINATE`);
  const res = coor.split(",");
  res[0] = res[0].charCodeAt(0) - 64;
  res[1] = parseInt(res[1]);
  return res;
}

export function getCoorAdjacentList(coor) {
  if (!isValidCoor(coor)) throw new Error(`"${coor}" is NOT VALID COORDINATE`);
  const adj = [];
  const [row, col] = convertCoorToInt(coor);
}
