import {
  generateRandomNum,
  isValidCoor,
  generateGridArray,
  convertCoorToInt,
} from "./help";

describe.skip("generateRandomNumber", function () {
  test("generateRandomNumber should not be > 10", () => {
    expect(generateRandomNum()).not.toBeGreaterThan(10);
  });
  test("generateRandomNumber should not be < 0", () => {
    expect(generateRandomNum()).not.toBeLessThan(0);
  });
});

describe.skip("generateGridArray", () => {
  const grid = generateGridArray();

  test("grid elements should pass isValidCoor method test", () => {
    for (let i = 0; i < grid.length; ++i) {
      expect(isValidCoor(grid[i])).toBe(true);
    }
  });
});

describe.skip("validCoor function", () => {
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

describe("convert 'A,1' form to '[1,1]' form", () => {
  test("coor needs to be a valid coordinate", () => {
    const input = "A,1";
    expect(convertCoorToInt(input)).toEqual([1, 1]);
    expect(convertCoorToInt("J,10")).toEqual([10, 10]);
    expect(convertCoorToInt("D,5")).toEqual([4, 5]);
    expect(convertCoorToInt("F,9")).toEqual([6, 9]);
    expect(convertCoorToInt("0, 0")).toBe(undefined);
  });
});

describe("getAdjList()", () => {
  test("takes a coor and return it's valid adjacent neighbors ", () => {
    expect(getCoorAdjacentList("A,1")).toEqual(["A,2", "B,1", "B,2"]);
  });
});
