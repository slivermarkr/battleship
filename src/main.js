import { Player, Computer } from "./classes/player.js";
import { isBufferCluster } from "./utils/fn.js";
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
      dragItemEl: undefined,
      dragObject: undefined,
      dropItemEl: undefined,
    };

    this.activePlayer = undefined;

    this.root.insertAdjacentHTML("afterbegin", this.initHTML());
    this.refresh();
    // this.displayArena();

    this.onLinkListener();
    this.onGridListener();

    // randomly append ship
    this.appendShipElementToGridEl();
    this.shipDragEventListener();
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
    // this.onShipListener();
  }

  onShipDragStart(ship, activePlayer) {
    if (ship.dataset.captain !== this.activePlayer.name) return;
    const shipObj = activePlayer.board.getCorrespondingShip({
      size: ship.dataset.size,
      index: ship.dataset.index,
    });
    console.log(shipObj);
  }

  onShipDragging(ship) {
    console.log("Dragging", ship);
  }

  onShipDragEnd(ship) {
    console.log("Dragend ", ship);
  }
  shipDragEventListener() {
    this.root.querySelectorAll(".ship").forEach((ship) => {
      ship.addEventListener("dragstart", (e) => {
        this.onShipDragStart(ship, this.activePlayer);
      });

      ship.addEventListener("drag", (e) => {
        this.onShipDragging(ship);
      });

      ship.addEventListener("dragend", (e) => {
        this.onShipDragEnd(ship);
      });
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
    this.showOccupiedGrid(this.activePlayer);

    const arena = this.root.querySelector("#arena");

    const fleetBox = UI.showFleetBox(
      this.playerOne.board,
      UI.createShipElement
    );
    UI.updateInfor(this.root, `Setting ship...`);

    this.root.querySelector(".rightSide").classList.add("hidden");
    this.root.querySelector(".linkGrp").classList.add("hidden");

    arena.insertBefore(fleetBox, this.root.querySelector(".leftSide"));
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
    console.log("CHOOSE");
  }

  isFleetReady(shipList) {
    return shipList.some((ship) => ship.isSet);
  }

  onReadyClick() {
    this.playerTwo.setShipRandomly();
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
    console.log("Implement rematch");
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
  console.log(app.playerOne);
})();
