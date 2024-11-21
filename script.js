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

async function handleInput(event) {
	switch (event.key) {
    case "ArrowUp":
			if (!canMoveUp()) {
				setupInputOnce();
				return;
			}
			await moveUp();
      break;
    case "ArrowDown":
	    if (!canMoveDown()) {
		    setupInputOnce();
		    return;
	    }
			await moveDown();
      break;
    case "ArrowLeft":
	    if (!canMoveLeft()) {
		    setupInputOnce();
		    return;
	    }
			await moveLeft();
      break;
    case "ArrowRight":
	    if (!canMoveRight()) {
		    setupInputOnce();
		    return;
	    }
			await moveRight();
      break;
		default:
			setupInputOnce();
			return;
  }

	const newTile = new Tile(gameBoard);
	grid.getRandomEmptyCell().linkTile(newTile);

	setupInputOnce();
}

async function moveUp() {
	await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
	await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
	await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
	await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
	const promises = [];

	groupedCells.forEach(groupe => slideTilesInGroupe(groupe, promises));

	await Promise.all(promises);

	grid.cells.forEach(cell => {
		cell.hasTileForMerge() && cell.mergeTiles();
	});
}

function slideTilesInGroupe(groupe, promises) {
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

		promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

		if (targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile);
		} else {
			targetCell.linkTileForMerge(cellWithTile.linkedTile);
		}

		cellWithTile.unLinkTile();
	}
}

function canMoveUp() {
	return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
	return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
	return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
	return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
	return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
	return group.some((cell, index) => {
		if (index === 0) {
			return false;
		}

		if (cell.isEmpty()) {
			return false;
		}

		const targetCell = group[index - 1];
		return targetCell.canAccept(cell.linkedTile);
	});
}