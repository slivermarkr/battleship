import { Gameboard, Ship } from "./classes";

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
