import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game--board");

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
	window.addEventListener("keydown", handleInput, {once: true});
}

function handleInput(event) {
	switch (event.key) {
    case "ArrowUp":
			moveUp();
      break;
    case "ArrowDown":
			moveDown();
      break;
    case "ArrowLeft":
			moveLeft();
      break;
    case "ArrowRight":
      break;
		default:
			setupInputOnce();
			return;
  }

	setupInputOnce();
}

function moveUp() {
	slideTiles(grid.cellsGroupedByColumn);
}

function moveDown() {
	slideTiles(grid.cellsGroupedByReversedColumn);
}

function moveLeft() {
	slideTiles(grid.cellsGroupedByRow);
}

function slideTiles(groupedCells) {
	groupedCells.forEach(groupe => slideTilesInGroupe(groupe));

	grid.cells.forEach(cell => {
		cell.hasTileForMerge() && cell.mergeTiles();
	});
}

function slideTilesInGroupe(groupe) {
	for (let i =1; i < groupe.length; i++) {
		if (groupe[i].isEmpty()) {
			continue;
		}

		const cellWithTile = groupe[i];

		let targetCell;
		let j = i - 1;
		while(j>=0 && groupe[j].canAccept(cellWithTile.linkedTile)) {
			targetCell = groupe[j];
			j--;
		}

		if (!targetCell) {
			continue;
		}

		if (targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile);
		} else {
			targetCell.linkTileForMerge(cellWithTile.linkedTile);
		}

		cellWithTile.unLinkTile();
	}
}