/*
  A single slot of the inventory
*/

function Slot(position, width, height) {
  ItemButton.call(this, position, width, height);
  this.empty = false;
  this.index = 0;

}

Slot.prototype = Object.create(ItemButton.prototype)
Slot.prototype.constructor = Slot
