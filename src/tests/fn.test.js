import {
  calculatePossibleCluster,
  getCoorAdjacentCorner,
  generateRandomNum,
  isValidCoor,
  generateGridArray,
  convertCoorToInt,
  getCoorAdjacentList,
  getRandomOrientation,
  isBufferCluster,
  generateRandomCoordinates,
  generateRandomCluster,
  isCellClearForOccupation,
} from "../utils/fn";

import { Gameboard } from "../classes/board.js";

describe("generateRandomNumber", function () {
  test("generateRandomNumber should not be > 10", () => {
    for (let i = 0; i < 100; ++i) {
      expect(generateRandomNum()).not.toBeGreaterThan(10);
    }
  });
  test("generateRandomNumber should not be < 0", () => {
    for (let i = 0; i < 100; ++i) {
      expect(generateRandomNum()).not.toBeLessThan(0);
    }
  });
});

describe("generateGridArray", () => {
  const grid = generateGridArray();

  test("grid elements should pass isValidCoor method test", () => {
    for (let i = 0; i < grid.length; ++i) {
      expect(isValidCoor(grid[i])).toBe(true);
    }
  });
});

describe("validCoor function", () => {
  test("coor needs to be a valid coordinate", () => {
    const coordinates = ["A,1", "A,2", "A,3"];
    for (let coor of coordinates) {
      expect(isValidCoor(coor)).toBe(true);
    }
  });

  test("coor needs to be a valid coordinate", () => {
    expect(isValidCoor("A,11")).toBe(false);
  });
});

describe("converCoorToInt() convert 'A,1' form to '[1,1]' form", () => {
  test("coor needs to be a valid coordinate", () => {
    const input = "A,1";
    expect(convertCoorToInt(input)).toEqual([1, 1]);
    expect(convertCoorToInt("J,10")).toEqual([10, 10]);
    expect(convertCoorToInt("D,5")).toEqual([4, 5]);
    expect(convertCoorToInt("F,9")).toEqual([6, 9]);
  });
  test("throw error if input was INVALID COORDINATE", () => {
    expect(() => convertCoorToInt("0,0")).toThrow(
      new Error("NOT VALID COORDINATE")
    );
    expect(() => convertCoorToInt("Z,Z")).toThrow(
      new Error("NOT VALID COORDINATE")
    );
    expect(() => convertCoorToInt("K,10")).toThrow(
      new Error("NOT VALID COORDINATE")
    );
    expect(() => convertCoorToInt("A,0")).toThrow(
      new Error("NOT VALID COORDINATE")
    );
  });
});

describe("getAdjList()", () => {
  test("takes a coor and return it's valid adjacent neighbors ", () => {
    expect(getCoorAdjacentList("A,1")).toEqual(["A,2", "B,1", "B,2"]);

    expect(getCoorAdjacentList("J,10").sort((a, b) => a - b)).toEqual(
      ["I,9", "I,10", "J,9"].sort((a, b) => a - b)
    );

    expect(getCoorAdjacentList("D,5").sort((a, b) => a - b)).toEqual(
      ["C,4", "C,5", "C,6", "D,4", "D,6", "E,4", "E,5", "E,6"].sort(
        (a, b) => a - b
      )
    );
  });
});

it("getRandomOrientation should return only 'h' or 'v'", () => {
  for (let i = 0; i < 100; ++i) {
    let result = getRandomOrientation();
    expect(["h", "v"]).toContain(result);
  }
});

describe("isBufferCluster()", function () {
  it("given an array return array of combined buffer", () => {
    const coordinates = ["A,1", "A,2", "A,3"];
    const result = isBufferCluster(coordinates);
    const expected = ["B,1", "B,2", "B,3", "B,4", "A,4"];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result.length).toBe(expected.length);
  });

  it("given an array return array of combined buffer", () => {
    const coordinates = ["A,1"];
    const result = isBufferCluster(coordinates);
    const expected = ["B,2", "B,1", "A,2"];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result.length).toBe(expected.length);
  });
});

describe("generateRandomCoordinate()", function () {
  it("should produce a validCoordinates only", () => {
    for (let i = 0; i < 300; ++i) {
      const res = generateRandomCoordinates();
      expect(isValidCoor(res)).toBe(true);
    }
  });
});

describe("generateRandomCluster given a size and an array of occupied grid", function () {
  it("", () => {
    const board = new Gameboard({ name: "Me", dimension: 10 });
    const cluster = generateRandomCluster(board.shipList[0], board); // return {cluster: [], orientation: "h"}

    for (const element of cluster.cluster) {
      expect(isValidCoor(element)).toBe(true);
    }
  });
});

describe("getCoorAdjacentCorner", function () {
  it("is a cell isHit and it was occupied reveal it's  adjacentCorner", () => {
    const coor = "A,1";
    expect(getCoorAdjacentCorner(coor)).toEqual(
      expect.arrayContaining(["B,2"])
    );
  });

  it("is a cell isHit and it was occupied reveal it's  adjacentCorner", () => {
    const coor = "D,5";
    expect(getCoorAdjacentCorner(coor)).toEqual(
      expect.arrayContaining(["C,4", "C,6", "E,4", "E,6"])
    );
  });
});

describe("#calculatePossibleCluster", function () {
  // for the ship with size 3
  const board = new Gameboard({ name: "You", dimension: 10 });
  const coor = "A,1";
  const shipSize = 3;
  const orientation = "v";
  // calculate possible cluster
  // if the e.target.coordinate is "A,1" and the orientation is "h" function should return ["A,2", "A,3"]
  const result = calculatePossibleCluster(
    "A,1",
    { size: shipSize, orientation },
    board
  );
  expect(result).toEqual(expect.arrayContaining(["A,2", "A,3"]));
});

describe("#isCellClearForOccupation", function () {
  const board = new Gameboard({ name: "ME", dimension: 10 });
  it("valid cell", () => {
    expect(isCellClearForOccupation("A,1", board)).toBe(true);
  });
  it("invalid cell", () => {
    expect(isCellClearForOccupation("A,11", board)).toBe(false);
  });
});
