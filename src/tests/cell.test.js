import GridCell from "../classes/cell";

const output = {
  coor: "A,1",
  isOccupied: false,
  isBuffer: false,
  isAttacked: false,
  shipData: undefined,
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
    expect(cell.shipData).toBe(output.shipData);
    expect(cell.isAttacked).toBe(output.isAttacked);
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
    expect(cell.getAdjacentList()).toEqual(["A,2", "B,1", "B,2"]);
  });

  test("cell.getAdjacentList()", () => {
    const cell = new GridCell("J,10");
    expect(cell.getAdjacentList()).toEqual(["I,9", "I,10", "J,9"]);
  });

  test("throw ERROR on INVALID COOR cell.getAdjacentList()", () => {
    const cell = new GridCell("Z,11");
    // expect(cell.getAdjacentList()).toEqual(["I,9", "I,10", "J,9"]);
    expect(() => cell.getAdjacentList("Z,11")).toThrow(
      new Error(`"Z,11" is NOT VALID COORDINATE`)
    );
  });
});

describe("Cell.reset()", () => {
  const cell = new GridCell("A,1");
  cell.isOcccupied = true;
  cell.isAttacked = true;
  cell.isBuffer = false;
  cell.takeShip({ size: 3, index: 1 });
  cell.reset();
  it("reset cell properties to false, and ship to undefined", () => {
    expect(cell.isOcccupied).toBe(false);
    expect(cell.isAttacked).toBe(false);
    expect(cell.isBuffer).toBe(false);
    expect(cell.shipData).toBe(undefined);
  });
});
