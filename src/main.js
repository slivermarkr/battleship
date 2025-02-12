import { Player, Computer } from "./classes/player.js";
import {
  getCoorAdjacentList,
  isBufferCluster,
  isCellClearForOccupation,
} from "./utils/fn.js";
import UI from "./ui/ui.js";

export default class App {
  constructor(root) {
    this.root = root;

    this.playerOne = new Player({ name: "You" });
    this.playerTwo = new Computer({});

    this.controller = {
      isReady: false,
      isResetMode: false,
      isGameOver: false,
      comboCount: 0,
    };

    this.dragState = {
      isValid: true,
      dragItemEl: undefined,
      dragObject: undefined,
      dropItemEl: undefined,
      dragItemPreviousCluster: undefined,
    };

    this.activePlayer = undefined;

    this.root.insertAdjacentHTML("afterbegin", this.initHTML());
    this.refresh();

    this.onLinkListener();
    this.onGridListener();
  }

  refresh() {
    this.activePlayer = this.playerOne;

    this.controller.isReady = false;
    this.controller.isResetMode = false;
    this.controller.comboCount = false;
    this.controller.isGameOver = false;

    this.playerOne.board.reset();
    this.playerTwo.board.reset();
    this.displayArena();

    // randomly append ship
    this.appendShipElementToGridEl();
    this.showOccupiedGrid(this.playerOne);
    this.shipDragEventListener(this.playerOne.name);
    this.gridDragDropEventListener();
    // console.log(this.activePlayer.board.bufferMultiple);
  }

  gridDragEnter(gridEl) {
    const isValid = isCellClearForOccupation(
      gridEl.dataset.coordinate,
      this.activePlayer.board
    );
    console.log("ONDRAGENTER", isValid, gridEl.dataset.coordinate);
    console.log(
      "isThisaBuffer",
      this.activePlayer.board.gridMap.get(gridEl.dataset.coordinate)
    );
    if (gridEl.closest("table").id !== this.activePlayer.name || !isValid) {
      console.log("COLLISION DETECTED");
      return;
    }
  }

  gridDragover(e) {
    e.preventDefault();
    // console.log(e.target);
    // if (
    //   !isCellClearForOccupation(
    //     e.target.dataset.coordinate,
    //     this.activePlayer.board
    //   )
    // )
    // console.log(e.target.dataset.coordinate, "isBuffer or occupied");
  }

  gridDragLeave(e) {}

  //#dropevent
  gridDrop(e) {
    const table = e.target.closest("table");
    if (table.id !== this.dragState.dragItemEl.dataset.captain) {
      this.dragState.isValid = false;
      this.dragState.dragObject.cluster =
        this.dragState.dragItemPreviousCluster;
      console.log("INVALID", this.dragState.dragObject);
      return;
    }

    const cellElement = e.target;
    const isValidCoor = isCellClearForOccupation(
      cellElement.dataset.coordinate,
      this.activePlayer.board
    );

    if (isValidCoor) {
      this.dragState.isValid = true;
      cellElement.appendChild(this.dragState.dragItemEl);

      const shipObj = this.activePlayer.board.getCorrespondingShip(
        this.dragState.dragObject
      );

      this.activePlayer.board.setShip(shipObj, [
        cellElement.dataset.coordinate,
      ]);

      console.log("DROP SUCCESS", this.activePlayer.board.occupied);
    } else {
      console.log("INVALIDCOOR");
      this.dragState.isValid = false;
    }
  }

  gridDragDropEventListener() {
    const arena = this.root.querySelector("#arena");
    arena.addEventListener("drop", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDrop(e);
      }
    });

    arena.addEventListener("dragleave", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDragLeave(e);
      }
    });

    arena.addEventListener("dragover", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDragover(e);
      }
    });

    arena.addEventListener("dragenter", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDragEnter(e.target);
      }
    });
  }

  // #reset the cluster
  resetTheShipClusterForAppending(shipObj) {
    const table = this.root.querySelector(`table#${this.activePlayer.name}`);

    const cluster = shipObj.cluster;
    // this LOOP only reset the CLUSTER
    for (let i = 0; i < cluster.length; ++i) {
      const cell = this.activePlayer.board.gridMap.get(cluster[i]);

      cell.reset();
      this.activePlayer.board.occupied =
        this.activePlayer.board.getOccupiedCells();
    }
    // this resets the buffer hopefully? maybe
    console.log("buffercluster", isBufferCluster(cluster));
    this.activePlayer.board.resetShipClusterAdjacentList(
      isBufferCluster(cluster)
    );

    for (const i of isBufferCluster(cluster)) {
      const cell = this.activePlayer.board.gridMap.get(i);
      console.log("check on cell status", cell);
    }
  }

  onShipDragStart(ship, activePlayer) {
    // this.dragState.isValid = true;
    if (ship.dataset.captain !== this.activePlayer.name) return;

    const shipObj = activePlayer.board.getCorrespondingShip({
      size: ship.dataset.size,
      index: ship.dataset.index,
    });
    this.dragState.dragObject = shipObj;
    this.dragState.dragItemEl = ship;
    this.dragState.dragItemPreviousCluster = shipObj.cluster;
    this.resetTheShipClusterForAppending(shipObj);

    shipObj.reset();
  }

  onShipDragging(ship) {
    // console.log("Dragging", ship);
  }

  //#drageend
  onShipDragEnd() {
    if (!this.dragState.isValid) {
      const shipObj = this.activePlayer.board.getCorrespondingShip(
        this.dragState.dragObject
      );
      console.log(
        "THIS should not be undefined",

        this.dragState.dragItemPreviousCluster
      );
      this.activePlayer.board.setShip(
        shipObj,
        this.dragState.dragItemPreviousCluster
      );
      console.log("dragend herebitch", this.dragState.dragObject);
    }
  }

  #shipDrag;
  shipDragEventListener() {
    const arena = this.root.querySelector("#arena");
    arena.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("ship")) {
        this.onShipDragStart(e.target, this.activePlayer);
      }
    });

    arena.addEventListener("drag", (e) => {
      if (e.target.classList.contains("ship")) {
        this.onShipDragging(e.target);
      }
    });

    arena.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("ship")) {
        this.onShipDragEnd(e.target);
      }
    });
  }

  // this only applies on playerOne not computerAI
  appendShipElementToGridEl() {
    const board = this.playerOne.board;
    const table = this.root.querySelector(`table#${this.playerOne.name}`);

    //remove old ships
    table.querySelectorAll(".ship").forEach((ship) => ship.remove());
    this.playerOne.setShipRandomly();

    for (let i = 0; i < board.shipList.length; ++i) {
      const shipObj = board.shipList[i];
      const shipElement = UI.createShipElement(shipObj, board.name);
      const zeroIndexCoor = shipObj.cluster[0]; // this is the grid we're appending the shipElement to
      const cellEl = table.querySelector(
        `.grid[data-coordinate="${zeroIndexCoor}"]`
      );
      cellEl.appendChild(shipElement);
    }
    // this.shipDragEventListener();
  }

  playerToReceiveAttack(current) {
    return current.name === "You" ? this.playerTwo : this.playerOne;
  }

  showOccupiedGrid({ name, board }) {
    // console.log("SHOW", board.occupied);
    const table = this.root.querySelector(`table#${name}`);
    UI.clearTable(table);
    for (let i = 0; i < board.occupied.length; ++i) {
      const cell = table.querySelector(
        `.grid[data-coordinate='${board.occupied[i]}']`
      );
      UI.occupiedGridHl(cell);
    }
  }

  checkForWin(isPlayerToBeAttackedDefeated, playerToBeAttname) {
    let message;
    if (isPlayerToBeAttackedDefeated) {
      this.controller.isGameOver = true;
      message =
        playerToBeAttname == "You"
          ? "You Lose! :("
          : `Congratulations! You Win!`;
      UI.updateInfor(this.root, message);
      UI.showRematchModal(this.root);
    }
  }

  checkForShipSinking(ship, table) {
    if (!ship.isSunk()) return;
    const coordinateBuffer = isBufferCluster(ship.cluster);
    UI.showBuffer(coordinateBuffer, table);
  }

  attack(coor, playerToBeAttacked, table) {
    const cell = playerToBeAttacked.board.gridMap.get(coor);
    if (cell.isAttacked) return;

    playerToBeAttacked.board.receiveAttack(coor);

    if (cell.isOccupied) {
      const ship = cell.shipData;
      this.controller.comboCount++;
      UI.updateInfor(
        this.root,
        `${this.activePlayer.name} hit ${playerToBeAttacked.name} ${this.controller.comboCount}X straight! `
      );
      UI.hitCellHl(coor, table, cell.getAdjacentCorner());

      this.checkForShipSinking(ship, table);
      // check if the playerTobeAttacked.fleetisDefeated
      this.checkForWin(
        playerToBeAttacked.board.isFleetDefeated(),
        playerToBeAttacked.name
      );
    } else {
      UI.updateInfor(this.root, `${this.activePlayer.name} missed!`);
      this.controller.comboCount = 0;
      UI.missCellHl(coor, table);
      this.activePlayer = playerToBeAttacked;
    }
  }

  onGridClick(cell, activePlayer) {
    if (
      !this.controller.isReady ||
      activePlayer.name === cell.closest("table").id ||
      this.controller.isGameOver ||
      cell.classList.contains("revealed")
    )
      return;
    const nextPlayer = this.playerToReceiveAttack(this.activePlayer);

    this.attack(cell.dataset.coordinate, nextPlayer, cell.closest("table"));
  }

  onGridListener() {
    this.root.addEventListener("click", (e) => {
      // if (!e.target.classList.contains("grid")) return;
      if (e.target.classList.contains("grid")) {
        const target = e.target;
        this.onGridClick(target, this.activePlayer);
      }
    });
  }

  onResetClick() {
    if (this.controller.isResetMode) return;
    //prevents multiple fleetBox creation
    this.controller.isResetMode = true;

    //clears the default fleet position and renders a clean arena
    this.activePlayer.board.reset();
    // this.showOccupiedGrid(this.activePlayer);

    const arena = this.root.querySelector("#arena");

    const fleetBox = UI.showFleetBox(
      this.playerOne.board,
      UI.createShipElement,
      this.activePlayer.name
    );

    UI.updateInfor(this.root, `Setting ship...`);

    this.root.querySelector(".rightSide").classList.add("hidden");
    this.root.querySelector(".linkGrp").classList.add("hidden");

    const lArena = this.root.querySelector(".leftSide");
    lArena.querySelectorAll(".ship").forEach((shipEl) => shipEl.remove());

    arena.insertBefore(fleetBox, lArena);
  }

  setBufferClasslist({ shipList, name }) {
    for (let i = 0; i < shipList.length; ++i) {
      UI.bufferGridHl(this.root, isBufferCluster(shipList[i].cluster), name);
    }
  }

  onRandomClick() {
    UI.updateInfor(this.root, `Ship ramdomized!`);
    this.appendShipElementToGridEl();

    // looping through the board.shiplist to get the ship.cluster so appopriate grid buffer
    this.setBufferClasslist(this.playerOne.board);
  }

  onChooseClick() {
    // console.log("CHOOSE");
  }

  isFleetReady(shipList) {
    return shipList.some((ship) => ship.isSet);
  }

  onReadyClick() {
    this.playerTwo.setShipRandomly();
    this.showOccupiedGrid(this.playerOne);
    this.showOccupiedGrid(this.playerTwo);
    this.setBufferClasslist(this.playerTwo.board);
    if (
      !this.isFleetReady(this.playerOne.board.shipList) ||
      !this.isFleetReady(this.playerTwo.board.shipList)
    ) {
      UI.updateInfor(this.root, `Finish setting up your fleet first`);
    } else {
      UI.updateInfor(this.root, `${this.activePlayer.name} go first`);
      this.controller.isReady = true;
      this.controller.isResetMode = false;
      const rArena = this.root.querySelector(".rArena");

      rArena.classList.toggle("blur");

      this.root.querySelectorAll(".linkGrp").forEach((element) => {
        element.classList.toggle("hidden");
      });
    }
  }

  onRematchClick() {
    // console.log("Implement rematch");
    this.refresh();

    this.root.querySelector(".rematchModal").close();
    this.root.querySelectorAll(".linkGrp").forEach((element) => {
      element.classList.toggle("hidden");
    });
  }

  onLinkListener() {
    this.root.addEventListener("click", (e) => {
      if (e.target.classList.contains("resetBtn")) {
        this.onResetClick();
      }
      if (e.target.classList.contains("randomBtn")) {
        this.onRandomClick();
      }
      if (e.target.classList.contains("readyBtn")) {
        this.onReadyClick();
      }
      if (e.target.classList.contains("chooseBtn")) {
        this.onChooseClick();
      }
      if (e.target.classList.contains("rematchBtn")) {
        this.onRematchClick();
      }
    });
  }

  displayArena() {
    const lArena = this.root.querySelector(".lArena");
    const rArena = this.root.querySelector(".rArena");
    lArena.textContent = "";
    rArena.textContent = "";
    lArena.appendChild(UI.createGridBox(this.playerOne));
    rArena.appendChild(UI.createGridBox(this.playerTwo));
    rArena.classList.add("blur");
    UI.updateInfor(this.root, "Prepare Your Fleet");
  }

  initHTML() {
    return `
      <p class="info">Prepare Your Fleet</p>
      <dialog class="rematchModal">
      <button class="rematchBtn">Play Again</dialog>
      </dialog>
      <dialog class="chooseModal">
        <form>
          <p>Choose opponent</p>
          <button id="chooseComputer">Player</button>
          <button id="choosePlayer">Computer</button>
        </form>
      </dialog>
      <section id="arena">
        <div class="leftSide">
          <div class="leftMini"></div>
          <div class="lArena"></div>
          <div class="linkGrp">
            <a class="randomBtn" href="#">Randomize</a>
            <a class="resetBtn" href="#">Reset</a>
          </div>
        </div>
        <div class="rightSide">
          <div class="rightMini"></div>
          <div class="rArena"></div>
          <div class="linkGrp">
            <a class="readyBtn" href="#">Ready</a>
            <a class="chooseBtn" href="#">Choose Opponent</a>
          </div>
        </div>
      </section>

   `;
  }
}

(function init() {
  const entry = document.querySelector("#entry");
  const app = new App(entry);
  // console.log(app.playerOne);
})();
