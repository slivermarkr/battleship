import { Gameboard } from "../classes/board";
import GridCell from "../classes/cell";

const input = {
  name: "Player One",
  dimension: 10,
};

describe.skip("Gameboard Test", function () {
  test("input dimension", () => {
    expect(input.dimension).toEqual(10);
  });

  test("input obj", () => {
    expect(input).toEqual({ name: "Player One", dimension: 10 });
  });

  test("Gameboard output", () => {
    const board = new Gameboard(input);
    expect(board.name).toEqual(input.name);
  });

  test("gameboard as instance constructor", () => {
    const gbOutput = {
      name: "Player One",
      dimension: 10,
      gridMap: new Map(),
      occupied: [],
      hitMap: {
        hit: [],
        miss: [],
      },
    };
    const board = new Gameboard(input);
    expect(board).toEqual(gbOutput);
  });

  test("baord.receiveAttack(): if board.map.get(coor) was attacked check if it's miss or hit", () => {
    const board = new Gameboard(input);
    const coor = "A,1";
    board.receiveAttack(coor);

    const cell = board.gridMap.get(coor);

    if (cell.isOccupied) {
      expect(board.hitMap.hit).toContain(coor);
      expect(board.hitMap.miss).not.toContain(coor);
      expect(cell.ship.isHit).toBe(true);
    } else if (!cell.isOccupied) {
      expect(board.hitMap.miss).toContain(coor);
      expect(board.hitMap.hit).not.toContain(coor);
    }
  });
});

describe("create GridMap use coordinate as key", () => {
  const board = new Gameboard(input);
  const firstCoor = "A,1";
  const lastCoor = "J,10";
  // board.gridMap.set(coor, new GridCell(coor));

  const cell = new GridCell("A,1");
  const lcell = new GridCell("J,10");

  test("getting first cell", () => {
    expect(board.gridMap.get(firstCoor)).toEqual(cell);
  });

  test("getting the adjacentList of first cell", () => {
    expect(board.gridMap.get(firstCoor).getAdjacentList()).toEqual([
      "A,2",
      "B,1",
      "B,2",
    ]);
  });

  test("getting last cell", () => {
    expect(board.gridMap.get(lastCoor)).toEqual(lcell);
  });

  test("getting the adjacentList of last cell", () => {
    expect(board.gridMap.get(lastCoor).getAdjacentList()).toEqual([
      "I,9",
      "I,10",
      "J,9",
    ]);
  });

  test("test error on board.gridMap.get()", () => {
    expect(board.gridMap.get("Z,11")).toBe(undefined);
  });

  test("board.gridMap.size === 100", () => {
    expect(board.gridMap.size).toBe(100);
  });
});
