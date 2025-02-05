import { generateRandomNum, isValidCoor, generateGridArray } from "./help";

describe("generateRandomNumber", function () {
  test("generateRandomNumber should not be > 10", () => {
    expect(generateRandomNum()).not.toBeGreaterThan(10);
  });
  test("generateRandomNumber should not be < 0", () => {
    expect(generateRandomNum()).not.toBeLessThan(0);
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
