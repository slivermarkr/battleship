import { Gameboard, Ship } from "./classes";

const input = {
  name: "Player One",
  dimension: 10,
};

describe("Gameboard Test", function () {
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
});
