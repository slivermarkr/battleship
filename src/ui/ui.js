import { generateGridArray } from "../utils/fn.js";

export default class UI {
  static showFleetBox({ shipList }, cb) {
    const fleetBox = document.createElement("div");
    fleetBox.classList.add("fleetSetupDiv");
    for (const shipObj of shipList) {
      const shipEl = cb(shipObj);
      fleetBox.appendChild(shipEl);
    }
    return fleetBox;
  }

  static createShipElement(shipObj) {
    const shipInstance = document.createElement("div");
    shipInstance.classList.add("ship");
    shipInstance.setAttribute("data-index", shipObj.index);
    shipInstance.setAttribute("data-type", shipObj.size);
    shipInstance.setAttribute("data-orientation", shipObj.orientation);
    shipInstance.setAttribute("draggable", true);
    return shipInstance;
  }

  static createGridBox({ name, dimension }) {
    const table = document.createElement("table");
    table.id = name;
    const tbody = document.createElement("tbody");

    const namePlace = document.createElement("p");
    namePlace.textContent = name;
    for (let i = 0; i < dimension; i++) {
      const row = document.createElement("tr");
      for (let j = 1; j <= dimension; j++) {
        const cell = document.createElement("td");
        const shipBox = document.createElement("div");
        const z = document.createElement("span");
        if (i == 0) {
          cell.classList.add("label-col");
          cell.setAttribute("data-label", j);
        } else if (j == 1) {
          cell.classList.add("label-row");
          cell.setAttribute("data-label", String.fromCharCode(i + 65));
        }
        cell.classList.add("cell");
        shipBox.classList.add("grid");
        z.classList.add("z");
        cell.append(shipBox, z);

        shipBox.setAttribute(
          "data-coordinate",
          `${String.fromCharCode(i + 65)},${j}`
        );
        row.appendChild(cell);
        tbody.appendChild(row);
      }
    }
    table.appendChild(tbody);
    table.appendChild(namePlace);
    return table;
  }
}
