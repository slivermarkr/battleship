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

<!-- - when a ship is first dragg. get the ship.cluster and reset it so I can append into the corresponding grid
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

TOFIX: the isBuffer from board.js and main.js aren't in sync they tell difference isBuffer status and and bufferCount -->

<!-- TODO: about the drag event -->
<!-- TODO: -->

<!-- - a function to be used when draggina and dropping ship with size > 1.
- takes in the ships data and predict the next coordinates to be used -->

<!-- - use the calcalatePossibleCluster to determine if the elements being dragover is iccupied or buffer -->
  <!-- TODO: on resetClick -->
  <!-- - reset the board.api not just the ui -->

<!-- TODO:

- when big ships and drag. I can't drop on the cell next to it.
- maybe change the ships z-index -->

<!-- - implement draggin and dropping -->

<!-- TODO: change ship orientation on click -->

TODO: add some UI

- dialog when choosing opponent

<!-- - add some indicator for when the coor is not valid -->

TODO: create a better algorithm to set ship randomly

- there are times that the program goes into stackoveflow

<!-- - remove the ship z-index so grids are clickable
- add some style depending wether it's a hit or a miss -->

<!-- TODO: -->

<!-- - allow computer to hit random grid -->

- make algorithm that allows computer to pick adjacent cell if it hits a ship.

# this shit is major problem

## just refactor the whole drag, drop and change orientation thing

- the the game is over and rematch button is click the dragevents aren't doing it's thing.

- when the ship is sunk remove the ship

- the computer random attacks slow the pc down for some reason

- 02-14
- attemp#1
- it seems like when the after round the listener is not doing it's supposed to do. at some part doesn't
- it's not resetting the cluster for appending

- it's seems like the reset is actualy not working after one game

- also the changeOrientation onClick function is not working after one game

- consider to just overhaul the resetfuntion

<!-- # BUG on changeOrientation

- maybe create a separate checkMethod onClick
- when you click on a ship and it's possibleCluster if a buffer. it decrements the bufferCount so when the ship is clicked multiple times is sees the cell as valid. -->

# ON Refactor branch

<!-- - implement the change orientation -->

- find other ways to reset the buffer depending on the the event

# Found the Bug

- so what happned was the the evenlister doubled up so when i rotate and drag the event cancels out
- maybe just remove the evenlistner before calling listner function.

# TODO

- create a default fleet position on the and scrap the random on first display.

# TODO

<!-- - find a way how to produce a dragover cluster. -->
<!-- - this will make the removal of classList lighter because we don't need to loop x100 to remove dragover and dragoverred hgihlight. -->
<!-- - maybe idk. -->

- fix logic if using drag ship out of bound make it so that it goes to the closest valid cell.

# Bug

- when a ship in sunk the buffer if not showoing
