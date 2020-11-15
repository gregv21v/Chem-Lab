/*
  A single slot of the inventory
*/
class Slot extends ItemButton {
  constructor(position, width, height) {
      super(position, width, height)

      this.empty = false;
      this.index = 0;
  }

}
