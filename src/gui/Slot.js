/*
  A single slot of the inventory
*/

import ItemButton from "./buttons/ItemButton";
export default class Slot extends ItemButton {
  constructor(position, width, height) {
      super(position, width, height)

      this.empty = false;
      this.index = 0;
  }
}
