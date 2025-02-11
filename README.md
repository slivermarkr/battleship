# battleship

done:

<!-- TODO: board.setShip(): when a shipObj is set take each coordinate cell and it's adjacentList and change cell.isBuffer property to TRUE. -->

<!-- TODO: board.setShip(): check if the coordinates being pass in in already in the board.occupied list -->

<!-- TODO: board.initFleet({size index}): create an array of Ships -->

<!-- create a util.obj that will be pass in as params in board.initFleet({size, index}) -->

<!-- TODO: create a PLAYER class -->

<!-- TODO: fix on fn.js: generateRandomCluster() is able to generate random coordinate cluster but I forget about the random orientation implementation -->

<!-- TODO: when a ship is hit reveal some of the buffer -->

<!-- - create shipObjects -->
<!-- - create gridUI -->

<!-- TODO: create a function that take {index, size} as params and returns corresponding ship instances from Gameboard.shipList -->

<!-- TODO: when the game is over show a modal asking if user wants to play again -->

<!-- TODO: setShipElements on load -->

TODO: add some UI

- dialog when choosing opponent

- when the game is over check who wins and dynamically change the dialog to green if user wins and red if lose.

- implement draggin and dropping

TODO: create a better algorithm to set ship randomly

- there are times that the program goes into stackoveflow

TODO: about the drag event

- when a ship is first dragg. get the ship.cluster and reset it so I can append into the corresponding grid

- Able to drag a ship and update the api and dom simultaneously but it only works for ship with size 1.
- I need to make the feature work for other sized ship. (diversity baby)
- find a way to know If the cell is being used by other ship as buffer before resetting it.

- explore the dragenter option. when a ship enter a grid check for the grid ajacenList. if it's occupied do not reset the grid's isBuffer status.

- explore of dragend event

- ondragstart

  - when you drag a shipEl reset the shipObj.reset(),
  - loop through the isBuffer(ship.cluster)
  - if the cell.bufferCount is more than one that means other ship are using that cell as buffer therefore don't reset it.
  - else cell.reset()

- make the drop event in-sync to the board.setShip()

  - when you drop the shipEl on an INVALID coor. since we preemptively reset the ship and the cluster. \*this.shipPreviousCluter stores the cluster so we can setTheShip back to itt's orinal position.

  - when the you successfully setShip in place makes sure the buffer is updated
