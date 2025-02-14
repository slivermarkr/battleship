import { generateGridArray } from "../utils/fn.js";

export default class UI {
  static addBlurTable(root, tablename, gameover) {
    if (!gameover) {
      root
        .querySelectorAll("table")
        .forEach((table) => table.classList.remove("blur"));
    }
    const table = root.querySelector(`table#${tablename}`);
    table.classList.add("blur");
  }

  static shipSunk(coor, table) {
    for (let i = 0; i < coor.length; ++i) {
      table
        .querySelector(`.grid[data-coordinate="${coor[i]}"]`)
        .classList.add("isSunk");
    }
  }

  static isReadyForBatlle(root) {
    root
      .querySelectorAll(".ship")
      .forEach((ship) => ship.classList.add("disableShip"));

    root.querySelectorAll(".grid").forEach((grid) => (grid.style.zIndex = 100));
  }

  static changeShipOrientation(shipEl) {
    const orientation = shipEl.dataset.orientation;
    console.log("HELLO?");
    if (orientation == "v") {
      shipEl.setAttribute("data-orientation", "h");
    } else {
      shipEl.setAttribute("data-orientation", "v");
    }
  }

  static showTheRightSideArenaWhenShipAllSet(root) {
    root.querySelector(".rightSide").classList.toggle("hidden");
    root.querySelector(".linkGrp").classList.toggle("hidden");
    root.querySelector(".fleetSetupDiv").remove();
  }

  static removeGridHL(coordinates, hlName, table) {
    // console.log(table);
    for (const c of coordinates) {
      const cellElement = table.querySelector(`.grid[data-coordinate="${c}"]`);
      cellElement.classList.remove(hlName);
    }
  }

  static dragoverHlRed(coordinates, table) {
    table
      .querySelectorAll(".grid")
      .forEach((cell) => cell.classList.remove("dragoverred"));

    for (let i = 0; i < coordinates.length; ++i) {
      const gridEl = table.querySelector(
        `.grid[data-coordinate="${coordinates[i]}"]`
      );
      gridEl.classList.add("dragoverred");
    }
  }

  static dragoverHl(coordinates, table) {
    table
      .querySelectorAll(".grid")
      .forEach((cell) => cell.classList.remove("dragover"));

    for (let i = 0; i < coordinates.length; ++i) {
      const gridEl = table.querySelector(
        `.grid[data-coordinate="${coordinates[i]}"]`
      );
      gridEl.classList.add("dragover");
    }
  }

  static onDragStart(ship) {
    // console.log("You start dragging " + ship);
  }

  static bufferGridHl(root, cluster, table) {
    const tableEl = root.querySelector(`table#${table}`);
    for (let i = 0; i < cluster.length; ++i) {
      const gridEl = tableEl.querySelector(
        `.grid[data-coordinate="${cluster[i]}"]`
      );
      gridEl.classList.add("buffer");
    }
  }

  static updateInfor(root, message) {
    root.querySelector(".info").textContent = message;
  }

  static showRematchModal(root, className, message) {
    const modal = root.querySelector(".rematchModal");
    modal.classList.add(className);
    const span = modal.querySelector(".rematchModalSpan");
    span.textContent = message;
    modal.showModal();
  }

  static showBuffer(adjacentCorner, table) {
    for (let i = 0; i < adjacentCorner.length; ++i) {
      const adjCell = table.querySelector(
        `.grid[data-coordinate="${adjacentCorner[i]}"]`
      );
      if (!adjCell.classList.contains("revealed")) {
        adjCell.classList.add("revealed");
      }
    }
  }
  static hitCellHl(coor, table, adjacentCorner) {
    const cell = table.querySelector(`.grid[data-coordinate="${coor}"]`);
    cell.classList.add("hit");
    const zContainer = cell.parentElement.querySelector(".z");
    zContainer.classList.add("showXmark");
    // console.log(zContainer);
    UI.showBuffer(adjacentCorner, table);
  }

  static missCellHl(coor, table) {
    const cell = table.querySelector(`.grid[data-coordinate="${coor}"]`);
    cell.classList.add("miss");
    const zContainer = cell.parentElement.querySelector(".z");
    // console.log(zContainer);
    zContainer.classList.add("missDot");
  }

  static clearTable(table) {
    table
      .querySelectorAll(".grid")
      .forEach((grid) => grid.classList.remove("occupied"));
  }
  static occupiedGridHl(grid) {
    grid.classList.add("occupied");
  }

  static showFleetBox({ name, shipList }, cb, captainName) {
    const fleetBox = document.createElement("div");
    fleetBox.classList.add("fleetSetupDiv");
    fleetBox.setAttribute("data-captain", name);
    for (const shipObj of shipList) {
      const shipEl = cb(shipObj, captainName);
      fleetBox.appendChild(shipEl);
    }
    return fleetBox;
  }

  static createShipElement(shipObj, captain) {
    const shipInstance = document.createElement("div");
    shipInstance.classList.add("ship");
    shipInstance.setAttribute("data-index", shipObj.index);
    shipInstance.setAttribute("data-captain", captain);
    shipInstance.setAttribute("data-size", shipObj.size);
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
