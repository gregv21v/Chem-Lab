/**
 * Slot - A single slot of the inventory
 */
import ItemButton from "./buttons/ItemButton";

export default class Slot extends ItemButton {

  /**
   * constructor()
   * @description constructs the slot
   * @param {Point} position the position of the slot
   * @param {Number} width the width of the slot
   * @param {Number} height the height of the slot
   */
  constructor(inventory, index, width, height) {
      super({
				x: inventory.rect.position.x,
				y: inventory.rect.position.y + index * inventory.slotHeight
			}, width, height)

      this._inventory = inventory;
      this._index = 0;
  }

  /**
   * set index
   * @description sets the index of the slot
   * @param {Number} value the value to set the index to
   */
  set index(value) {
    this._index = value;

    this.position = {
      x: this._inventory.rect.position.x,
      y: this._inventory.rect.position.y + value * this._inventory.slotHeight
    }
  }

  /**
	 * onClick()
	 * @description the function called when this button is clicked
	 */
	onClick() {
    console.log("on click");
		this._inventory.pickItem(this._index);
	}
}
