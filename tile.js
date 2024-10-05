export class Tile {
	constructor(gridElement) {
		this.tileElement = document.createElement("div");
		this.tileElement.classList.add("tile");
		this.value = Math.random() > 0.5 ? 2 : 4;
		this.tileElement.textContent = this.value;
		gridElement.append(this.tileElement);
	}
}