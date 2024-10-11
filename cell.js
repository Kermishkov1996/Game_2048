export class Cell {
	constructor(gridElement, x, y) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		gridElement.append(cell);
		this.x = x;
		this.y = y;
	}

	linkTile(tile) {
		tile.setXY(this.x, this.y);
		this.linkedTile = tile;
	}

	unLinkTile() {
		this.linkedTile = null;
	}

	isEmpty() {
		return !this.linkedTile;
	}

	linkTileForMerge(tile) {
		tile.setXY(this.x, this.y);
		this.linkedTileForMerge = tile;
	}

	canAccept(newTile) {
		return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);	
	}
}