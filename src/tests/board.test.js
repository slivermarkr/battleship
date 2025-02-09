import { Gameboard } from "../classes/board";
import Ship from "../classes/ship";
import GridCell from "../classes/cell";
import { isValidCoor, isBufferCluster } from "../utils/fn";

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
    const board = new Gameboard(input);
    expect(board.dimension).toBe(10);
    expect(board.occupied.length).toBe(0);
    expect(board.gridMap).toBeInstanceOf(Map);
    expect(board).toBeInstanceOf(Gameboard);
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

describe("board.receiveAttack()", function () {
  test("recieveAttack() should throw an ERROR on INVALID COOR", () => {
    const board = new Gameboard(input);
    const coorToAttack = "X,11";
    expect(() => {
      board.receiveAttack(coorToAttack);
    }).toThrow("INVALID COOR");
  });

  test("receiveAttack(coor) cell equvalent should return cell.isAttacked true and board.hitMap should be be updated", () => {
    const board = new Gameboard(input);
    const coorToAttack = "A,1";
    board.receiveAttack(coorToAttack);
    expect(board.gridMap.get(coorToAttack).isAttacked).toBe(true);
    expect(board.hitMap.miss.some((el) => el == coorToAttack)).toBe(true);
  });
});

describe("board.setShip(shipParams, coordinates)", function () {
  const coordinates = ["A,1", "A,2", "A,3"];
  const ship = new Ship({ index: 1, size: 3 });
  it("shipParams has to be instance of Ship class", () => {
    expect(ship).toBeInstanceOf(Ship);
  });
  it("coordinates has to be valid", () => {
    for (const coor of coordinates) {
      expect(isValidCoor(coor)).toBe(true);
    }
  });

  const board = new Gameboard(input);
  board.setShip(ship, coordinates);
  it("is setShip successfully board.occupied array should have the valud of coordinates", () => {
    expect(board.occupied).toEqual(expect.arrayContaining(coordinates));
  });
  it("each grid cell should contains the same Ship instance", () => {
    for (const coor of coordinates) {
      expect(board.gridMap.get(coor).shipData).toEqual(ship);
    }
  });
  it("ship Object isSet should be true after calling the setShip()", () => {
    for (const coor of coordinates) {
      expect(board.gridMap.get(coor).shipData.isSet).toBe(true);
    }
  });

  it("on setShip(): ship.cluster === coordinates", () => {
    for (const coor of coordinates) {
      expect(board.gridMap.get(coor).shipData.cluster).toEqual(coordinates);
    }
  });

  it("ERROR is returned if shipObj.size !== coordinates.length", () => {
    const ship = new Ship({ size: 1, index: 2 });
    expect(() => {
      board.setShip(ship, coordinates);
    }).toThrow("shipObj.size !== coordinates.length");
  });

  it("return an Error if user tries to setShip in an occupied cell: 'coordinate you're trying to place ship is already occupied'", () => {
    expect(() => board.setShip(ship, coordinates)).toThrow(
      "coordinate is already occupied"
    );
  });

  it("coordinates adjList element must be set to isBuffer = true", () => {
    const bufferArray = isBufferCluster(coordinates);
    for (let i = 0; i < bufferArray.length; ++i) {
      expect(board.gridMap.get(bufferArray[i]).isBuffer).toBe(true);
    }
  });

  it("return error if cell is a buffer", () => {
    const ship = new Ship({ size: 1, index: 2 });
    expect(() => board.setShip(ship, ["B,2"])).toThrow(
      "coordinate is already buffer"
    );
  });
});

describe("getOccupied() returns array of occupied coordinates", () => {
  it("iterate through gridMap and find cell that contains ship", () => {
    const board = new Gameboard(input);
    const coordinates = ["A,1", "A,2", "A,3"];
    const ship = new Ship({ index: 1, size: 3 });
    board.setShip(ship, coordinates);

    expect(board.getOccupiedCells()).toEqual(coordinates);
    expect(board.getOccupiedCells()).toEqual(
      expect.arrayContaining(coordinates)
    );
    expect(board.occupied).toEqual(expect.arrayContaining(coordinates));
  });
});

describe("board.reset()", () => {
  it("iterate through gridMap do cell.reset()", () => {
    const board = new Gameboard(input);
    const ship = new Ship({ index: 1, size: 3 });
    const coordinates = ["A,1", "A,2", "A,3"];
    board.setShip(ship, coordinates);

    board.reset();

    for (const cell of board.gridMap.values()) {
      expect(cell.isOcccupied).toBe(false);
      expect(cell.isAttacked).toBe(false);
      expect(cell.isBuffer).toBe(false);
      expect(cell.shipData).toBe(undefined);
    }
  });

  const board = new Gameboard(input);
  const ship = new Ship({ index: 1, size: 3 });
  const coordinates = ["A,1", "A,2", "A,3"];
  board.setShip(ship, coordinates);
  it("board.occupied = []", () => {
    board.reset();

    expect(board.occupied).toEqual([]);
  });

  it("board.hitMap.hit = []", () => {
    board.receiveAttack("A,1");
    board.reset();
    expect(board.hitMap.hit).toEqual([]);
  });

  it("board.hitMap.miss = []", () => {
    board.receiveAttack("J,1");
    board.reset();
    expect(board.hitMap.miss).toEqual([]);
  });
});

describe("Gameboard.createArrayOfShipInstances()", function () {
  const shipArrayInput = [
    { type: 1, instances: 4 },
    { type: 2, instances: 3 },
    { type: 3, instances: 2 },
    { type: 4, instances: 1 },
  ];
  const board = new Gameboard(input);
  it("given an array of object that contains  type of ship and it's # of instances return an array of Ship instances", () => {
    expect(board.createArrayOfShipInstances(shipArrayInput)).toBeInstanceOf(
      Array
    );
  });
  const array = board.createArrayOfShipInstances(shipArrayInput);

  it("board.createArrayOfShipInstances() should be the sum of the shipArrayInput.instances", () => {
    let sumOfInstances = 0;
    for (let i = 0; i < shipArrayInput.length; ++i) {
      sumOfInstances += shipArrayInput[i].instances;
    }
    expect(array.length).toBe(sumOfInstances);
  });

  it("createArrayOfShipInstances() elements should all be an instance of 'class' Ship", () => {
    for (let i = 0; i < array.length; ++i) {
      expect(array[i]).toBeInstanceOf(Ship);
      expect(board.shipList[i]).toBeInstanceOf(Ship);
    }
  });
});

describe("getRemainingShipCount()", function () {
  const board = new Gameboard(input);

  it("getRemainingShipCount() returns number of ships still alive", () => {
    expect(board.getRemainingShipCount()).toBe(10);
  });

  it("getRemainingShipCount() will not change if until ship is sunk", () => {
    // hit the ship that has four lives once
    board.shipList[9].isHit();
    expect(board.getRemainingShipCount()).toBe(10);
  });

  it("getRemainingShipCount() returns number of ships still alive", () => {
    board.shipList[0].isHit();
    expect(board.getRemainingShipCount()).toBe(9);
    expect(board.shipList[9].hitCount).toBe(1);
  });
});

describe("isFleetDefeated()", function () {
  const board = new Gameboard(input);

  it("returns true if board.getRemainingShipCount return 0", () => {
    expect(board.isFleetDefeated()).toBe(false);
  });

  it("returns true if board.getRemainingShipCount return 0", () => {
    for (let i = 0; i < board.shipList.length; ++i) {
      board.shipList[i].isHit();
      board.shipList[i].isHit();
      board.shipList[i].isHit();
      board.shipList[i].isHit();
    }
    expect(board.isFleetDefeated()).toBe(true);
  });
});
