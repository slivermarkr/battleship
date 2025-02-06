import { Ship } from "../classes/ship";

// Ship input
const input = {
  size: 3,
  index: 1,
  orientation: "h",
  cluster: ["A,1", "A,2", "A,3"],
};

describe("SHIP TEST", () => {
  test("size should be a num", () => {
    expect(input).toEqual({
      size: 3,
      index: 1,
      orientation: "h",
      cluster: ["A,1", "A,2", "A,3"],
    });
  });

  test("size of the ship input", () => {
    const ship = new Ship(input);
    expect(ship.size).toBe(3);
  });

  test("ship.isSunk() should return false if ship.size > ship.hitCount ", () => {
    const ship = new Ship(input);
    expect(ship.isSunk()).toBe(false);
  });

  test("ship.isSunk() should return false if ship.size > ship.hitCount ", () => {
    const ship = new Ship(input);
    ship.isHit();
    ship.isHit();
    ship.isHit();
    expect(ship.isSunk()).toBe(true);
  });

  test("getCoorCluster returns coordinates that contains ship", () => {
    const ship = new Ship(input);
    expect(ship.getCoorCluster()).toEqual(["A,1", "A,2", "A,3"]);
  });

  test("length of the getCoorCluster should be equal to the size of ship", () => {
    const ship = new Ship(input);
    expect(ship.getCoorCluster().length).toBe(ship.size);
  });

  test("cluster cannot go out of bounds", () => {
    const ship = new Ship(input);
    expect(ship.getCoorCluster().length).not.toBeGreaterThan(ship.size);
  });

  test("hitCount cannot be greater than the size", () => {
    const ship = new Ship(input);
    ship.isHit();
    ship.isHit();
    ship.isHit();
    ship.isHit();
    expect(ship.hitCount).not.toBeGreaterThan(ship.size);
  });

  test("reset ship", () => {
    const ship = new Ship(input);
    ship.isHit();
    ship.isHit();
    ship.isHit();
    ship.resetShip();
    expect(ship.hitCount).toBe(0);
    expect(ship.cluster).toBe(undefined);
  });
});
