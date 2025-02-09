import { Player, Computer } from "./classes/player.js";
import { generateGridArray } from "./utils/fn.js";
import UI from "./ui/ui.js";

class App {
  constructor(root) {
    this.root = root;

    this.playerOne = new Player({ name: "You" });
    this.playerTwo = new Computer({});
    this.controller = {
      isReady: false,
      isResetMode: false,
    };
    this.activePlayer = undefined;

    this.refresh();
    this.root.insertAdjacentHTML("afterbegin", this.initHTML());
    this.displayArena();
    this.onLinkListener();
    this.onGridListener();
  }
  refresh() {
    this.activePlayer = this.playerOne;
    this.controller.isReady = false;
    this.controller.isResetMode = false;
  }

  onGridClick(cell, activePlayer) {
    // if (
    //   !this.controller.isReady &&
    //   activePlayer.name !== cell.closest("table").id
    // )
    //   return;
    // const coor = cell.dataset.coordinate;
    // const gridCell = activePlayer.board.gridMap.get(coor);
    // activePlayer.board.receiveAttack(coor);
    // console.log(gridCell);
    // console.log(activePlayer);
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

    const arena = this.root.querySelector("#arena");

    const fleetBox = UI.showFleetBox(
      this.playerOne.board,
      UI.createShipElement
    );

    this.root.querySelector(".rightSide").classList.add("hidden");

    arena.insertBefore(fleetBox, this.root.querySelector(".leftSide"));
  }

  onRandomClick() {
    console.log("RANDOM");
  }

  onChooseClick() {
    console.log("CHOOSE");
  }

  onReadyClick() {
    console.log("READY");
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
    });
  }

  displayArena() {
    const lArena = this.root.querySelector(".lArena");
    const rArena = this.root.querySelector(".rArena");
    lArena.appendChild(UI.createGridBox(this.playerOne));
    rArena.appendChild(UI.createGridBox(this.playerTwo));
    rArena.classList.add("blur");
  }

  initHTML() {
    return `
      <p class="info">Prepare Your Fleet</p>
      <dialog>
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
