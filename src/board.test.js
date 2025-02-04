import { Gameboard } from "./classes";

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
});
