import { generateGridArray, isBufferCluster } from "../utils/fn.js";

export default class UI {
  static hideShipOnDragStart(ship) {
    ship.classList.toggle("invi");
  }

  static showShipOnDragEnd(ship) {
    ship.classList.toggle("invi");
  }
  static bufferGridHl(root, cluster, table) {
    const tableEl = root.querySelector(`table#${table}`);
    UI.removeGridHL(generateGridArray(10), "buffer", tableEl);

    for (let i = 0; i < cluster.length; ++i) {
      const gridEl = tableEl.querySelector(
        `.grid[data-coordinate="${cluster[i].coor}"]`
      );
      gridEl.classList.add("buffer");
    }
  }

  // static setBufferClasslist(root, { buffers, name }) {
  //   const table = root.querySelector(`table#${name}`);
  //   UI.removeGridHL(generateGridArray(10), "buffer", table);

  //   UI.bufferGridHl(root, isBufferCluster(buffers), name);
  // }

  static showOccupiedGrid(root, { name, board }) {
    const table = root.querySelector(`table#${name}`);
    UI.clearTable(table);
    for (let i = 0; i < board.occupied.length; ++i) {
      const cell = table.querySelector(
        `.grid[data-coordinate='${board.occupied[i]}']`
      );
      UI.occupiedGridHl(cell);
    }
  }

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
      .forEach((ship) => ship.setAttribute("draggable", false));
  }

  static changeShipOrientation(
    root,
    gridElCoor,
    shipEl,
    orientation,
    name,
    isShipRed
  ) {
    const table = root.querySelector(`table#${name}`);
    const grid = table.querySelector(`.grid[data-coordinate="${gridElCoor}"]`);
    shipEl.setAttribute("data-orientation", orientation);
    grid.appendChild(shipEl);
    if (isShipRed) {
      UI.updateInfor(root, "Collision detected!");
      shipEl.classList.add("redShip");
      setTimeout(() => {
        shipEl.classList.remove("redShip");
      }, 200);
    } else {
      UI.updateInfor(root, "Changed orientation successfully.");
    }
  }

  static showTheRightSideArenaWhenShipAllSet(root) {
    root.querySelector(".rightSide").classList.toggle("hidden");
    root.querySelector(".linkGrp").classList.toggle("hidden");
    root.querySelector(".fleetSetupDiv").remove();
  }

  static removeGridHL(coordinates, hlName, table) {
    if (!coordinates) return;
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

  static onDragStart(ship) {}

  static updateInfor(root, message) {
    root.querySelector(".info").textContent = message;
  }

  static showChooseModal(root) {
    const modal = root.querySelector(".chooseModal");
    modal.classList.add("choose");
    modal.textContent = "";

    const p = document.createElement("p");
    p.textContent = "Sorry, PvP mode is not implemented yet.";
    modal.appendChild(p);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", (e) => {
      modal.close();
    });
    modal.appendChild(closeBtn);

    modal.showModal();
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
    UI.showBuffer(adjacentCorner, table);
  }

  static missCellHl(coor, table) {
    const cell = table.querySelector(`.grid[data-coordinate="${coor}"]`);
    cell.classList.add("miss");
    const zContainer = cell.parentElement.querySelector(".z");
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
