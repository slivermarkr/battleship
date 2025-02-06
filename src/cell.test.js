import { GridCell } from "./classes.js";

export { GridCell } from "./classes";
export { isValidCoor } from "./help";

const output = {
  coor: "A,1",
  isOccupied: false,
  isBuffer: false,
  adjacentList: undefined,
};

const ship = {
  type: 1,
  index: 1,
};

describe("GridCell test", () => {
  test("cell output", () => {
    const coor = "A,1";
    const cell = new GridCell(coor);
    expect(cell.isBuffer).toBe(output.isBuffer);
    expect(cell.isOcccupied).toBe(output.isOccupied);
    expect(cell.coor).toBe(output.coor);
    expect(cell.adjacentList).toBe(output.adjacentList);
  });

  //if cell is occupied
  //buffer will depend on the size of the ship
  //1x1 ship would have 9 buffer around
  test("cell.takeShip(ship)", () => {
    const cell = new GridCell(output.coor);
    cell.takeShip(ship);
    expect(cell.isOccupied).toBe(true);
  });

  test("cell.getBuffer()", () => {
    const cell = new GridCell(output.coor);
    expect(cell.getBuffer()).toEqual(undefined);
  });

  test("cell.getAdjacentList()", () => {
    const cell = new GridCell(output.coor);
    expect(cell.getAdjacentList()).toEqual();
  });
});
