import { Player, Computer } from "./classes/player.js";
import {
  calculatePossibleCluster,
  generateGridArray,
  getCoorAdjacentCorner,
  getCoorAdjacentList,
  isBufferCluster,
  isCellClearForOccupation,
  showNewCluster,
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
      dragoverCluster: undefined,
      dragItemPreviousOrientation: undefined,
    };

    this.activePlayer = undefined;

    this.root.insertAdjacentHTML("afterbegin", this.initHTML());
    this.refresh();

    this.onGridListener();
    this.onLinkListener();
    this.onShipClickListener();
    this.dragEventListener();
    this.dropEventListener();
    this.onGodMode();
  }

  refresh() {
    this.playerOne.board.reset();

    this.activePlayer = this.playerOne;

    this.controller.isReady = false;
    this.controller.isResetMode = false;
    this.controller.comboCount = 0;
    this.controller.isGameOver = false;

    this.playerTwo = new Computer({});
    this.playerTwo.board.reset();
    this.displayArena();
    // randomly append ship
    this.appendShipElementToGridEl();
  }

  setShipOnDrop(ship, cluster, activePlayer, shipEl) {
    const table = this.root.querySelector(`table#${activePlayer.name}`);
    const cellElement = table.querySelector(
      `.grid[data-coordinate='${cluster[0]}']`
    );

    activePlayer.board.setShip(ship, cluster);
    cellElement.appendChild(shipEl);

    // UI.bufferGridHl(this.root, activePlayer.board.buffers, activePlayer.name);
    // UI.showOccupiedGrid(this.root, activePlayer);
  }

  #dragleave;
  dragleave(gridEl) {
    console.log(this.dragState.dragoverCluster);
    UI.removeGridHL(
      this.dragState.dragoverCluster,
      "dragover",
      this.root.querySelector(`table#${this.activePlayer.name}`)
    );
    UI.removeGridHL(
      this.dragState.dragoverCluster,
      "dragoverred",
      this.root.querySelector(`table#${this.activePlayer.name}`)
    );
  }

  // dragover(gridEl) {

  // }

  dragover(gridEl) {
    const coor = gridEl.dataset.coordinate;
    const coordinates = this.dragState.dragItemPreviousCluster;
    this.dragState.dragObject.orientation =
      this.dragState.dragItemPreviousOrientation;

    const newClusterResult = showNewCluster(
      [coor],
      this.dragState.dragObject,
      this.activePlayer.board
    );
    if (newClusterResult.result) {
      UI.dragoverHl(
        newClusterResult.newCluster,
        this.root.querySelector(`table#${this.activePlayer.name}`)
      );
      this.dragState.dragoverCluster = newClusterResult.newCluster;
      this.dragState.isValid = true;
      // console.log("DS VLIAD", this.dragState.isValid);
    } else {
      UI.dragoverHl(
        coordinates,
        this.root.querySelector(`table#${this.activePlayer.name}`)
      );
      this.dragState.dragoverCluster = coordinates;

      this.dragState.isValid = false;
    }

    // console.log(`You are dragging over in ${coor}`);
  }

  drop(gridEl) {
    console.log("ONDROP", this.dragState.isValid);
    if (!this.dragState.isValid) return;
    console.log("DROPPEd");
    const coor = gridEl.dataset.coordinate;
    const cell = this.activePlayer.board.gridMap.get(coor);

    if (!cell.isOccupied && !cell.isBuffer()) {
      this.dragState.isValid = true;

      this.setShipOnDrop(
        this.dragState.dragObject,
        this.dragState.dragoverCluster,
        this.activePlayer,
        this.dragState.dragItemEl
      );

      UI.removeGridHL(
        this.dragState.dragoverCluster,
        "dragover",
        this.root.querySelector(`table#${this.activePlayer.name}`)
      );
      console.log(
        `Set ${this.dragState.dragObject.size} to ${this.dragState.dragoverCluster}`
      );
      return;
    }
    this.dragState.isValid = false;
    // console.log(`You dropped ${shipObj} in ${coor}`);
  }

  #drop;
  dropEventListener() {
    this.root.addEventListener("drop", (e) => {
      if (
        e.target.classList.contains("grid") &&
        e.target.closest("table").id === this.activePlayer.name
      ) {
        this.drop(e.target);
      }
    });

    this.root.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (
        e.target.classList.contains("grid") &&
        e.target.closest("table").id === this.activePlayer.name
      ) {
        this.dragover(e.target);
      } else {
        this.dragState.isValid = false;
      }
    });

    this.root.addEventListener("dragleave", (e) => {
      if (
        e.target.classList.contains("grid") &&
        e.target.closest("table").id === this.activePlayer.name
      ) {
        this.dragleave(e.target);
      } else {
        this.dragState.isValid = false;
      }
    });
  }

  dragStart(ship) {
    this.dragState.isValid = false;
    this.dragState.dragItemEl = ship;
    UI.hideShipOnDragStart(ship);

    const shipObj = this.activePlayer.board.getCorrespondingShip({
      index: this.dragState.dragItemEl.dataset.index,
      size: this.dragState.dragItemEl.dataset.size,
    });

    this.dragState.dragItemPreviousCluster = shipObj.cluster;
    this.dragState.dragItemPreviousOrientation = shipObj.orientation;
    this.dragState.dragObject = shipObj;

    this.activePlayer.board.resetClusterOnShipOrientationChange(
      shipObj.cluster
    );

    shipObj.reset();
    // UI.bufferGridHl(
    //   this.root,
    //   this.activePlayer.board.buffers,
    //   this.activePlayer.name
    // );

    // UI.showOccupiedGrid(this.root, this.activePlayer);
  }

  dragEnd(ship) {
    console.log("dragend", this.dragState.isValid);
    if (!this.dragState.isValid) {
      this.setShipOnDrop(
        this.dragState.dragObject,
        this.dragState.dragItemPreviousCluster,
        this.activePlayer,
        this.dragState.dragItemEl
      );
    }

    UI.removeGridHL(
      this.dragState.dragItemPreviousCluster,
      "dragover",
      this.root.querySelector(`table#${this.activePlayer.name}`)
    );
    UI.showShipOnDragEnd(ship);
  }

  #drag;
  dragEventListener() {
    this.root.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("ship")) {
        this.dragStart(e.target);
      }
    });
    this.root.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("ship")) {
        this.dragEnd(e.target);
      }
    });
  }

  #orientation;
  changeShipOrientation(ship) {
    const shipObj = this.activePlayer.board.getCorrespondingShip({
      index: ship.dataset.index,
      size: ship.dataset.size,
    });
    const shipObjClusterCopy = shipObj.cluster;
    // get the opposite orientation cluster
    this.activePlayer.board.resetClusterOnShipOrientationChange(
      shipObj.cluster
    );
    const newCluster = calculatePossibleCluster(
      shipObj.cluster,
      shipObj,
      this.activePlayer.board
    );
    // console.log("possible cluster", newCluster.cluster);

    shipObj.reset();
    shipObj.orientation = newCluster.orientation;
    this.activePlayer.board.setShip(shipObj, newCluster.cluster);

    // UI.changeShipOrientation(ship);
    const printRedShip = newCluster.cluster === shipObjClusterCopy;
    UI.changeShipOrientation(
      this.root,
      newCluster.cluster[0],
      ship,
      shipObj.orientation,
      this.activePlayer.name,
      printRedShip
    );
    // UI.showOccupiedGrid(this.root, this.activePlayer);
    // UI.bufferGridHl(
    //   this.root,
    //   this.activePlayer.board.buffers,
    //   this.activePlayer.name
    // );
    // console.log("this is the cluster we gonna go to", pcluster);
    // shipObj.reset();
  }

  #shipClickListener;
  onShipClickListener() {
    this.root.addEventListener("click", (e) => {
      if (e.target.classList.contains("ship")) {
        console.log("SHIP CLIECK");
        this.changeShipOrientation(e.target);
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
    // UI.showOccupiedGrid(this.root, this.playerOne);
    // UI.bufferGridHl(
    //   this.root,
    //   this.playerOne.board.buffers,
    //   this.playerOne.name
    // );
    // UI.setBufferClasslist(this.root, this.playerOne.board);
  }

  playerToReceiveAttack(current) {
    return current.name === "You" ? this.playerTwo : this.playerOne;
  }

  checkForWin(isPlayerToBeAttackedDefeated, playerToBeAttname) {
    if (!isPlayerToBeAttackedDefeated) return;

    this.controller.isGameOver = true;

    const winner = playerToBeAttname === "Computer" ? "You" : "Computer";
    const isComputerWinner = winner === "Computer";

    const message = isComputerWinner
      ? "You Lose! :("
      : "Congratulations! You Win!";
    UI.updateInfor(this.root, message);

    UI.showRematchModal(
      this.root,
      isComputerWinner ? "loser" : "winner",
      message
    );

    UI.addBlurTable(this.root, this.playerOne.name, true);
    UI.addBlurTable(this.root, this.playerTwo.name, true);
  }

  checkForShipSinking(ship, table) {
    if (!ship.isSunk()) return;
    const coordinateBuffer = isBufferCluster(ship.cluster);
    UI.showBuffer(coordinateBuffer, table);
    UI.shipSunk(ship.cluster, table);
    if (
      table.querySelector(
        `.ship[data-index="${ship.index}"][data-size="${ship.size}"]`
      )
    ) {
      const shipElement = table.querySelector(
        `.ship[data-index="${ship.index}"][data-size="${ship.size}"]`
      );
      shipElement.remove();
    }
    return coordinateBuffer;
  }

  //#attack
  attack(coor, playerToBeAttacked, table) {
    const cell = playerToBeAttacked.board.gridMap.get(coor);
    if (cell.isAttacked && this.controller.isGameOver) return;

    const isAttackAHit = playerToBeAttacked.board.receiveAttack(coor);

    if (isAttackAHit && this.activePlayer instanceof Computer) {
      this.activePlayer.removeHitShipCorner(cell.getAdjacentCorner());

      const nextPlayer = this.playerToReceiveAttack(this.activePlayer);
      setTimeout(() => {
        this.attack(
          this.activePlayer.attackRandomly(),
          nextPlayer,
          this.root.querySelector(`table#${nextPlayer.name}`)
        );
        UI.addBlurTable(this.root, this.activePlayer.name);
      }, 800);
    }
    UI.addBlurTable(this.root, this.activePlayer.name);
    if (cell.isOccupied) {
      const ship = cell.shipData;
      this.controller.comboCount++;
      UI.updateInfor(
        this.root,
        `${this.activePlayer.name} hit ${playerToBeAttacked.name} ${this.controller.comboCount}X straight! `
      );
      UI.hitCellHl(coor, table, cell.getAdjacentCorner());

      const clusterOfSunkenShip = this.checkForShipSinking(ship, table);
      if (this.activePlayer instanceof Computer) {
        this.activePlayer.removeSunkenCluster(clusterOfSunkenShip);
      }

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

      if (this.activePlayer instanceof Computer) {
        const nextPlayer = this.playerToReceiveAttack(this.activePlayer);
        setTimeout(() => {
          this.attack(
            this.activePlayer.attackRandomly(),
            nextPlayer,
            this.root.querySelector(`table#${nextPlayer.name}`)
          );
          UI.addBlurTable(this.root, this.activePlayer.name);
        }, 800);
      }
      UI.addBlurTable(this.root, this.activePlayer.name);
    }
  }

  onGridClick(cell, activePlayer) {
    if (
      !this.controller.isReady ||
      activePlayer.name === cell.closest("table").id ||
      this.controller.isGameOver ||
      cell.classList.contains("revealed") ||
      cell.classList.contains("miss")
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
    this.controller.isReady = false;
    this.controller.isResetMode = true;

    //clears the default fleet position and renders a clean arena
    this.playerOne.board.reset();
    if (this.playerTwo instanceof Computer) {
      this.activePlayer = this.playerOne;
    }

    const arena = this.root.querySelector("#arena");

    const fleetBox = UI.showFleetBox(
      this.playerOne.board,
      UI.createShipElement,
      this.playerOne.name
    );

    UI.updateInfor(this.root, `Setting ship...`);
    // UI.removeGridHL(
    //   generateGridArray(10),
    //   "buffer",
    //   this.root.querySelector(`table#${this.playerOne.name}`)
    // );
    // UI.removeGridHL(
    //   generateGridArray(10),
    //   "occupied",
    //   this.root.querySelector(`table#${this.playerOne.name}`)
    // );

    this.root.querySelector(".rightSide").classList.add("hidden");
    this.root.querySelector(".linkGrp").classList.add("hidden");

    const lArena = this.root.querySelector(".leftSide");
    lArena.querySelectorAll(".ship").forEach((shipEl) => shipEl.remove());

    arena.insertBefore(fleetBox, lArena);
    // this.shipDragEventListener(this.activePlayer);
    // this.gridDragDropEventListener();
  }

  onRandomClick() {
    UI.updateInfor(this.root, `Ship ramdomized!`);
    this.appendShipElementToGridEl();

    UI.removeGridHL(
      generateGridArray(10),
      "occupied",
      this.root.querySelector(`table#${this.activePlayer.name}`)
    );

    // looping through the board.shiplist to get the ship.cluster so appopriate grid buffer
    // this.setBufferClasslist(this.playerOne.board);
  }

  onChooseClick() {}

  isFleetReady(shipList) {
    return shipList.some((ship) => ship.isSet);
  }

  onReadyClick() {
    this.playerTwo.setShipRandomly();
    UI.addBlurTable(this.root, this.activePlayer.name);
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

      this.dragState.isValid = true;
      this.dragState.dragItemEl = undefined;
      this.dragState.dragObject = undefined;
      this.dragState.dragItemPreviousCluster = undefined;
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

  onGodMode() {
    const header = document.querySelector("header");
    header.addEventListener("click", (e) => {
      UI.showOccupiedGrid(this.root, this.playerTwo);
      setTimeout(() => {
        UI.removeGridHL(
          generateGridArray(10),
          "occupied",
          this.root.querySelector(`table#${this.playerTwo.name}`)
        );
      }, 500);
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
      <span class="rematchModalSpan"></span>
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
