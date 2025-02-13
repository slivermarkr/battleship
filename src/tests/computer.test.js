import { Computer } from "../classes/player.js";

describe("#computer", function () {
  const ai = new Computer({});
  it("array of grid to attack", () => {
    expect(ai.gridYetToAttack.length).toBe(100);
  });

  it("returns the coordinate from the gridYetToAttack", () => {
    expect(ai.attackRandomly()).toBeInstanceOf(String);
  });
});
