import { Player, Computer } from "./classes/player.js";
import {
  calculatePossibleCluster,
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
    // this.showOccupiedGrid(this.playerOne);
    this.shipDragEventListener(this.playerOne.name);
    this.gridDragDropEventListener();
    this.onClickListener();
  }

  checkForCollisionOnChangeOrientation(shipEl) {
    const shipObj = this.activePlayer.board.getCorrespondingShip({
      size: shipEl.dataset.size,
      index: shipEl.dataset.index,
    });

    const orientation = shipEl.dataset.orientation;

    let newOrientation;
    let result;
    // reset the shipObj cluster
    this.resetTheShipClusterForAppending(shipObj);

    if (orientation == "h") {
      newOrientation = "v";
      result = calculatePossibleCluster(
        shipObj.cluster[0],
        { size: shipObj.size, orientation: "v" },
        this.activePlayer.board
      );
    } else if (orientation == "v") {
      newOrientation = "h";
      result = calculatePossibleCluster(
        shipObj.cluster[0],
        { size: shipObj.size, orientation: "h" },
        this.activePlayer.board
      );
    }

    return {
      isValid: this.checkIfClusterIsValid(result),
      newOrientation,
      newCluster: result,
    };
  }

  onClickListener() {
    const arena = this.root.querySelector("#arena");
    arena.addEventListener("click", (e) => {
      if (e.target.classList.contains("ship")) {
        if (this.controller.isReady) return;
        const shipEl = e.target;
        const shipObj = this.activePlayer.board.getCorrespondingShip({
          size: shipEl.dataset.size,
          index: shipEl.dataset.index,
        });

        if (
          shipEl.dataset.captain !== this.activePlayer.name &&
          shipEl.parentElement.classList.contains("fleetSetupDiv")
        )
          return;

        const changeOrientationResult =
          this.checkForCollisionOnChangeOrientation(shipEl);
        //isValidChangeOrientation
        if (changeOrientationResult.isValid) {
          const table = this.root.querySelector(
            `table#${this.activePlayer.name}`
          );
          shipObj.reset();
          shipObj.orientation = changeOrientationResult.newOrientation;
          this.activePlayer.board.setShip(
            shipObj,
            changeOrientationResult.newCluster
          );

          table
            .querySelector(
              `.grid[data-coordinate='${changeOrientationResult.newCluster[0]}']`
            )
            .appendChild(shipEl);
          UI.changeShipOrientation(shipEl);
          UI.updateInfor(this.root, "Ship rotated.");
          // console.log(this.activePlayer.board.occupied);
        } else {
          console.log("COLLISION");
        }
      }
    });
  }

  gridDragEnter(gridEl) {
    const isValid = isCellClearForOccupation(
      gridEl.dataset.coordinate,
      this.activePlayer.board
    );
    if (gridEl.closest("table").id !== this.activePlayer.name || !isValid) {
      return;
    }
  }

  gridDragover(e) {
    e.preventDefault();

    if (e.target.closest("table").id !== this.activePlayer.name) return;
    // e.target.classList.add("dragover");

    const table = e.target.closest("table");

    const res = calculatePossibleCluster(
      e.target.dataset.coordinate,
      {
        size: this.dragState.dragItemEl.dataset.size,
        orientation: this.dragState.dragItemEl.dataset.orientation,
      },
      this.activePlayer.board
    );
    const checkCluster = this.checkIfClusterIsValid(res);
    if (checkCluster) {
      UI.dragoverHl(res, table);
    } else {
      UI.dragoverHlRed(res, table);
      UI.updateInfor(this.root, "can't place ship in a buffer");
    }
  }

  gridDragLeave(e) {
    const table = e.target.closest("table");

    const res = calculatePossibleCluster(
      e.target.dataset.coordinate,
      {
        size: this.dragState.dragItemEl.dataset.size,
        orientation: this.dragState.dragItemEl.dataset.orientation,
      },
      this.activePlayer.board
    );

    UI.removeGridHL(res, "dragover", table);
    UI.removeGridHL(res, "dragoverred", table);
  }

  checkIfClusterIsValid(cluster) {
    let isCellValid = true;
    for (let i = 0; i < cluster.length; ++i) {
      if (isCellClearForOccupation(cluster[i], this.activePlayer.board)) {
        isCellValid = true;
      } else {
        return false;
      }
    }

    return isCellValid;
    // return cluster.some(cell => isCellClearForOccupation(cell))
  }

  //#dropevent
  gridDrop(e) {
    e.target.classList.remove("dragover");
    const table = e.target.closest("table");

    // i added this for when the drop target is undefined since the ship.object is resetted when dragStart I want to load the save cluster back to i can append/set to the previous cluster
    // i don't know if it's actually working lol
    if (table.id !== this.dragState.dragItemEl.dataset.captain) {
      this.dragState.isValid = false;
      this.dragState.dragObject.cluster =
        this.dragState.dragItemPreviousCluster;
      return;
    }

    const cellElement = e.target;
    const isValidCoor = isCellClearForOccupation(
      cellElement.dataset.coordinate,
      this.activePlayer.board
    );

    const cluster = calculatePossibleCluster(
      e.target.dataset.coordinate,
      {
        orientation: this.dragState.dragItemEl.dataset.orientation,
        size: this.dragState.dragItemEl.dataset.size,
      },
      this.activePlayer.board
    );

    const clusterCheck = this.checkIfClusterIsValid(
      cluster,
      this.activePlayer.board
    );

    UI.removeGridHL(cluster, "dragover", table);
    UI.removeGridHL(cluster, "dragoverred", table);
    if (isValidCoor && clusterCheck) {
      this.dragState.isValid = true;
      // cellElement.appendChild(this.dragState.dragItemEl);
      // appencd the ship the the first index of the cluster

      table
        .querySelector(`.grid[data-coordinate="${cluster[0]}"]`)
        .appendChild(this.dragState.dragItemEl);

      const shipObj = this.activePlayer.board.getCorrespondingShip(
        this.dragState.dragObject
      );

      this.activePlayer.board.setShip(shipObj, cluster);
      UI.updateInfor(this.root, "Ship Placed Succesfully.");
    } else {
      this.dragState.isValid = false;
      this.dragState.dragObject.cluster =
        this.dragState.dragItemPreviousCluster;
    }
  }

  gridDragDropEventListener() {
    const arena = this.root.querySelector("#arena");
    arena.addEventListener("drop", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDrop(e);
      } else {
        this.dragState.isValid = false;
      }
    });

    arena.addEventListener("dragleave", (e) => {
      if (e.target.classList.contains("grid")) {
        this.gridDragLeave(e);
      } else {
        this.dragState.isValid = false;
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
    // const table = this.root.querySelector(`table#${this.activePlayer.name}`);
    const cluster = shipObj.cluster || this.dragState.dragObject.cluster;

    // this LOOP only reset the CLUSTER
    for (let i = 0; i < cluster.length; ++i) {
      const cell = this.activePlayer.board.gridMap.get(cluster[i]);

      cell.reset();
      this.activePlayer.board.occupied =
        this.activePlayer.board.getOccupiedCells();
    }
    // this resets the buffer hopefully? maybe
    this.activePlayer.board.resetShipClusterAdjacentList(
      isBufferCluster(cluster)
    );

    // for (const i of isBufferCluster(cluster)) {
    //   const cell = this.activePlayer.board.gridMap.get(i);
    // }
  }

  onShipDragStart(ship, activePlayer) {
    // this.dragState.isValid = true;
    if (ship.dataset.captain !== this.activePlayer.name) return;

    ship.classList.add("invi");
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

  onShipDragging(ship) {}

  //#drageend
  onShipDragEnd(ship) {
    ship.classList.remove("invi");
    ship.classList.remove("hidden");
    if (!this.dragState.isValid) {
      const shipObj = this.activePlayer.board.getCorrespondingShip(
        this.dragState.dragObject
      );
      this.activePlayer.board.setShip(
        shipObj,
        this.dragState.dragItemPreviousCluster
      );
    }
  }

  #shipDrag;
  shipDragEventListener() {
    const arena = this.root.querySelector("#arena");
    arena.addEventListener("dragstart", (e) => {
      if (this.controller.isReady) {
        e.preventDefault();
        return;
      }
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

        if (
          this.controller.isResetMode &&
          this.activePlayer.board.isFleetAllSet()
        ) {
          UI.showTheRightSideArenaWhenShipAllSet(this.root);
          this.controller.isResetMode = false;
        }
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
    UI.shipSunk(ship.cluster, table);
  }

  attack(coor, playerToBeAttacked, table) {
    console.log("HIT here", coor);
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
      this.activePlayer.board,
      UI.createShipElement,
      this.activePlayer.name
    );

    // this.showOccupiedGrid(this.activePlayer);
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

  onChooseClick() {}

  isFleetReady(shipList) {
    return shipList.some((ship) => ship.isSet);
  }

  onReadyClick() {
    this.playerTwo.setShipRandomly();
    // this.showOccupiedGrid(this.playerOne);
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

      // UI.isReadyForBatlle(this.root);
    }
  }

  onRematchClick() {
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
})();
